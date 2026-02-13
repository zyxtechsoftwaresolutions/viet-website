import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import * as db from './lib/db.js';
import { deleteFromStorage } from './lib/storage.js';
import { supabase } from './lib/supabase.js';

/** Validate that a URL is from Supabase Storage (backend only stores these). */
function isValidStorageUrl(url) {
  return url && typeof url === 'string' && url.trim().length > 0 && url.includes('supabase.co/storage');
}

/** Validate media URL: Supabase Storage or Google Drive file link (so Drive links can be used for hero/gallery). */
function isValidMediaUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return false;
  if (url.includes('supabase.co/storage')) return true;
  if (url.includes('drive.google.com')) {
    return /\/file\/d\/[a-zA-Z0-9_-]+/.test(url) || /[?&]id=[a-zA-Z0-9_-]+/.test(url);
  }
  return false;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
// CORS configuration - allows requests from frontend domains
const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000',
  'http://localhost:8080', // Vite port in this project (vite.config.ts)
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL, // Your Vercel URL (set in Render env vars)
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
    const vercelMatch = normalizedOrigin.endsWith('.vercel.app');

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
app.use(express.json());

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
    'faculty-settings': { settings: { id: 1, sort_by: 'custom' } }
  };

  for (const [file, defaultData] of Object.entries(dataFiles)) {
    const filePath = join(DATA_DIR, `${file}.json`);
    if (!existsSync(filePath)) {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  // Create default admin user if no users exist
  const users = await db.getUsers();
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.createUser({
      username: 'admin',
      email: 'admin@viet.edu.in',
      password: hashedPassword,
      role: 'admin'
    });
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

  // Initialize default Transport page if not exists
  try {
    const pages = await db.getPages();
    const transportPageExists = pages?.some(p => p.slug === 'transport' || p.route === '/facilities/transport');
    if (!transportPageExists) {
      await db.createPage({
        slug: 'transport',
        title: 'Transport',
        route: '/facilities/transport',
        category: 'Facilities',
        content: {
          hero: { title: 'Transport', description: 'Safe and comfortable transport facility for students and faculty' },
          mainContent: `<p>Our College provides safe and comfortable Transport facility with own new Buses from every corner of the city which help the students and faculty to reach the college.</p>
<p>Transportation is available for conducting industrial visits, placement drives, campus conducted or organized outside the campus.</p>
<p>Our faculties monitor students to maintain discipline in buses.</p>
<p>Anti Ragging committee members will monitor students in every bus.</p>
<p>Comfortable seating as per allotments.</p>`,
          mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3793.1234567890!2d83.1234567!3d17.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDA3JzI0LjUiTiA4M8KwMDcnMjQuNSJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
          tables: { 'Contact Numbers for Transport': { headers: ['Name', 'Contact Number'], rows: [['VVV.SATYANARAYANA', '9959617469'], ['D.ANIL KUMAR', '9440491541']] } },
          additional: { distances: [
            { location: 'RTC Complex', distance: '14kms', available: true },
            { location: 'Madhurawada', distance: '30kms', available: true },
            { location: 'Gajuwaka', distance: '11kms', available: true },
            { location: 'Pendurthi', distance: '10kms', available: true },
            { location: 'Chodavaram', distance: '33kms', available: true },
            { location: 'Anakapalli', distance: '28kms', available: true },
            { location: 'Sabbavaram', distance: '10kms', available: true },
          ] }
        }
      });
    }
  } catch (e) { /* db may not be ready */ }
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
  [/^\/api\/transport-routes/, 'transport-routes'],
  [/^\/api\/accreditations/, 'accreditations'],
  [/^\/api\/aicte-affiliation-letters/, 'accreditations'],
  [/^\/api\/pages/, ['pages', 'facilities', 'authorities']], // facilities & authorities use pages API
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
  if (sections.length === 0) return next();
  const allowed = req.user.allowedSections || req.user.allowed_sections || [];
  const hasAccess = sections.some(s => Array.isArray(allowed) && allowed.includes(s));
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
    const count = await db.getVisitorCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ count: 0 });
  }
});

