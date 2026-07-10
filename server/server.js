import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import * as db from './lib/db.js';
import { deleteFromStorage, downloadFromPublicUrl } from './lib/storage.js';
import {
  resolveInstagramReelDirectUrl,
  isAllowedVideoProxyUrl,
  extractInstagramReelId,
} from './lib/videoResolver.js';
import { supabase } from './lib/supabase.js';
import { applySecurityMiddleware } from './middleware/security.js';
import {
  resolveJwtSecret,
  isProduction,
  publicErrorMessage,
  isValidGoogleAppsScriptUrl,
  validatePasswordStrength,
} from './lib/security.js';
import { seedMissingSitePages } from './lib/seedPages.js';
import { FACILITY_SEED_CONTENT, mergeDedicatedFacilityContent } from './lib/facilitySeedContent.js';
import { restorePagesFromJsonBackup } from './lib/restorePagesFromJson.js';

/** Validate that a URL is from Supabase Storage (backend only stores these). */
function isValidStorageUrl(url) {
  return url && typeof url === 'string' && url.trim().length > 0 && url.includes('supabase.co/storage');
}

/** Department images: Supabase URLs or legacy bundled/upload paths. */
function isValidDepartmentImageUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return false;
  const u = url.trim();
  if (isValidStorageUrl(u)) return true;
  if (u.startsWith('/assets/') || u.startsWith('/uploads/')) return true;
  return false;
}

/** Validate media URL: Supabase Storage or Google Drive file link (so Drive links can be used for hero/gallery). */
function isValidMediaUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return false;
  const u = url.trim();
  if (u.startsWith('/uploads/')) return true;
  if (u.includes('supabase.co/storage') || u.includes('storage.supabase.co')) return true;
  if (u.includes('/storage/v1/object/public/')) return true;
  if (u.includes('drive.google.com')) {
    return /\/file\/d\/[a-zA-Z0-9_-]+/.test(u) || /[?&]id=[a-zA-Z0-9_-]+/.test(u);
  }
  return false;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = resolveJwtSecret();

// Middleware
// CORS configuration - allows requests from frontend domains
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000',
  'http://localhost:8080', // Vite port in this project (vite.config.ts)
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://viet-website-gamma.vercel.app',
  'https://pragna.info',
  'https://www.pragna.info',
  'https://vietvsp.com',
  'https://www.vietvsp.com',
  'https://viet.edu.in',
  'https://www.viet.edu.in',
  process.env.FRONTEND_URL, // Vercel / custom domain (set in Render env vars)
].filter(Boolean);

if (!allowedOrigins.some(o => o && o.includes('8080'))) {
  console.warn('CORS: port 8080 not in allowed origins – add http://localhost:8080 if frontend runs on 8080');
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');
    const exactMatch = allowedOrigins.some(allowed => {
      const normalizedAllowed = (allowed || '').replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
    const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEW === 'true';
    const vercelMatch = allowVercelPreviews && normalizedOrigin.endsWith('.vercel.app');

    if (exactMatch || vercelMatch) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
applySecurityMiddleware(app);
app.use(express.json({ limit: '1mb' }));

// Public config for browser Supabase uploads (runtime — not baked into Vite build)
app.get('/api/client-config', (req, res) => {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
  res.json({
    supabaseUrl,
    supabaseAnonKey,
    configured: Boolean(supabaseUrl && supabaseAnonKey),
  });
});

/** Proxy Supabase Storage files for the public site (service role bypasses private bucket 403s). */
app.get('/api/media', async (req, res) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ error: 'Missing url query parameter' });
    }
    const url = decodeURIComponent(rawUrl.trim());
    if (!isValidStorageUrl(url)) {
      return res.status(400).json({ error: 'Invalid storage URL' });
    }
    if (!supabase) {
      return res.status(503).json({ error: 'Storage not configured' });
    }

    const blob = await downloadFromPublicUrl(url);
    if (!blob) {
      return res.status(404).send('File not found');
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    res.setHeader('Content-Type', blob.type || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (error) {
    console.error('Media proxy error:', error);
    res.status(500).send('Failed to load media');
  }
});

/** Resolve Instagram reel/post to a direct MP4 for chromeless gallery playback. */
app.get('/api/resolve-video', async (req, res) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ error: 'Missing url query parameter' });
    }
    const url = decodeURIComponent(rawUrl.trim());
    if (!extractInstagramReelId(url)) {
      return res.status(400).json({ error: 'Only Instagram reel/post URLs are supported' });
    }

    const directUrl = await resolveInstagramReelDirectUrl(url);
    if (!directUrl) {
      return res.status(404).json({ error: 'Could not resolve video from Instagram URL' });
    }

    res.set('Cache-Control', 'public, max-age=3600');
    res.json({
      directUrl,
      proxyUrl: `/api/video-proxy?url=${encodeURIComponent(directUrl)}`,
    });
  } catch (error) {
    console.error('Resolve video error:', error);
    res.status(500).json({ error: 'Failed to resolve video' });
  }
});

/** Stream external MP4 (Instagram CDN, etc.) without exposing platform embed UI. */
app.get('/api/video-proxy', async (req, res) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).send('Missing url');
    }
    const url = decodeURIComponent(rawUrl.trim());
    if (!isAllowedVideoProxyUrl(url)) {
      return res.status(400).send('URL not allowed');
    }

    const upstreamHeaders = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://www.instagram.com/',
      Accept: 'video/mp4,video/*,*/*',
    };
    if (req.headers.range) {
      upstreamHeaders.Range = req.headers.range;
    }

    const upstream = await fetch(url, {
      headers: upstreamHeaders,
      redirect: 'follow',
    });

    if (!upstream.ok && upstream.status !== 206) {
      return res.status(502).send('Upstream video unavailable');
    }

    res.status(upstream.status);
    const passHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
    for (const header of passHeaders) {
      const value = upstream.headers.get(header);
      if (value) res.setHeader(header, value);
    }
    if (!upstream.headers.get('content-type')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!upstream.headers.get('accept-ranges')) {
      res.setHeader('Accept-Ranges', 'bytes');
    }

    if (!upstream.body) {
      res.end();
      return;
    }

    const { Readable } = await import('stream');
    const { pipeline } = await import('stream/promises');
    await pipeline(Readable.fromWeb(upstream.body), res);
  } catch (error) {
    console.error('Video proxy error:', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to proxy video');
    }
  }
});

/** Public Supabase keys for browser uploads (anon key is safe to expose). */
function getPublicSupabaseConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const supabaseAnonKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  return { supabaseUrl, supabaseAnonKey };
}

function injectRuntimeConfig(html) {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
  if (!supabaseUrl || !supabaseAnonKey) return html;
  const script = `<script>window.__VIET_RUNTIME_CONFIG__=${JSON.stringify({
    supabaseUrl,
    supabaseAnonKey,
  })}</script>`;
  if (html.includes('</head>')) {
    return html.replace('</head>', `${script}</head>`);
  }
  return `${script}${html}`;
}

// Resolve paths relative to project root (parent of server/) for reliable deployment
const projectRoot = resolve(__dirname, '..');
const publicDir = resolve(projectRoot, 'public');
const distDir = resolve(projectRoot, 'dist');

// Explore Your Path video: serve from dist first (Vite copies public→dist on build), then public
// Check multiple locations for Render/Vercel/different deployment layouts
app.get('/bgvideoexp.mp4', (req, res, next) => {
  const candidates = [
    resolve(distDir, 'bgvideoexp.mp4'),
    resolve(publicDir, 'bgvideoexp.mp4'),
    resolve(process.cwd(), 'dist', 'bgvideoexp.mp4'),
    resolve(process.cwd(), 'public', 'bgvideoexp.mp4'),
  ];
  const videoPath = candidates.find((p) => existsSync(p));
  if (videoPath) {
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(videoPath);
  }
  next();
});

// Serve static files from public directory with optimized caching
app.use(express.static(publicDir, {
  maxAge: '365d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    if (filePath.match(/\.(mp4|webm|ogg|mov)$/i)) {
      res.set('Accept-Ranges', 'bytes');
      res.set('Cache-Control', 'public, max-age=86400');
    } else if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.match(/\.(css|js)$/i)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.set('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Data directory (for JSON files only - all media files stored in Supabase Storage)
const DATA_DIR = join(__dirname, 'data');

// Ensure data directory exists (for JSON files)
async function ensureDirectories() {
  if (!existsSync(DATA_DIR)) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize data files
async function initializeData() {
  const dataFiles = {
    announcements: { announcements: [] },
    news: { news: [] },
    events: { events: [] },
    carousel: { images: [] },
    departments: { departments: [] },
    faculty: { faculty: [] },
    hods: { hods: [] },
    gallery: { images: [] },
    'home-gallery': { images: [] },
    'vibe-at-viet': { items: [] },
    recruiters: { recruiters: [] },
    pages: { pages: [] },
    users: { users: [] },
    'transport-routes': { routes: [] },
    'department-pages': { pages: {} },
    ticker: { items: [] },
    'hero-videos': { videos: [] },
    'placement-section': {
      title: 'Placement Excellence at VIET',
      subtitle: "Our students are shaping the future at the world's leading technology companies.",
      highestPackageLPA: 10,
      averagePackageLPA: 4.5,
      totalOffers: 250,
      companiesVisited: 53
    },
    'placement-carousel': { images: [] },
    accreditations: { items: [] },
    'aicte-affiliation-letters': { letters: [] },
    'intro-video-settings': { settings: { id: 1, video_url: null, is_enabled: false } },
    'explore-path-video-settings': { settings: { id: 1, video_url: null } },
    'admission-popup-settings': {
      settings: {
        id: 1,
        is_enabled: true,
        title: 'Admissions Open 2025–26',
        subtitle: 'Share your details and our admissions team will contact you shortly.',
        delay_seconds: 2,
        spreadsheet_url: null,
        sheets_webhook_url: null,
      },
    },
    'admission-leads': { leads: [] },
    'faculty-settings': {
      settings: {
        id: 1,
        sort_by: 'custom',
        hero_badge: 'Faculty',
        hero_title: 'Faculty',
        hero_subtitle: 'Our faculty across all departments and streams.',
        hero_background_image: null
      }
    }
  };

  for (const [file, defaultData] of Object.entries(dataFiles)) {
    const filePath = join(DATA_DIR, `${file}.json`);
    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  // Create default admin user if no users exist (development only)
  const users = await db.getUsers();
  if (users.length === 0) {
    if (isProduction()) {
      console.warn('No admin users found. Run: cd server && npm run create-admin');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.createUser({
        username: 'admin',
        email: 'admin@viet.edu.in',
        password: hashedPassword,
        role: 'admin'
      });
      console.warn('Development: default admin created (username: admin, password: admin123). Change before production.');
    }
  }

  // Initialize home-gallery with 8 placeholder images if empty
  try {
    const homeGallery = await db.getHomeGallery();
    if (!homeGallery || homeGallery.length === 0) {
      for (let i = 0; i < 8; i++) {
        await db.createHomeGalleryItem({ image: '/placeholder.svg', order: i });
      }
    }
  } catch (e) { /* db may not be ready */ }

  // Ensure all public site pages exist in DB (prevents admin/public "not found" errors)
  try {
    const seedResult = await seedMissingSitePages(db);
    if (seedResult.created > 0) {
      console.log(`[pages] Seeded ${seedResult.created} new page(s) (${seedResult.skipped} already existed)`);
    }
  } catch (e) {
    console.warn('[pages] Seed check failed:', e?.message || e);
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Map API paths to admin section keys (for sub-admin access control)
const API_TO_SECTION = [
  [/^\/api\/announcements/, 'news-announcements'],
  [/^\/api\/news/, 'news-announcements'],
  [/^\/api\/events/, 'events'],
  [/^\/api\/ticker/, 'ticker'],
  [/^\/api\/hero-videos/, 'hero-videos'],
  [/^\/api\/intro-video-settings/, 'intro-video'],
  [/^\/api\/explore-path-video-settings/, 'intro-video'],
  [/^\/api\/admission-popup-settings/, 'admission-popup'],
  [/^\/api\/admission-leads/, 'admission-popup'],
  [/^\/api\/carousel/, 'hero-videos'],
  [/^\/api\/departments/, 'departments'],
  [/^\/api\/department-pages/, 'department-pages'],
  [/^\/api\/faculty/, 'faculty'],
  [/^\/api\/hods/, 'hods'],
  [/^\/api\/gallery/, 'gallery'],
  [/^\/api\/home-gallery/, 'gallery'],
  [/^\/api\/vibe-at-viet/, 'vibe-at-viet'],
  [/^\/api\/recruiters/, 'recruiters'],
  [/^\/api\/placement-section/, 'placement-section'],
  [/^\/api\/placement-carousel/, 'placement-section'],
  [/^\/api\/transport-routes/, 'transport'],
  [/^\/api\/accreditations/, 'accreditations'],
  [/^\/api\/aicte-affiliation-letters/, 'accreditations'],
  [/^\/api\/pages/, ['pages', 'facilities', 'authorities', 'transport', 'campus-life']],
  [/^\/api\/faculty-settings/, 'faculty'],
];

function getSectionsForPath(path) {
  for (const [re, sectionOrSections] of API_TO_SECTION) {
    if (re.test(path)) {
      return Array.isArray(sectionOrSections) ? sectionOrSections : [sectionOrSections];
    }
  }
  return [];
}

// Sub-admin section check: admin passes through; sub_admin must have section in allowed_sections
const checkSectionAccess = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.role !== 'sub_admin') return res.status(403).json({ error: 'Forbidden' });
  const sections = getSectionsForPath(req.path);
  if (sections.length === 0) {
    return res.status(403).json({ error: 'Access denied to this section' });
  }
  const allowed = req.user.allowedSections || req.user.allowed_sections || [];
  const sectionAllowed = (s) =>
    Array.isArray(allowed) &&
    (allowed.includes(s) || (s === 'transport' && allowed.includes('transport-routes')));
  const hasAccess = sections.some(sectionAllowed);
  if (hasAccess) return next();
  return res.status(403).json({ error: 'Access denied to this section' });
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
};

// ==================== AUTHENTICATION ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await db.findUserByUsernameOrEmail(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const hashed = user.password ?? user.password_hash;
    if (!hashed || typeof hashed !== 'string') {
      console.error('Login: user has no password (id=%s)', user.id);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let validPassword = false;
    try {
      validPassword = await bcrypt.compare(String(password), hashed);
    } catch (err) {
      console.error('Login bcrypt error:', err.message);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const allowedSections = user.allowed_sections ?? user.allowedSections ?? [];
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, allowedSections },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        allowedSections: Array.isArray(allowedSections) ? allowedSections : []
      }
    });
  } catch (error) {
    console.error('Login error:', error?.stack || error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const u = req.user;
  res.json({
    user: {
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      allowedSections: u.allowedSections || u.allowed_sections || []
    }
  });
});

// ==================== SUB-ADMINS (admin only) ====================
app.get('/api/auth/sub-admins', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.getUsers();
    const subAdmins = users
      .filter(u => u.role === 'sub_admin')
      .map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        allowedSections: u.allowed_sections ?? u.allowedSections ?? [],
        createdAt: u.created_at ?? u.createdAt
      }));
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/sub-admins', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, allowedSections } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    const existing = await db.findUserByUsernameOrEmail(username);
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const sections = Array.isArray(allowedSections) ? allowedSections : [];
    const newUser = await db.createUser({
      username: username.trim(),
      email: (email || `${username}@viet.edu.in`).trim(),
      password: hashedPassword,
      role: 'sub_admin',
      allowed_sections: sections
    });
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: 'sub_admin',
      allowedSections: newUser.allowed_sections ?? newUser.allowedSections ?? []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/auth/sub-admins/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const target = await db.getUserById(id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role !== 'sub_admin') {
      return res.status(400).json({ error: 'Can only update sub-admin users' });
    }
    const { username, email, password, allowedSections } = req.body || {};
    const updates = {};
    if (username !== undefined) updates.username = username.trim();
    if (email !== undefined) updates.email = email.trim();
    if (password !== undefined && password) {
      const passwordError = validatePasswordStrength(password);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }
      updates.password = await bcrypt.hash(String(password), 10);
    }
    if (allowedSections !== undefined) {
      updates.allowed_sections = Array.isArray(allowedSections) ? allowedSections : [];
    }
    const updated = await db.updateUser(id, updates);
    res.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      allowedSections: updated.allowed_sections ?? updated.allowedSections ?? []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/auth/sub-admins/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const target = await db.getUserById(id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role !== 'sub_admin') {
      return res.status(400).json({ error: 'Can only delete sub-admin users' });
    }
    await db.deleteUser(id);
    res.json({ message: 'Sub-admin deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VISITOR COUNT (public, no auth) ====================
app.get('/api/visitor-count', async (req, res) => {
  try {
    const stats = await db.getVisitorCount();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ count: 0, todayCount: 0 });
  }
});