app.post('/api/visitor-count', async (req, res) => {
  try {
    const count = await db.incrementVisitorCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ count: 0 });
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
    const newNews = await db.createNews(req.body);
    res.json(newNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const updated = await db.updateNews(req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
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
      image: image || null
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
app.post('/api/hero-videos', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const { src, poster, badge, title, subtitle, buttonText, buttonLink } = req.body || {};
    if (!src || typeof src !== 'string' || !src.trim()) {
      return res.status(400).json({ error: 'Video URL (src) is required. Upload video to Supabase Storage first.' });
    }
    if (!isValidMediaUrl(src)) {
      return res.status(400).json({ error: 'src must be a Supabase Storage URL or Google Drive file link' });
    }
    if (poster && typeof poster === 'string' && poster.trim() && !isValidMediaUrl(poster)) {
      return res.status(400).json({ error: 'poster must be a Supabase Storage URL or Google Drive file link' });
    }
    const existing = await db.getHeroVideos();
    const newVideo = await db.createHeroVideo({
      src: src.trim(),
      poster: poster && typeof poster === 'string' ? poster.trim() : null,
      badge: badge || '',
      title: title || '',
      subtitle: subtitle || '',
      buttonText: buttonText || 'Apply Now',
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
    const { src, poster, badge, title, subtitle, buttonText, buttonLink } = req.body || {};
    if (src !== undefined) {
      const s = typeof src === 'string' ? src.trim() : null;
      if (s && !isValidMediaUrl(s)) return res.status(400).json({ error: 'src must be a Supabase Storage URL or Google Drive file link' });
      updateData.src = s;
    }
    if (poster !== undefined) {
      const p = typeof poster === 'string' ? poster.trim() || null : undefined;
      if (p && !isValidMediaUrl(p)) return res.status(400).json({ error: 'poster must be a Supabase Storage URL or Google Drive file link' });
      updateData.poster = p;
    }
    if (badge !== undefined) updateData.badge = badge;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
    const updated = await db.updateHeroVideo(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Video not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    if (image && !isValidStorageUrl(image)) {
      return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
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
      if (image && !isValidStorageUrl(image)) {
        return res.status(400).json({ error: 'image must be a valid Supabase Storage URL' });
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

app.post('/api/gallery', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const src = typeof body.src === 'string' ? body.src.trim() : '';
    if (!src || !isValidMediaUrl(src)) {
      return res.status(400).json({ error: 'src must be a Supabase Storage URL or Google Drive file link' });
    }
    const newImage = await db.createGalleryItem({ src, alt: body.alt || 'Gallery image', department: body.department || '' });
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
    // Cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    res.json((items || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  } catch (error) {
    res.set('Cache-Control', 'public, max-age=300');
    res.json([]);
  }
});

// Vibe-at-viet: image and video are URLs only (admin uploads to Supabase Storage first). imageLink for external (e.g. Google Drive).
app.post('/api/vibe-at-viet', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const body = req.body || {};
    const caption = body.caption ?? '';
    const position = body.position !== undefined ? Math.max(1, Math.min(12, parseInt(body.position, 10) || 1)) : 1;
    const image = (typeof body.image === 'string' ? body.image.trim() : null) || (body.imageLink?.trim() || null) || null;
    const videoUrl = body.video?.trim() || null;
    const videoLink = body.videoLink?.trim() || null;

    if (!image) {
      return res.status(400).json({ error: 'image or imageLink is required (Supabase Storage URL or external link)' });
    }
    if (image && !image.includes('supabase.co/storage') && !image.startsWith('http')) {
      return res.status(400).json({ error: 'image must be a Supabase Storage URL or valid external URL' });
    }

    const targetOrder = position - 1;
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
    if (body.videoLink !== undefined) updateData.videoLink = body.videoLink?.trim() || null;
    if (body.caption !== undefined) updateData.caption = body.caption;
    if (body.order !== undefined) updateData.order = Math.max(0, Math.min(11, parseInt(body.order, 10) || 0));

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

// ==================== PAGES ROUTES ====================

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await db.getPages();
    res.json(pages || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
  try {
    const page = await db.getPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found' });
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

app.put('/api/pages/:id', authenticateToken, checkSectionAccess, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const existingPage = await db.getPageById(pageId);
    if (!existingPage) return res.status(404).json({ error: 'Page not found' });

    const currentContent = existingPage.content || {};
    const newContent = req.body.content || {};

    const cleanedContent = { ...currentContent };
    Object.keys(cleanedContent).forEach(key => {
      if (key.startsWith('image') || key === 'heroImage' || key === 'profileImage') {
        if (!Object.prototype.hasOwnProperty.call(newContent, key) || newContent[key] === '' || newContent[key] == null) {
          delete cleanedContent[key];
        }
      }
    });

    const cleanedNewContent = {};
    Object.keys(newContent).forEach(key => {
      if (key.endsWith('_preview')) return;
      if ((key.startsWith('image') || key === 'heroImage' || key === 'profileImage')) {
        if (newContent[key] != null && newContent[key] !== '') {
          cleanedNewContent[key] = newContent[key];
        }
      } else {
        cleanedNewContent[key] = newContent[key];
      }
    });

    const finalContent = { ...cleanedContent, ...cleanedNewContent };
    const updatePayload = {
      ...req.body,
      content: finalContent,
      updated_at: new Date().toISOString()
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
    // Delete video from storage if exists
    const settings = await db.getIntroVideoSettings();
    if (settings && settings.video_url && settings.video_url.includes('supabase.co/storage')) {
      await deleteFromStorage(settings.video_url).catch(() => {});
    }
    // Reset to default (disabled, no video)
    const updated = await db.updateIntroVideoSettings({ video_url: null, is_enabled: false });
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
    const updated = await db.updateFacultySettings({ sort_by: body.sort_by });
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
  app.get('*', (req, res) => {
    res.sendFile(resolve(distDir, 'index.html'));
  });
}

// Initialize server
async function startServer() {
  await ensureDirectories();
  await initializeData();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT} and http://10.110.70.194:${PORT}`);
    console.log(`Database: ${supabase ? 'Supabase ✓' : 'JSON files (fallback)'}`);
    console.log(`Default admin credentials: username: admin, password: admin123`);
  });
}

startServer().catch(console.error);