app.post('/api/visitor-count', async (req, res) => {
  try {
    const stats = await db.incrementVisitorCount();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ count: 0, todayCount: 0 });
  }
});

// ==================== ANNOUNCEMENTS ROUTES ====================

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await db.getAnnouncements();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/announcements', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const newAnnouncement = await db.createAnnouncement({ ...req.body, updatedAt: new Date().toISOString() });
    res.json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/announcements/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const updated = await db.updateAnnouncement(req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: 'Announcement not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/announcements/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteAnnouncement(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NEWS ROUTES ====================

app.get('/api/news', async (req, res) => {
  try {
    const news = await db.getNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/news', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    if (image && !isValidStorageUrl(image)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    }
    const newNews = await db.createNews({
      title: body.title || '',
      description: body.description || '',
      date: body.date || '',
      link: body.link || '',
      image: image || null,
    });
    res.json(newNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.link !== undefined) updateData.link = body.link;
    if (body.image !== undefined) {
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      if (image && !isValidStorageUrl(image)) {
        return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
      }
      updateData.image = image || null;
    }
    const updated = await db.updateNews(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'News not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteNews(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TICKER ROUTES ====================

app.get('/api/ticker', async (req, res) => {
  try {
    const items = await db.getTicker();
    res.json(items || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ticker', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const newItem = await db.createTickerItem({ text: req.body.text || '', isActive: req.body.isActive !== undefined ? req.body.isActive : true });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ticker/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const updated = await db.updateTickerItem(req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: 'Ticker item not found' });
    res.json(updated);
  } catch (error) {
    console.error('Ticker update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ticker/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteTickerItem(req.params.id);
    res.json({ message: 'Ticker item deleted' });
  } catch (error) {
    console.error('Ticker delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== EVENTS ROUTES ====================

app.get('/api/events', async (req, res) => {
  try {
    const events = await db.getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    if (image && !isValidStorageUrl(image)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    }
    const newEvent = await db.createEvent({
      title: body.title || '',
      description: body.description || '',
      date: body.date || '',
      time: body.time || '',
      time_end: body.time_end || null,
      location: body.location || '',
      link: body.link || '',
      image: image || null,
      featured: body.featured === false ? false : body.featured === true ? true : undefined,
    });
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    if (body.image !== undefined) {
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      if (image && !isValidStorageUrl(image)) {
        return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
      }
      updateData.image = image;
    }
    const updated = await db.updateEvent(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteEvent(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TRANSPORT ROUTES (Bus Routes) ====================

app.get('/api/transport-routes', async (req, res) => {
  try {
    const routes = await db.getTransportRoutes();
    res.json(routes || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transport-routes', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    if (image && !isValidStorageUrl(image)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    }
    const newRoute = await db.createTransportRoute({
      name: body.name || 'Route',
      from: body.from || '',
      to: body.to || 'VIET Campus, Narava',
      stops: parseInt(body.stops, 10) || 0,
      time: body.time || '',
      frequency: body.frequency || 'Morning & Evening',
      busNo: body.busNo || '',
      driverName: body.driverName || '',
      driverContactNo: body.driverContactNo || '',
      seatingCapacity: parseInt(body.seatingCapacity, 10) || 0,
      image: image || null
    });
    res.json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transport-routes/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {
      name: body.name,
      from: body.from,
      to: body.to,
      stops: body.stops !== undefined ? parseInt(body.stops, 10) : undefined,
      time: body.time,
      frequency: body.frequency,
      busNo: body.busNo,
      driverName: body.driverName,
      driverContactNo: body.driverContactNo,
      seatingCapacity: body.seatingCapacity !== undefined ? parseInt(body.seatingCapacity, 10) : undefined
    };
    if (body.image !== undefined) {
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      if (image && !isValidStorageUrl(image)) {
        return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
      }
      updateData.image = image;
    }
    const updated = await db.updateTransportRoute(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Route not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transport-routes/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteTransportRoute(req.params.id);
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CAROUSEL ROUTES ====================

app.get('/api/carousel', async (req, res) => {
  try {
    const images = await db.getCarousel();
    // Set caching headers for API responses
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/carousel', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const src = typeof body.src === 'string' ? body.src.trim() : '';
    if (!src || !isValidStorageUrl(src)) {
      return res.status(400).json({ error: 'src must be a valid Supabase Storage URL' });
    }
    const newImage = await db.createCarouselItem({
      src,
      title: body.title || '',
      subtitle: body.subtitle || '',
      uploadType: 'carousel'
    });
    res.json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/carousel/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    if (body.src !== undefined) {
      const src = typeof body.src === 'string' ? body.src.trim() : '';
      if (src && !isValidStorageUrl(src)) {
        return res.status(400).json({ error: 'src must be a valid Supabase Storage URL' });
      }
      updateData.src = src;
    }
    const updated = await db.updateCarouselItem(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Image not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/carousel/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteCarouselItem(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PLACEMENT CAROUSEL (student images) ROUTES ====================

app.get('/api/placement-carousel', async (req, res) => {
  try {
    const images = await db.getPlacementCarousel();
    res.json(images || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/placement-carousel', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const src = typeof body.src === 'string' ? body.src.trim() : '';
    if (!src || !isValidStorageUrl(src)) {
      return res.status(400).json({ error: 'src must be a valid Supabase Storage URL' });
    }
    const newImage = await db.createPlacementCarouselItem({ src, title: body.title || '', subtitle: body.subtitle || '' });
    res.json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/placement-carousel/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body };
    if (body.src !== undefined) {
      const src = typeof body.src === 'string' ? body.src.trim() : '';
      if (src && !isValidStorageUrl(src)) {
        return res.status(400).json({ error: 'src must be a valid Supabase Storage URL' });
      }
      updateData.src = src;
    }
    const updated = await db.updatePlacementCarouselItem(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Image not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/placement-carousel/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deletePlacementCarouselItem(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HERO VIDEOS ROUTES ====================

app.get('/api/hero-videos', async (req, res) => {
  try {
    const videos = await db.getHeroVideos();
    // Cache hero videos for 5 minutes (critical for LCP)
    res.set('Cache-Control', 'public, max-age=300');
    res.json(videos || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hero videos: backend only stores URLs. Admin uploads video/poster to Supabase Storage, then sends URLs here.
function validateHeroMediaUrl(url, field) {
  if (url && !isValidMediaUrl(url)) {
    return `${field} must be a Supabase Storage URL or Google Drive file link`;
  }
  return null;
}

app.post('/api/hero-videos', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const { src, poster, mobileSrc, mobilePoster, badge, title, subtitle, buttonText, buttonLink } = req.body || {};
    const desktopVideo = typeof src === 'string' ? src.trim() : '';
    const desktopPhoto = typeof poster === 'string' ? poster.trim() : '';
    const mobileVideo = typeof mobileSrc === 'string' ? mobileSrc.trim() : '';
    const mobilePhoto = typeof mobilePoster === 'string' ? mobilePoster.trim() : '';
    if (!desktopVideo && !desktopPhoto && !mobileVideo && !mobilePhoto) {
      return res.status(400).json({ error: 'Upload at least one desktop or mobile video/photo.' });
    }
    for (const [url, field] of [
      [desktopVideo, 'src'],
      [desktopPhoto, 'poster'],
      [mobileVideo, 'mobileSrc'],
      [mobilePhoto, 'mobilePoster'],
    ]) {
      const err = validateHeroMediaUrl(url, field);
      if (err) return res.status(400).json({ error: err });
    }
    const existing = await db.getHeroVideos();
    const newVideo = await db.createHeroVideo({
      src: desktopVideo || '',
      poster: desktopPhoto || null,
      mobileSrc: mobileVideo || null,
      mobilePoster: mobilePhoto || null,
      badge: badge || '',
      title: title || '',
      subtitle: subtitle || '',
      buttonText: buttonText || '',
      buttonLink: buttonLink || '',
      order: (existing?.length || 0)
    });
    res.json(newVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero-videos/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const updateData = {};
    const { src, poster, mobileSrc, mobilePoster, badge, title, subtitle, buttonText, buttonLink } = req.body || {};
    if (src !== undefined) {
      const s = typeof src === 'string' ? src.trim() : null;
      const err = validateHeroMediaUrl(s, 'src');
      if (err) return res.status(400).json({ error: err });
      updateData.src = s;
    }
    if (poster !== undefined) {
      const p = typeof poster === 'string' ? poster.trim() || null : undefined;
      const err = validateHeroMediaUrl(p, 'poster');
      if (err) return res.status(400).json({ error: err });
      updateData.poster = p;
    }
    if (mobileSrc !== undefined) {
      const s = typeof mobileSrc === 'string' ? mobileSrc.trim() || null : undefined;
      const err = validateHeroMediaUrl(s, 'mobileSrc');
      if (err) return res.status(400).json({ error: err });
      updateData.mobileSrc = s;
    }
    if (mobilePoster !== undefined) {
      const p = typeof mobilePoster === 'string' ? mobilePoster.trim() || null : undefined;
      const err = validateHeroMediaUrl(p, 'mobilePoster');
      if (err) return res.status(400).json({ error: err });
      updateData.mobilePoster = p;
    }
    if (badge !== undefined) updateData.badge = badge;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
    if (req.body.order !== undefined) updateData.order = Number(req.body.order);
    const updated = await db.updateHeroVideo(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Video not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero-videos/reorder', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const { orderUpdates } = req.body || {};
    if (!Array.isArray(orderUpdates)) {
      return res.status(400).json({ error: 'orderUpdates must be an array of { id, order }' });
    }
    for (const item of orderUpdates) {
      if (item?.id == null || item?.order == null || Number.isNaN(Number(item.order))) {
        return res.status(400).json({ error: 'Each order update requires id and order' });
      }
    }
    const videos = await db.reorderHeroVideos(
      orderUpdates.map((item) => ({ id: item.id, order: Number(item.order) }))
    );
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to reorder hero slides' });
  }
});

app.delete('/api/hero-videos/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteHeroVideo(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DEPARTMENT ROUTES ====================

app.get('/api/departments', async (req, res) => {
  try {
    const departments = await db.getDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/departments', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    if (image && !isValidDepartmentImageUrl(image)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL or site asset path' });
    }
    const newDept = await db.createDepartment({ name: body.name || '', stream: body.stream || '', level: body.level || '', image: image || null });
    res.json(newDept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/departments/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body };
    if (body.image !== undefined) {
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      if (image && !isValidDepartmentImageUrl(image)) {
        return res.status(400).json({ error: 'image must be a valid Supabase Storage URL or site asset path' });
      }
      updateData.image = image;
    }
    const updated = await db.updateDepartment(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Department not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/departments/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteDepartment(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FACULTY ROUTES ====================

app.get('/api/faculty', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const faculty = await db.getFaculty();
    res.json(faculty || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/faculty', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    const resume = typeof body.resume === 'string' ? body.resume.trim() : null;
    if (image && !isValidStorageUrl(image)) return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    if (resume && !isValidStorageUrl(resume)) return res.status(400).json({ error: 'resume must be a valid Supabase Storage URL' });
    const newFaculty = await db.createFaculty({
      name: body.name || '', designation: body.designation || '', qualification: body.qualification || '',
      email: body.email || '', phone: body.phone || '', experience: body.experience || '',
      department: body.department ?? null, image, resume
    });
    res.json(newFaculty);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create faculty member' });
  }
});

app.put('/api/faculty/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body };
    if (body.image !== undefined) {
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      if (image && !isValidStorageUrl(image)) return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
      updateData.image = image;
    }
    if (body.resume !== undefined) {
      const resume = typeof body.resume === 'string' ? body.resume.trim() : null;
      if (resume && !isValidStorageUrl(resume)) return res.status(400).json({ error: 'resume must be a valid Supabase Storage URL' });
      updateData.resume = resume;
    }
    const updated = await db.updateFaculty(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Faculty not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update faculty member' });
  }
});

app.delete('/api/faculty/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteFaculty(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/faculty/reorder', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const { orderUpdates } = req.body || {};
    if (!Array.isArray(orderUpdates)) {
      return res.status(400).json({ error: 'orderUpdates must be an array of { id, sort_order }' });
    }
    const updated = await db.reorderFaculty(orderUpdates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to reorder faculty' });
  }
});

// ==================== HOD ROUTES ====================

app.get('/api/hods', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const hods = await db.getHods();
    res.json(hods || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hods', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : null;
    const resume = typeof body.resume === 'string' ? body.resume.trim() : null;
    if (image && !isValidStorageUrl(image)) return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    if (resume && !isValidStorageUrl(resume)) return res.status(400).json({ error: 'resume must be a valid Supabase Storage URL' });
    const newHOD = await db.createHod({
      name: body.name || '', designation: body.designation || '', qualification: body.qualification || '',
      email: body.email || '', phone: body.phone || '', experience: body.experience || '',
      department: body.department || '', image, resume
    });
    res.json(newHOD);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create HOD' });
  }
});

app.put('/api/hods/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body };
    if (body.image !== undefined) {
      const image = typeof body.image === 'string' ? body.image.trim() : null;
      if (image && !isValidStorageUrl(image)) return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
      updateData.image = image;
    }
    if (body.resume !== undefined) {
      const resume = typeof body.resume === 'string' ? body.resume.trim() : null;
      if (resume && !isValidStorageUrl(resume)) return res.status(400).json({ error: 'resume must be a valid Supabase Storage URL' });
      updateData.resume = resume;
    }
    const updated = await db.updateHod(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'HOD not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update HOD' });
  }
});

app.delete('/api/hods/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteHod(req.params.id);
    res.json({ message: 'HOD deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hods/reorder', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const { orderUpdates } = req.body || {};
    if (!Array.isArray(orderUpdates)) {
      return res.status(400).json({ error: 'orderUpdates must be an array of { id, sort_order }' });
    }
    const updated = await db.reorderHods(orderUpdates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to reorder HODs' });
  }
});

// ==================== GALLERY ROUTES ====================

app.get('/api/gallery', async (req, res) => {
  try {
    const images = await db.getGallery();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gallery/page', async (req, res) => {
  try {
    const page = await db.getGalleryPage();
    res.set('Cache-Control', 'public, max-age=120');
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/gallery/settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const updated = await db.updateGallerySettings(req.body || {});
    res.json(updated.settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gallery/events', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name) return res.status(400).json({ error: 'Event name is required' });
    const event = await db.createGalleryEvent({
      name,
      badge: req.body?.badge || '',
      description: req.body?.description || '',
      order: req.body?.order,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/gallery/events/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const updated = await db.updateGalleryEvent(req.params.id, {
      name: req.body?.name,
      badge: req.body?.badge,
      description: req.body?.description,
      order: req.body?.order,
    });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/events/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteGalleryEvent(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gallery', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const src = typeof body.src === 'string' ? body.src.trim() : '';
    if (!src || !isValidMediaUrl(src)) {
      return res.status(400).json({ error: 'src must be a Supabase Storage URL or Google Drive file link' });
    }
    const newImage = await db.createGalleryItem({
      src,
      alt: body.alt || body.caption || 'Gallery image',
      department: body.department || '',
      eventId: body.eventId,
      eventName: body.eventName || '',
      caption: body.caption || body.alt || '',
    });
    res.json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteGalleryItem(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PLACEMENT SECTION (home page) ====================

app.get('/api/placement-section', async (req, res) => {
  try {
    const data = await db.getPlacementSection();
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/placement-section', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updated = await db.updatePlacementSection({
      title: body.title,
      subtitle: body.subtitle,
      highestPackageLPA: body.highestPackageLPA !== undefined ? Number(body.highestPackageLPA) : undefined,
      averagePackageLPA: body.averagePackageLPA !== undefined ? Number(body.averagePackageLPA) : undefined,
      totalOffers: body.totalOffers !== undefined ? Number(body.totalOffers) : undefined,
      companiesVisited: body.companiesVisited !== undefined ? Number(body.companiesVisited) : undefined
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== RECRUITERS ROUTES ====================

app.get('/api/recruiters', async (req, res) => {
  try {
    const recruiters = await db.getRecruiters();
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recruiters', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const logo = typeof body.logo === 'string' ? body.logo.trim() : '';
    if (!logo || !isValidStorageUrl(logo)) {
      return res.status(400).json({ error: 'logo must be a valid Supabase Storage URL' });
    }
    const newRecruiter = await db.createRecruiter({ name: body.name || '', logo, description: body.description || '' });
    res.json(newRecruiter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/recruiters/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = { ...body };
    if (body.logo !== undefined) {
      const logo = typeof body.logo === 'string' ? body.logo.trim() : '';
      if (logo && !isValidStorageUrl(logo)) {
        return res.status(400).json({ error: 'logo must be a valid Supabase Storage URL' });
      }
      updateData.logo = logo;
    }
    const updated = await db.updateRecruiter(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Recruiter not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/recruiters/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteRecruiter(req.params.id);
    res.json({ message: 'Recruiter deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HOME GALLERY ROUTES ====================

app.get('/api/home-gallery', async (req, res) => {
  try {
    let images = (await db.getHomeGallery() || []).slice(0, 8).sort((a, b) => (a.order || 0) - (b.order || 0));
    while (images.length < 8) {
      images.push({ id: `placeholder-${images.length}`, image: '/placeholder.svg', order: images.length });
    }
    res.json(images);
  } catch (error) {
    res.json(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, image: '/placeholder.svg', order: i })));
  }
});

app.put('/api/home-gallery/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const image = typeof body.image === 'string' ? body.image.trim() : '';
    if (!image || !isValidStorageUrl(image)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    }
    const updated = await db.updateHomeGalleryItem(req.params.id, { image });
    if (!updated) return res.status(404).json({ error: 'Image not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update image' });
  }
});

// ==================== VIBE@VIET ROUTES ====================

app.get('/api/vibe-at-viet', async (req, res) => {
  try {
    const items = await db.getVibeAtViet();
    res.set('Cache-Control', 'no-store');
    res.json((items || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  } catch (error) {
    res.set('Cache-Control', 'no-store');
    res.status(500).json({ error: error.message || 'Failed to load vibe-at-viet items' });
  }
});

// Vibe-at-viet: image and video are URLs only (admin uploads to Supabase Storage first). imageLink for external (e.g. Google Drive).
app.post('/api/vibe-at-viet', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const caption = body.caption ?? '';
    const position = body.position !== undefined ? Math.max(1, Math.min(11, parseInt(body.position, 10) || 1)) : 1;
    const image = (typeof body.image === 'string' ? body.image.trim() : null) || (body.imageLink?.trim() || null) || null;
    const videoUrl = body.video?.trim() || body.videoLink?.trim() || null;
    const videoLink = body.videoLink?.trim() || videoUrl || null;

    if (!image) {
      return res.status(400).json({ error: 'image or imageLink is required (Supabase Storage URL or external link)' });
    }
    if (image && !image.includes('supabase.co/storage') && !image.startsWith('http')) {
      return res.status(400).json({ error: 'image must be a Supabase Storage URL or valid external URL' });
    }

    const targetOrder = position - 1;
    await db.clearVibeAtVietSlot(targetOrder);
    const item = await db.createVibeAtVietItem({ image, video: videoUrl, videoLink: videoLink || null, caption, order: targetOrder });
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating vibe-at-viet item:', error);
    res.status(500).json({ error: error.message || 'Failed to add item' });
  }
});

app.put('/api/vibe-at-viet/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};
    if (body.image !== undefined) updateData.image = typeof body.image === 'string' ? body.image.trim() || null : null;
    if (body.imageLink !== undefined) updateData.image = body.imageLink?.trim() || null;
    if (body.video !== undefined) updateData.video = body.video?.trim() || null;
    if (body.videoLink !== undefined) {
      const link = body.videoLink?.trim() || null;
      updateData.videoLink = link;
      if (body.video === undefined && link) updateData.video = link;
      if (body.video === undefined && !link) updateData.video = null;
    }
    if (body.caption !== undefined) updateData.caption = body.caption;
    if (body.order !== undefined) {
      updateData.order = Math.max(0, Math.min(10, parseInt(body.order, 10) || 0));
      await db.clearVibeAtVietSlot(updateData.order, req.params.id);
    }

    const updated = await db.updateVibeAtVietItem(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update item' });
  }
});

app.delete('/api/vibe-at-viet/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteVibeAtVietItem(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to delete item' });
  }
});

function mergePageContent(existingContent, newContent) {
  const currentContent = existingContent || {};
  const incoming = newContent || {};

  const cleanedContent = { ...currentContent };
  Object.keys(cleanedContent).forEach((key) => {
    if (key.startsWith('image') || key === 'heroImage' || key === 'profileImage') {
      if (!Object.prototype.hasOwnProperty.call(incoming, key) || incoming[key] === '' || incoming[key] == null) {
        delete cleanedContent[key];
      }
    }
  });

  const cleanedNewContent = {};
  Object.keys(incoming).forEach((key) => {
    if (key.endsWith('_preview')) return;
    if (key.startsWith('image') || key === 'heroImage' || key === 'profileImage') {
      if (incoming[key] != null && incoming[key] !== '') {
        cleanedNewContent[key] = incoming[key];
      }
    } else {
      cleanedNewContent[key] = incoming[key];
    }
  });

  return { ...cleanedContent, ...cleanedNewContent };
}

// ==================== PAGES ROUTES ====================

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await db.getPages();
    res.json(pages || []);
  } catch (error) {
    res.status(500).json({ error: publicErrorMessage(error, 'Failed to load pages') });
  }
});

app.post('/api/pages/seed', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const result = await seedMissingSitePages(db);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: publicErrorMessage(error, 'Failed to seed pages') });
  }
});

app.post('/api/pages/restore-backup', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const force = Boolean(req.body?.force);
    const result = await restorePagesFromJsonBackup({ force });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: publicErrorMessage(error, 'Failed to restore pages from backup') });
  }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
  try {
    const page = await db.getPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    const dedicatedSeed = FACILITY_SEED_CONTENT[req.params.slug];
    if (dedicatedSeed) {
      page.content = mergeDedicatedFacilityContent(page.content || {}, dedicatedSeed);
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const page = await db.getPageById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pages', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const newPage = await db.createPage({
      slug: req.body.slug,
      title: req.body.title,
      route: req.body.route,
      category: req.body.category,
      content: req.body.content || {}
    });
    res.json(newPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pages/slug/:slug', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const slug = req.params.slug;
    const existing = await db.getPageBySlug(slug);
    const finalContent = mergePageContent(existing?.content, req.body.content);
    const payload = {
      slug,
      title: req.body.title,
      route: req.body.route,
      category: req.body.category,
      content: finalContent,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const updated = await db.updatePage(existing.id, payload);
      if (!updated) return res.status(500).json({ error: 'Failed to update page' });
      return res.json(updated);
    }

    const created = await db.createPage(payload);
    res.json(created);
  } catch (error) {
    console.error('Error upserting page by slug:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pages/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const existingPage = await db.getPageById(pageId);
    if (!existingPage) return res.status(404).json({ error: 'Page not found' });

    const currentContent = existingPage.content || {};
    const finalContent = mergePageContent(currentContent, req.body.content || {});
    const updatePayload = {
      slug: req.body.slug ?? existingPage.slug,
      title: req.body.title ?? existingPage.title,
      route: req.body.route ?? existingPage.route,
      category: req.body.category ?? existingPage.category,
      content: finalContent,
      updated_at: new Date().toISOString(),
    };

    const updated = await db.updatePage(pageId, updatePayload);
    if (!updated) return res.status(500).json({ error: 'Failed to update page' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pages/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const page = await db.getPageById(pageId);
    if (!page) return res.status(404).json({ error: 'Page not found' });

    if (page.content && typeof page.content === 'object') {
      const imageKeys = ['heroImage', 'profileImage', 'image1', 'image2', 'image3'];
      for (const key of imageKeys) {
        const url = page.content[key];
        if (url && url.includes('supabase.co/storage')) {
          await deleteFromStorage(url).catch(err => console.error('Error deleting from storage:', err));
        }
      }
    }

    await db.deletePage(pageId);
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ACCREDITATIONS (main page PDFs: AUTONOMOUS, NAAC, UGC, ISO, AICTE) ====================
app.get('/api/accreditations', async (req, res) => {
  try {
    const list = await db.getAccreditations();
    // Don't cache: admin may update PDFs and users should see changes immediately
    res.set('Cache-Control', 'no-store');
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/accreditations/:key', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const key = req.params.key;
    const body = req.body || {};
    const pdfUrl = typeof body.pdf_url === 'string' ? body.pdf_url.trim() : (body.pdf_url === null ? null : undefined);
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.logo !== undefined) updateData.logo = body.logo;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    if (pdfUrl !== undefined) updateData.pdf_url = pdfUrl;
    if (pdfUrl && !isValidStorageUrl(pdfUrl)) {
      return res.status(400).json({ error: 'pdf_url must be a valid Supabase Storage URL' });
    }
    const updated = await db.updateAccreditation(key, updateData);
    if (!updated) return res.status(404).json({ error: 'Accreditation not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AICTE AFFILIATION LETTERS (year-wise; create, update, delete; one is_latest = green) ====================
app.get('/api/aicte-affiliation-letters', async (req, res) => {
  try {
    const letters = await db.getAicteAffiliationLetters();
    // Don't cache: latest flag should reflect instantly after admin changes
    res.set('Cache-Control', 'no-store');
    res.json(letters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/aicte-affiliation-letters', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const year = typeof body.year === 'string' ? body.year.trim() : '';
    if (!year) return res.status(400).json({ error: 'year is required' });
    const pdfUrl = typeof body.pdf_url === 'string' ? body.pdf_url.trim() : null;
    if (pdfUrl && !isValidStorageUrl(pdfUrl)) {
      return res.status(400).json({ error: 'pdf_url must be a valid Supabase Storage URL' });
    }
    const newLetter = await db.createAicteAffiliationLetter({
      year,
      pdf_url: pdfUrl,
      is_latest: !!body.is_latest,
      sort_order: body.sort_order ?? 0
    });
    res.json(newLetter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/aicte-affiliation-letters/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const updateData = {};
    if (body.year !== undefined) updateData.year = body.year;
    if (body.pdf_url !== undefined) {
      const pdfUrl = body.pdf_url === null ? null : (typeof body.pdf_url === 'string' ? body.pdf_url.trim() : undefined);
      if (pdfUrl !== undefined && pdfUrl !== null && !isValidStorageUrl(pdfUrl)) {
        return res.status(400).json({ error: 'pdf_url must be a valid Supabase Storage URL' });
      }
      updateData.pdf_url = pdfUrl;
    }
    if (body.is_latest !== undefined) updateData.is_latest = body.is_latest;
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    const updated = await db.updateAicteAffiliationLetter(id, updateData);
    if (!updated) return res.status(404).json({ error: 'Letter not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/aicte-affiliation-letters/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const letter = await db.getAicteAffiliationLetters().then(letters => letters.find(l => String(l.id) === String(req.params.id)));
    if (letter && letter.pdf_url && letter.pdf_url.includes('supabase.co/storage')) {
      await deleteFromStorage(letter.pdf_url).catch(() => {});
    }
    await db.deleteAicteAffiliationLetter(req.params.id);
    res.json({ message: 'Letter deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INTRO VIDEO SETTINGS ROUTES ====================

app.get('/api/intro-video-settings', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const settings = await db.getIntroVideoSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/intro-video-settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};
    
    if (body.video_url !== undefined) {
      const videoUrl = body.video_url === null ? null : (typeof body.video_url === 'string' ? body.video_url.trim() : undefined);
      if (videoUrl !== undefined && videoUrl !== null && !isValidStorageUrl(videoUrl)) {
        return res.status(400).json({ error: 'video_url must be a valid Supabase Storage URL' });
      }
      updateData.video_url = videoUrl;
    }
    
    if (body.is_enabled !== undefined) {
      updateData.is_enabled = Boolean(body.is_enabled);
    }
    
    const updated = await db.updateIntroVideoSettings(updateData);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update intro video settings' });
  }
});

app.delete('/api/intro-video-settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const settings = await db.getIntroVideoSettings();
    if (settings && settings.video_url && settings.video_url.includes('supabase.co/storage')) {
      await deleteFromStorage(settings.video_url).catch(() => {});
    }
    const updated = await db.updateIntroVideoSettings({ video_url: null, is_enabled: false });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMISSION POPUP ROUTES ====================

function isValidIndianMobile(mobile) {
  return /^[6-9]\d{9}$/.test(String(mobile || '').replace(/\D/g, '').slice(-10));
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function parseGoogleScriptResponse(text) {
  const trimmed = String(text || '').trim();
  try {
    const json = JSON.parse(trimmed);
    if (json.success === true) {
      return { ok: true, body: trimmed };
    }
    return {
      ok: false,
      reason: 'script_error',
      body: trimmed,
      message: json.error || 'Apps Script returned success: false',
    };
  } catch {
    return {
      ok: false,
      reason: 'invalid_response',
      body: trimmed.slice(0, 500),
      message:
        'Google returned an HTML page instead of JSON. Redeploy the Apps Script (New version, Anyone access, /exec URL) and ensure the script is created from Extensions → Apps Script inside your sheet.',
    };
  }
}

async function sendToGoogleAppsScript(url, payload) {
  const baseUrl = url.trim().replace(/\/dev$/, '/exec');
  const query = new URLSearchParams({ data: JSON.stringify(payload) }).toString();

  const fetchGet = async (requestUrl) =>
    fetch(requestUrl, { method: 'GET', redirect: 'manual' });

  // GET + query string is the most reliable way to call GAS web apps from a server
  let requestUrl = `${baseUrl}?${query}`;
  let response = await fetchGet(requestUrl);

  for (let attempt = 0; attempt < 5; attempt++) {
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    const location = response.headers.get('location');
    if (!location) break;
    requestUrl = location.includes('data=')
      ? location
      : `${location}${location.includes('?') ? '&' : '?'}${query}`;
    response = await fetchGet(requestUrl);
  }

  return response;
}

async function syncAdmissionLeadToGoogleSheets(lead, webhookUrl) {
  const url = webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url || typeof url !== 'string' || !url.trim()) {
    console.warn('[Sheets] Webhook URL not configured — lead saved to database only');
    return { ok: false, reason: 'no_url' };
  }
  if (!isValidGoogleAppsScriptUrl(url)) {
    console.warn('[Sheets] Webhook URL must be a Google Apps Script /exec URL on script.google.com');
    return { ok: false, reason: 'invalid_url' };
  }

  try {
    const response = await sendToGoogleAppsScript(url, lead);
    const text = await response.text();
    const parsed = parseGoogleScriptResponse(text);
    if (!parsed.ok) {
      console.error('[Sheets] Sync failed:', parsed.reason, parsed.message, text.slice(0, 300));
      return {
        ok: false,
        reason: parsed.reason,
        status: response.status,
        body: parsed.body,
        message: parsed.message,
      };
    }
    console.log('[Sheets] Sync OK for lead id', lead.id);
    return { ok: true, body: text };
  } catch (error) {
    console.error('[Sheets] Sync error:', error.message);
    return { ok: false, reason: 'exception', message: error.message };
  }
}

function admissionLeadToCsvRow(lead) {
  const escape = (val) => {
    const s = val == null ? '' : String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  return [
    lead.created_at || '',
    lead.name || '',
    lead.mobile || '',
    lead.email || '',
    lead.program || '',
    lead.qualification || '',
    lead.city || '',
    lead.district || '',
    lead.message || '',
  ].map(escape).join(',');
}

app.get('/api/admission-popup-settings', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const settings = await db.getAdmissionPopupSettings();
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let canViewAdminFields = false;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') {
          canViewAdminFields = true;
        } else if (decoded.role === 'sub_admin') {
          const allowed = decoded.allowedSections || decoded.allowed_sections || [];
          canViewAdminFields = Array.isArray(allowed) && allowed.includes('admission-popup');
        }
      } catch {
        canViewAdminFields = false;
      }
    }
    if (canViewAdminFields) {
      return res.json(settings);
    }
    res.json({
      id: settings.id,
      is_enabled: settings.is_enabled,
      title: settings.title,
      subtitle: settings.subtitle,
      delay_seconds: settings.delay_seconds ?? 2,
      images: Array.isArray(settings.images) ? settings.images : [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admission-popup-settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};
    if (body.is_enabled !== undefined) updateData.is_enabled = Boolean(body.is_enabled);
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.delay_seconds !== undefined) updateData.delay_seconds = body.delay_seconds;
    if (body.spreadsheet_url !== undefined) updateData.spreadsheet_url = body.spreadsheet_url;
    if (body.sheets_webhook_url !== undefined) {
      const webhook = body.sheets_webhook_url ? String(body.sheets_webhook_url).trim() : null;
      if (webhook && !isValidGoogleAppsScriptUrl(webhook)) {
        return res.status(400).json({ error: 'sheets_webhook_url must be a valid Google Apps Script /exec URL' });
      }
      updateData.sheets_webhook_url = webhook;
    }
    if (body.images !== undefined) updateData.images = body.images;
    const updated = await db.updateAdmissionPopupSettings(updateData);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update admission popup settings' });
  }
});

app.post('/api/admission-popup-settings/test-sheets', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const settings = await db.getAdmissionPopupSettings();
    const webhookUrl = req.body?.sheets_webhook_url || settings.sheets_webhook_url;
    const result = await syncAdmissionLeadToGoogleSheets(
      {
        created_at: new Date().toISOString(),
        name: 'Test Connection',
        mobile: '9999999999',
        email: 'test@viet.edu.in',
        program: 'Test Programme',
        qualification: 'Test',
        city: 'Visakhapatnam',
        district: 'Test',
        message: 'Webhook test from VIET admin panel — you can delete this row',
      },
      webhookUrl
    );

    if (result.ok) {
      return res.json({
        success: true,
        message: 'Test row sent successfully. Check your Google Sheet (last row).',
      });
    }

    const messages = {
      no_url: 'Webhook URL is empty. Paste your Google Apps Script Web App URL and click Save.',
      invalid_url: 'Webhook URL must look like https://script.google.com/macros/s/.../exec',
      http_error: `Google returned HTTP ${result.status}. Re-deploy the Apps Script (Anyone access) and use the /exec URL.`,
      script_error: result.message || 'Apps Script failed to write the row.',
      invalid_response: result.message || 'Google did not confirm the write. Update Apps Script and redeploy.',
      exception: result.message || 'Connection failed',
    };

    res.status(400).json({
      success: false,
      reason: result.reason,
      error: messages[result.reason] || result.message || 'Spreadsheet sync failed',
      detail: result.body ? String(result.body).slice(0, 200) : undefined,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Test failed' });
  }
});

app.get('/api/admission-leads', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const leads = await db.getAdmissionLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admission-leads/export', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const leads = await db.getAdmissionLeads();
    const header = 'Timestamp,Name,Mobile,Email,Program,Qualification,City,District,Message\n';
    const rows = leads.map(admissionLeadToCsvRow).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="admission-leads.csv"');
    res.send(header + rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admission-leads', async (req, res) => {
  try {
    const body = req.body || {};
    if (body._website) {
      return res.json({ success: true });
    }

    const name = String(body.name || '').trim();
    const mobileRaw = String(body.mobile || '').replace(/\D/g, '');
    const mobile = mobileRaw.slice(-10);
    const email = body.email ? String(body.email).trim() : '';
    const program = body.program ? String(body.program).trim() : '';

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please enter your full name' });
    }
    if (!isValidIndianMobile(mobile)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!program) {
      return res.status(400).json({ error: 'Please select a programme' });
    }

    const lead = await db.createAdmissionLead({
      name,
      mobile,
      email: email || null,
      program,
      qualification: body.qualification,
      city: body.city,
      district: body.district,
      message: body.message,
      source: 'popup',
    });

    const settings = await db.getAdmissionPopupSettings();
    syncAdmissionLeadToGoogleSheets(lead, settings.sheets_webhook_url).catch((err) => {
      console.error('[Sheets] Unhandled sync error:', err?.message || err);
    });

    res.status(201).json({ success: true, id: lead.id });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
});

app.delete('/api/admission-leads/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    await db.deleteAdmissionLead(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXPLORE PATH VIDEO SETTINGS ROUTES ====================

function resolveExplorePathVideoUrl(settings) {
  return (
    settings?.video_url ||
    process.env.EXPLORE_PATH_VIDEO_URL ||
    process.env.VITE_BGVIDEOEXP_URL ||
    null
  );
}

function isValidExplorePathVideoFile(filePath) {
  if (!existsSync(filePath)) return false;
  try {
    const buf = readFileSync(filePath);
    if (buf.length < 12) return false;
    if (buf.slice(0, 22).toString('utf8').startsWith('version https://git-lfs')) return false;
    return buf.slice(4, 8).toString('ascii') === 'ftyp';
  } catch {
    return false;
  }
}

app.get('/api/explore-path-video-settings', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const settings = await db.getExplorePathVideoSettings();
    const video_url = resolveExplorePathVideoUrl(settings);
    res.json({ ...settings, video_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/explore-path-video-settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};
    if (body.video_url !== undefined) {
      const videoUrl = body.video_url === null ? null : (typeof body.video_url === 'string' ? body.video_url.trim() : undefined);
      if (videoUrl !== undefined && videoUrl !== null && !isValidStorageUrl(videoUrl)) {
        return res.status(400).json({ error: 'video_url must be a valid Supabase Storage URL' });
      }
      updateData.video_url = videoUrl;
    }
    const updated = await db.updateExplorePathVideoSettings(updateData);
    res.json({ ...updated, video_url: resolveExplorePathVideoUrl(updated) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update explore path video settings' });
  }
});

app.delete('/api/explore-path-video-settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const settings = await db.getExplorePathVideoSettings();
    if (settings?.video_url?.includes('supabase.co/storage')) {
      await deleteFromStorage(settings.video_url).catch(() => {});
    }
    const updated = await db.updateExplorePathVideoSettings({ video_url: null });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FACULTY SETTINGS ROUTES ====================

app.get('/api/faculty-settings', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const settings = await db.getFacultySettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/faculty-settings', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const validSortBy = ['custom', 'experience', 'designation', 'designation-experience'];
    if (body.sort_by !== undefined && !validSortBy.includes(body.sort_by)) {
      return res.status(400).json({ error: 'sort_by must be one of: custom, experience, designation, designation-experience' });
    }
    const sanitizeText = (value, max = 300) =>
      value === undefined ? undefined : String(value ?? '').trim().slice(0, max);
    const sanitizeNullableText = (value, max = 2000) => {
      if (value === undefined) return undefined;
      const trimmed = String(value ?? '').trim();
      return trimmed ? trimmed.slice(0, max) : null;
    };
    const updated = await db.updateFacultySettings({
      sort_by: body.sort_by,
      hero_badge: sanitizeText(body.hero_badge, 80),
      hero_title: sanitizeText(body.hero_title, 120),
      hero_subtitle: sanitizeText(body.hero_subtitle, 500),
      hero_background_image: sanitizeNullableText(body.hero_background_image, 2000),
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update faculty settings' });
  }
});

// ==================== DEPARTMENT PAGES (editable content + curriculum) ====================

app.get('/api/department-pages', async (req, res) => {
  try {
    const pages = await db.getDepartmentPages();
    res.json(pages || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/department-pages/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const page = await db.getDepartmentPageBySlug(slug);
    if (!page) {
      return res.json({ slug, sections: {}, curriculum: { programs: [] } });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/department-pages/:slug', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const slug = req.params.slug;
    const existing = await db.getDepartmentPageBySlug(slug) || { slug, sections: {}, curriculum: { programs: [] } };
    const updated = await db.upsertDepartmentPage(slug, {
      ...existing,
      ...req.body,
      slug
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Department page hero image: accept image URL in JSON (admin uploads to Supabase first)
app.post('/api/department-pages/:slug/hero-image', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const imageUrl = typeof body.image === 'string' ? body.image.trim() : '';
    if (!imageUrl || !isValidStorageUrl(imageUrl)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
    }
    const slug = req.params.slug;
    const page = await db.getDepartmentPageBySlug(slug) || { slug, sections: {}, curriculum: { programs: [] } };
    const sections = page.sections || {};
    const hero = sections.hero || {};
    if (hero.image && hero.image.includes('supabase.co/storage')) {
      await deleteFromStorage(hero.image).catch(() => {});
    }
    const updatedSections = { ...sections, hero: { ...hero, image: imageUrl } };
    const updated = await db.upsertDepartmentPage(slug, { sections: updatedSections, curriculum: page.curriculum || { programs: [] } });
    res.json({ image: imageUrl, page: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Department page asset: accept file URL in JSON (admin uploads to Supabase first)
app.post('/api/department-pages/:slug/asset', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const fileUrl = typeof body.url === 'string' ? body.url.trim() : '';
    const filename = typeof body.filename === 'string' ? body.filename : 'asset';
    if (!fileUrl || !isValidStorageUrl(fileUrl)) {
      return res.status(400).json({ error: 'url must be a valid Supabase Storage URL' });
    }
    res.json({ url: fileUrl, filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Curriculum: accept syllabus fileUrl in JSON (admin uploads PDF to Supabase first)
app.post('/api/department-pages/:slug/curriculum', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const slug = req.params.slug;
    const page = await db.getDepartmentPageBySlug(slug) || { slug, sections: {}, curriculum: { programs: [] } };
    const curriculum = page.curriculum || { programs: [] };
    if (!curriculum.programs) curriculum.programs = [];

    const programName = (body.program || '').trim();
    const regulationName = (body.regulation || '').trim();
    const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '';
    const fileName = typeof body.fileName === 'string' ? body.fileName : 'syllabus.pdf';

    if (!programName || !regulationName) {
      return res.status(400).json({ error: 'Program and regulation are required' });
    }
    if (!fileUrl || !isValidStorageUrl(fileUrl)) {
      return res.status(400).json({ error: 'fileUrl must be a valid Supabase Storage URL' });
    }

    let programEntry = curriculum.programs.find(p => p.name === programName);
    if (!programEntry) {
      programEntry = { name: programName, regulations: [] };
      curriculum.programs.push(programEntry);
    }
    if (!programEntry.regulations) programEntry.regulations = [];

    const existingReg = programEntry.regulations.find(r => r.name === regulationName);
    if (existingReg) {
      if (existingReg.fileUrl && existingReg.fileUrl.includes('supabase.co/storage')) {
        await deleteFromStorage(existingReg.fileUrl).catch(() => {});
      }
      existingReg.fileUrl = fileUrl;
      existingReg.fileName = fileName;
      existingReg.updatedAt = new Date().toISOString();
    } else {
      programEntry.regulations.push({
        name: regulationName,
        fileUrl,
        fileName,
        createdAt: new Date().toISOString()
      });
    }

    const updated = await db.upsertDepartmentPage(slug, { sections: page.sections || {}, curriculum });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a regulation from a program
app.delete('/api/department-pages/:slug/curriculum/:program/:regulation', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const slug = req.params.slug;
    const programName = decodeURIComponent(req.params.program);
    const regulationName = decodeURIComponent(req.params.regulation);
    
    const page = await db.getDepartmentPageBySlug(slug);
    if (!page || !page.curriculum || !page.curriculum.programs) {
      return res.status(404).json({ error: 'Page or curriculum not found' });
    }

    const curriculum = { ...page.curriculum, programs: [...page.curriculum.programs] };
    const programEntry = curriculum.programs.find(p => p.name === programName);
    if (!programEntry || !programEntry.regulations) {
      return res.status(404).json({ error: 'Program or regulation not found' });
    }

    const regulationIndex = programEntry.regulations.findIndex(r => r.name === regulationName);
    if (regulationIndex === -1) {
      return res.status(404).json({ error: 'Regulation not found' });
    }

    const regulation = programEntry.regulations[regulationIndex];
    
    if (regulation.fileUrl && regulation.fileUrl.includes('supabase.co/storage')) {
      await deleteFromStorage(regulation.fileUrl).catch(() => {});
    }

    // Remove the regulation from the array
    programEntry.regulations.splice(regulationIndex, 1);

    // If program has no regulations left, remove the program
    if (programEntry.regulations.length === 0) {
      const programIndex = curriculum.programs.findIndex(p => p.name === programName);
      if (programIndex !== -1) {
        curriculum.programs.splice(programIndex, 1);
      }
    }

    const updated = await db.upsertDepartmentPage(slug, { sections: page.sections || {}, curriculum });
    res.json({ message: 'Regulation deleted successfully', page: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve built frontend (Vite dist) when running as single service (e.g. Render)
if (existsSync(distDir)) {
  app.use(express.static(distDir, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.includes('.')) return res.status(404).send('Not found');
    try {
      const indexPath = resolve(distDir, 'index.html');
      const html = readFileSync(indexPath, 'utf8');
      res.type('html').send(injectRuntimeConfig(html));
    } catch (err) {
      next(err);
    }
  });
}

// Initialize server — listen immediately so the Vite proxy can connect while seeding runs in background
async function startServer() {
  await ensureDirectories();
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT} and http://10.110.70.194:${PORT}`);
    console.log(`Database: ${supabase ? 'Supabase ✓' : 'JSON files (fallback)'}`);
    const pub = getPublicSupabaseConfig();
    console.log(
      `Admin uploads (browser): ${pub.supabaseUrl && pub.supabaseAnonKey ? 'configured ✓' : 'missing SUPABASE_ANON_KEY'}`
    );
    if (!isProduction()) {
      console.log('Development mode: ensure default admin password is changed before production deploy.');
    }
    try {
      const exploreSettings = await db.getExplorePathVideoSettings();
      const remoteUrl = resolveExplorePathVideoUrl(exploreSettings);
      const localCandidates = [
        resolve(distDir, 'bgvideoexp.mp4'),
        resolve(publicDir, 'bgvideoexp.mp4'),
      ];
      const localVideo = localCandidates.find((p) => isValidExplorePathVideoFile(p));
      if (remoteUrl) {
        console.log(`Explore path video: Supabase/env URL configured`);
      } else if (localVideo) {
        console.log(`Explore path video: serving local file (${localVideo})`);
      } else {
        console.warn(
          'Explore path video: no valid video found. Upload via Admin → Intro Video, or set EXPLORE_PATH_VIDEO_URL / run git lfs pull before build.'
        );
      }
    } catch (e) {
      console.warn('Explore path video: could not verify video source');
    }
  });

  initializeData().catch((e) => {
    console.warn('[init] Background data initialization failed:', e?.message || e);
  });
}

startServer().catch(console.error);
