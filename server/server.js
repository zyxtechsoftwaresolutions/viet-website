import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as db from './lib/db.js';
import { resolveFileUrl } from './lib/upload-helper.js';
import { deleteFromStorage } from './lib/storage.js';
import { supabase } from './lib/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(join(__dirname, '../public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set CORS headers for static files
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Data directory
const DATA_DIR = join(__dirname, 'data');
const UPLOADS_DIR = join(__dirname, '../public/uploads');

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [DATA_DIR, UPLOADS_DIR, join(UPLOADS_DIR, 'carousel'), join(UPLOADS_DIR, 'departments'), join(UPLOADS_DIR, 'department-hero'), join(UPLOADS_DIR, 'department-assets'), join(UPLOADS_DIR, 'events'), join(UPLOADS_DIR, 'gallery'), join(UPLOADS_DIR, 'home-gallery'), join(UPLOADS_DIR, 'vibe-at-viet'), join(UPLOADS_DIR, 'recruiters'), join(UPLOADS_DIR, 'faculty'), join(UPLOADS_DIR, 'hods'), join(UPLOADS_DIR, 'pages'), join(UPLOADS_DIR, 'transport-routes'), join(UPLOADS_DIR, 'syllabus'), join(UPLOADS_DIR, 'hero-videos'), join(UPLOADS_DIR, 'placement-carousel')];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
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
    'placement-carousel': { images: [] }
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
      console.log('✓ Created Transport page in database');
    }
  } catch (e) { /* db may not be ready */ }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // For FormData, req.body might not be parsed yet, so check both req.body and use fieldname as fallback
      let uploadType = req.body?.uploadType;
      
      // If uploadType is not in body yet (FormData parsing issue), try to infer from the endpoint
      if (!uploadType) {
        // Check the request URL to determine upload type
        const url = req.url || req.originalUrl || '';
      if (url.includes('/hods')) uploadType = 'hods';
      else if (url.includes('/home-gallery')) uploadType = 'home-gallery';
      else if (url.includes('/vibe-at-viet')) uploadType = 'vibe-at-viet';
      else if (url.includes('/gallery') && !url.includes('/home-gallery')) uploadType = 'gallery';
      else if (url.includes('/carousel')) uploadType = 'carousel';
      else if (url.includes('/placement-carousel')) uploadType = 'placement-carousel';
      else if (url.includes('/departments')) uploadType = 'department';
      else if (url.includes('/recruiters')) uploadType = 'recruiter';
      else if (url.includes('/faculty')) uploadType = 'faculty';
      else if (url.includes('/pages')) uploadType = 'page';
      else if (url.includes('/events')) uploadType = 'event';
      else if (url.includes('/transport-routes')) uploadType = 'transport-routes';
      else if (url.includes('/department-pages') && (url.includes('icon') || url.includes('asset'))) uploadType = 'department-assets';
      else if (url.includes('/department-pages') && url.includes('hero-image')) uploadType = 'department-hero';
      else if (url.includes('/department-pages') && url.includes('curriculum')) uploadType = 'syllabus';
      else if (url.includes('/hero-videos')) uploadType = 'hero-videos';
      else uploadType = 'general';
      }
      
      let uploadPath = UPLOADS_DIR;
      
      switch (uploadType) {
        case 'carousel':
          uploadPath = join(UPLOADS_DIR, 'carousel');
          break;
        case 'placement-carousel':
          uploadPath = join(UPLOADS_DIR, 'placement-carousel');
          break;
        case 'department':
          uploadPath = join(UPLOADS_DIR, 'departments');
          break;
        case 'gallery':
          uploadPath = join(UPLOADS_DIR, 'gallery');
          break;
        case 'home-gallery':
          uploadPath = join(UPLOADS_DIR, 'home-gallery');
          break;
        case 'vibe-at-viet':
          uploadPath = join(UPLOADS_DIR, 'vibe-at-viet');
          break;
        case 'recruiter':
          uploadPath = join(UPLOADS_DIR, 'recruiters');
          break;
        case 'faculty':
          uploadPath = join(UPLOADS_DIR, 'faculty');
          break;
        case 'hods':
          uploadPath = join(UPLOADS_DIR, 'hods');
          break;
        case 'page':
          uploadPath = join(UPLOADS_DIR, 'pages');
          break;
        case 'event':
          uploadPath = join(UPLOADS_DIR, 'events');
          break;
        case 'transport-routes':
          uploadPath = join(UPLOADS_DIR, 'transport-routes');
          break;
        case 'syllabus':
          uploadPath = join(UPLOADS_DIR, 'syllabus');
          break;
        case 'department-hero':
          uploadPath = join(UPLOADS_DIR, 'department-hero');
          break;
        case 'department-assets':
          uploadPath = join(UPLOADS_DIR, 'department-assets');
          break;
        case 'hero-videos':
          uploadPath = join(UPLOADS_DIR, 'hero-videos');
          break;
        default:
          uploadPath = join(UPLOADS_DIR, 'gallery'); // Default to gallery for safety
      }
      
      // Ensure directory exists (synchronously)
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
        console.log('Created directory:', uploadPath);
      }
      
      // Verify directory was created
      if (!existsSync(uploadPath)) {
        throw new Error(`Failed to create upload directory: ${uploadPath}`);
      }
      
      console.log('Multer destination - uploadType:', uploadType, 'fieldname:', file.fieldname, 'path:', uploadPath);
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error in multer destination:', error);
      cb(error, '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit (increased for videos)
  fileFilter: (req, file, cb) => {
    try {
      // Check if this is a department asset upload (images) vs curriculum upload (PDF)
      const url = req.url || req.originalUrl || '';
      const isDepartmentAsset = url.includes('/department-pages') && url.includes('/asset');
      const isCurriculumUpload = url.includes('/department-pages') && url.includes('/curriculum');
      
      // Check fieldname to determine allowed file types
      if (file.fieldname === 'syllabus' || file.fieldname === 'syllabusFile' || (file.fieldname === 'file' && isCurriculumUpload)) {
        // Allow PDF for syllabus uploads (department curriculum)
        const allowedTypes = /pdf/;
        const fileExt = file.originalname.toLowerCase().split('.').pop();
        const extname = allowedTypes.test(fileExt);
        const mimetype = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf' || /^application\/.*pdf/.test(file.mimetype) || file.mimetype === 'application/octet-stream';
        if (extname || mimetype) {
          return cb(null, true);
        }
        return cb(new Error(`Syllabus must be a PDF file. Received: ${file.originalname} (${file.mimetype})`));
      }
      
      // If it's a department asset upload with fieldname 'file', allow images (including SVG)
      if (file.fieldname === 'file' && isDepartmentAsset) {
        // Allow images (including SVG) for department assets
        const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
        const fileExt = file.originalname.toLowerCase().split('.').pop();
        const extname = allowedImageTypes.test(fileExt);
        const mimetype = /^image\//.test(file.mimetype) || 
                        /image\/(jpeg|jpg|png|gif|webp|svg|svg\+xml)/.test(file.mimetype) ||
                        file.mimetype === 'image/svg+xml';
        
        if (extname || mimetype) {
          console.log(`✓ Department asset file accepted: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(null, true);
        } else {
          console.error(`✗ Department asset file rejected: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(new Error(`Department assets must be image files (JPG, PNG, GIF, WebP, SVG)! Received: ${file.originalname} (${file.mimetype})`));
        }
      }
      if (file.fieldname === 'resume') {
        // Allow PDF and DOC files for resume field
        const allowedResumeTypes = /pdf|doc|docx/;
        const fileExt = file.originalname.toLowerCase().split('.').pop();
        const extname = allowedResumeTypes.test(fileExt);
        
        // Very lenient MIME type check for resume files - accept if extension is valid OR if MIME type suggests document
        const mimetype = 
          file.mimetype === 'application/pdf' ||
          file.mimetype === 'application/msword' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.mimetype === 'application/octet-stream' ||
          file.mimetype === 'application/x-pdf' ||
          file.mimetype === 'application/vnd.ms-word' ||
          /application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|octet-stream|x-pdf)/.test(file.mimetype) ||
          /^application\/.*pdf/.test(file.mimetype) ||
          /^application\/.*word/.test(file.mimetype) ||
          /^application\/.*document/.test(file.mimetype);
        
        // Accept if extension is valid OR if MIME type suggests it's a document
        // This is lenient because some browsers/systems send different MIME types
        if (extname) {
          console.log(`✓ Resume file accepted by extension: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(null, true);
        } else if (mimetype) {
          console.log(`✓ Resume file accepted by MIME type: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(null, true);
        } else {
          console.error(`✗ Resume file rejected: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(new Error(`Resume must be a PDF or DOC file! Received: ${file.originalname} (${file.mimetype})`));
        }
      }
      if (file.fieldname === 'video' || file.fieldname === 'heroVideo') {
        // Allow video files for hero videos
        const allowedVideoTypes = /mp4|webm|mov|avi|mkv/;
        const fileExt = file.originalname.toLowerCase().split('.').pop();
        const extname = allowedVideoTypes.test(fileExt);
        const mimetype = /^video\//.test(file.mimetype) || 
                        /video\/(mp4|webm|quicktime|x-msvideo|x-matroska)/.test(file.mimetype) ||
                        file.mimetype === 'application/octet-stream';
        
        if (extname || mimetype) {
          console.log(`✓ Video file accepted: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(null, true);
        } else {
          console.error(`✗ Video file rejected: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(new Error(`Video must be MP4, WebM, MOV, AVI, or MKV file! Received: ${file.originalname} (${file.mimetype})`));
        }
      } else {
        // Allow image files for other fields (image, logo, etc.)
        const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
        const fileExt = file.originalname.toLowerCase().split('.').pop();
        const extname = allowedImageTypes.test(fileExt);
        // More lenient MIME type check for images (including SVG)
        const mimetype = /^image\//.test(file.mimetype) || 
                        /image\/(jpeg|jpg|png|gif|webp|svg|svg\+xml)/.test(file.mimetype) ||
                        file.mimetype === 'image/svg+xml';
        
        if (extname || mimetype) {
          console.log(`✓ Image file accepted: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(null, true);
        } else {
          console.error(`✗ Image file rejected: ${file.originalname}, MIME: ${file.mimetype}, Ext: ${fileExt}`);
          return cb(new Error(`Only image files are allowed! Received: ${file.originalname} (${file.mimetype})`));
        }
      }
    } catch (error) {
      console.error('Error in fileFilter:', error);
      return cb(new Error(`File validation error: ${error.message}`));
    }
  }
});

// Middleware to parse multipart/form-data fields before multer processes file
// This ensures req.body fields are available in multer callbacks
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    // Let multer handle it - it will parse both file and fields
    next();
  } else {
    next();
  }
});

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

// ==================== AUTHENTICATION ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.findUserByUsernameOrEmail(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
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

app.post('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const newAnnouncement = await db.createAnnouncement({ ...req.body, updatedAt: new Date().toISOString() });
    res.json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/announcements/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateAnnouncement(req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: 'Announcement not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
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

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const newNews = await db.createNews(req.body);
    res.json(newNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateNews(req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: 'News not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req, res) => {
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

app.post('/api/ticker', authenticateToken, async (req, res) => {
  try {
    const newItem = await db.createTickerItem({ text: req.body.text || '', isActive: req.body.isActive !== undefined ? req.body.isActive : true });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ticker/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateTickerItem(req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
    if (!updated) return res.status(404).json({ error: 'Ticker item not found' });
    res.json(updated);
  } catch (error) {
    console.error('Ticker update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ticker/:id', authenticateToken, async (req, res) => {
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

app.post('/api/events', authenticateToken, (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      next();
    });
  }
  next();
}, async (req, res) => {
  try {
    const body = req.body;
    let imagePath;
    if (req.file) imagePath = await resolveFileUrl(req.file, 'events');
    const newEvent = await db.createEvent({
      title: body.title || '',
      description: body.description || '',
      date: body.date || '',
      time: body.time || '',
      location: body.location || '',
      link: body.link || '',
      image: imagePath || body.image
    });
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', authenticateToken, (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      next();
    });
  }
  next();
}, async (req, res) => {
  try {
    const body = req.body;
    let imagePath;
    if (req.file) imagePath = await resolveFileUrl(req.file, 'events');
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    if (imagePath !== undefined) updateData.image = imagePath;
    const updated = await db.updateEvent(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
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

app.post('/api/transport-routes', authenticateToken, (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      next();
    });
  }
  next();
}, async (req, res) => {
  try {
    const body = req.body;
    let imagePath;
    if (req.file) imagePath = await resolveFileUrl(req.file, 'transport-routes');
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
      image: imagePath || body.image || null
    });
    res.json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transport-routes/:id', authenticateToken, (req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return upload.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
      next();
    });
  }
  next();
}, async (req, res) => {
  try {
    const body = req.body;
    let imagePath;
    if (req.file) imagePath = await resolveFileUrl(req.file, 'transport-routes');
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
    if (imagePath !== undefined) updateData.image = imagePath;
    const updated = await db.updateTransportRoute(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Route not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transport-routes/:id', authenticateToken, async (req, res) => {
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
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/carousel', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });
    const src = await resolveFileUrl(req.file, 'carousel');
    const newImage = await db.createCarouselItem({
      src,
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      uploadType: 'carousel'
    });
    res.json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/carousel/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    if (req.file) updateData.src = await resolveFileUrl(req.file, 'carousel');
    const updated = await db.updateCarouselItem(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Image not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/carousel/:id', authenticateToken, async (req, res) => {
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

app.post('/api/placement-carousel', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });
    const src = await resolveFileUrl(req.file, 'placement-carousel');
    const newImage = await db.createPlacementCarouselItem({ src, title: req.body.title || '', subtitle: req.body.subtitle || '' });
    res.json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/placement-carousel/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.src = await resolveFileUrl(req.file, 'placement-carousel');
    const updated = await db.updatePlacementCarouselItem(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Image not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/placement-carousel/:id', authenticateToken, async (req, res) => {
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
    res.json(videos || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero-videos', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]), async (req, res) => {
  try {
    const videoFile = req.files?.['video']?.[0];
    const posterFile = req.files?.['poster']?.[0];
    if (!videoFile) return res.status(400).json({ error: 'Video file is required' });

    const existing = await db.getHeroVideos();
    const src = await resolveFileUrl(videoFile, 'hero-videos');
    const poster = posterFile ? await resolveFileUrl(posterFile, 'hero-videos') : null;
    const newVideo = await db.createHeroVideo({
      src, poster, badge: req.body.badge || '', title: req.body.title || '',
      subtitle: req.body.subtitle || '', buttonText: req.body.buttonText || 'Apply Now',
      buttonLink: req.body.buttonLink || '', order: (existing?.length || 0)
    });
    res.json(newVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero-videos/:id', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]), async (req, res) => {
  try {
    const videoFile = req.files?.['video']?.[0];
    const posterFile = req.files?.['poster']?.[0];
    const updateData = { ...req.body };
    if (videoFile) updateData.src = await resolveFileUrl(videoFile, 'hero-videos');
    if (posterFile) updateData.poster = await resolveFileUrl(posterFile, 'hero-videos');
    const updated = await db.updateHeroVideo(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Video not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hero-videos/:id', authenticateToken, async (req, res) => {
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

app.post('/api/departments', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const image = req.file ? await resolveFileUrl(req.file, 'departments') : req.body.image;
    const newDept = await db.createDepartment({ name: req.body.name, stream: req.body.stream, level: req.body.level, image });
    res.json(newDept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/departments/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = await resolveFileUrl(req.file, 'departments');
    const updated = await db.updateDepartment(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Department not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/departments/:id', authenticateToken, async (req, res) => {
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
    const faculty = await db.getFaculty();
    res.json(faculty || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/faculty', authenticateToken, (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'File upload failed' });
    next();
  });
}, async (req, res) => {
  try {
    const image = req.files?.image?.[0] ? await resolveFileUrl(req.files.image[0], 'faculty') : (req.body.image || null);
    const resume = req.files?.resume?.[0] ? await resolveFileUrl(req.files.resume[0], 'faculty') : (req.body.resume || null);
    const newFaculty = await db.createFaculty({
      name: req.body.name || '', designation: req.body.designation || '', qualification: req.body.qualification || '',
      email: req.body.email || '', phone: req.body.phone || '', experience: req.body.experience || '',
      department: req.body.department || '', image, resume
    });
    res.json(newFaculty);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create faculty member' });
  }
});

app.put('/api/faculty/:id', authenticateToken, (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'File upload failed' });
    next();
  });
}, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files?.image?.[0]) updateData.image = await resolveFileUrl(req.files.image[0], 'faculty');
    if (req.files?.resume?.[0]) updateData.resume = await resolveFileUrl(req.files.resume[0], 'faculty');
    const updated = await db.updateFaculty(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Faculty not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update faculty member' });
  }
});

app.delete('/api/faculty/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteFaculty(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HOD ROUTES ====================

app.get('/api/hods', async (req, res) => {
  try {
    const hods = await db.getHods();
    res.json(hods || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check if a file exists
app.get('/api/test-file/*', async (req, res) => {
  try {
    // Extract path from wildcard route
    const filePath = req.params[0] || req.path.replace('/api/test-file/', '');
    const fullPath = join(__dirname, '..', 'public', filePath);
    const exists = existsSync(fullPath);
    res.json({
      path: filePath,
      fullPath: fullPath,
      exists: exists,
      url: `http://localhost:${PORT}${filePath.startsWith('/') ? filePath : '/' + filePath}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hods', authenticateToken, (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const image = req.files?.image?.[0] ? await resolveFileUrl(req.files.image[0], 'hods') : (req.body.image || null);
    const resume = req.files?.resume?.[0] ? await resolveFileUrl(req.files.resume[0], 'hods') : (req.body.resume || null);
    const newHOD = await db.createHod({
      name: req.body.name || '', designation: req.body.designation || '', qualification: req.body.qualification || '',
      email: req.body.email || '', phone: req.body.phone || '', experience: req.body.experience || '',
      department: req.body.department || '', image, resume
    });
    res.json(newHOD);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to create HOD' });
  }
});

app.put('/api/hods/:id', authenticateToken, (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'File upload failed' });
    next();
  });
}, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files?.image?.[0]) updateData.image = await resolveFileUrl(req.files.image[0], 'hods');
    if (req.files?.resume?.[0]) updateData.resume = await resolveFileUrl(req.files.resume[0], 'hods');
    const updated = await db.updateHod(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'HOD not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update HOD' });
  }
});

app.delete('/api/hods/:id', authenticateToken, async (req, res) => {
  try {
    await db.deleteHod(req.params.id);
    res.json({ message: 'HOD deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

app.post('/api/gallery', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });
    const src = await resolveFileUrl(req.file, 'gallery');
    const newImage = await db.createGalleryItem({ src, alt: req.body.alt || 'Gallery image', department: req.body.department || '' });
    res.json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
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

app.put('/api/placement-section', authenticateToken, async (req, res) => {
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

app.post('/api/recruiters', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Logo file required' });
    const logo = await resolveFileUrl(req.file, 'recruiters');
    const newRecruiter = await db.createRecruiter({ name: req.body.name, logo, description: req.body.description || '' });
    res.json(newRecruiter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/recruiters/:id', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.logo = await resolveFileUrl(req.file, 'recruiters');
    const updated = await db.updateRecruiter(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Recruiter not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/recruiters/:id', authenticateToken, async (req, res) => {
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

app.put('/api/home-gallery/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });
    const image = await resolveFileUrl(req.file, 'home-gallery');
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
    res.json((items || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/vibe-at-viet', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const caption = req.body?.caption ?? '';
    const position = req.body?.position !== undefined ? Math.max(1, Math.min(12, parseInt(req.body.position, 10) || 1)) : 1;
    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];
    const videoLink = req.body?.videoLink?.trim() || null;
    if (!imageFile) return res.status(400).json({ error: 'Image file is required' });

    const image = await resolveFileUrl(imageFile, 'vibe-at-viet');
    let video = null;
    let videoLinkVal = null;
    if (videoFile) video = await resolveFileUrl(videoFile, 'vibe-at-viet');
    else if (videoLink) videoLinkVal = videoLink;
    const targetOrder = position - 1;
    const item = await db.createVibeAtVietItem({ image, video, videoLink: videoLinkVal, caption, order: targetOrder });
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating vibe-at-viet item:', error);
    res.status(500).json({ error: error.message || 'Failed to add item' });
  }
});

app.put('/api/vibe-at-viet/:id', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const updateData = {};
    if (req.files?.image?.[0]) updateData.image = await resolveFileUrl(req.files.image[0], 'vibe-at-viet');
    if (req.files?.video?.[0]) updateData.video = await resolveFileUrl(req.files.video[0], 'vibe-at-viet');
    else if (req.body?.videoLink !== undefined) updateData.videoLink = req.body.videoLink?.trim() || null;
    if (req.body?.caption !== undefined) updateData.caption = req.body.caption;
    if (req.body?.order !== undefined) updateData.order = Math.max(0, Math.min(11, parseInt(req.body.order, 10) || 0));
    const updated = await db.updateVibeAtVietItem(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to update item' });
  }
});

app.delete('/api/vibe-at-viet/:id', authenticateToken, async (req, res) => {
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

app.post('/api/pages', authenticateToken, async (req, res) => {
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

app.put('/api/pages/:id', authenticateToken, (req, res, next) => {
  // Check if this is a multipart/form-data request
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    // Use multer to handle file uploads
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || 'File upload failed' });
      }
      next();
    });
  } else {
    next();
  }
}, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const existingPage = await db.getPageById(pageId);
    if (!existingPage) return res.status(404).json({ error: 'Page not found' });

    // Handle multipart/form-data (with file uploads)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Parse the JSON data from formData
      let pageData = {};
      if (req.body.data) {
        try {
          pageData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
        } catch (parseError) {
          return res.status(400).json({ error: 'Invalid JSON data: ' + parseError.message });
        }
      }

      // Handle image uploads - process all image_* fields
      const imageUpdates = {};
      for (const file of req.files) {
        const fieldMatch = file.fieldname.match(/^image_(.+)$/);
        if (fieldMatch) {
          const imageKey = fieldMatch[1];
          imageUpdates[imageKey] = await resolveFileUrl(file, 'pages');
          
        }
      }

      // Merge content updates
      const currentContent = existingPage.content || {};
      const newContent = pageData.content || {};
      
      // Remove deleted image fields - if a field exists in current but not in new content, or is explicitly empty/null, remove it
      const cleanedContent = { ...currentContent };
      Object.keys(cleanedContent).forEach(key => {
        // Check if this is an image field
        if (key.startsWith('image') || key === 'heroImage' || key === 'profileImage') {
          // If field is not in new content or is explicitly empty/null, remove it
          if (!newContent.hasOwnProperty(key) || newContent[key] === '' || newContent[key] === null || newContent[key] === undefined) {
            delete cleanedContent[key];
          }
        }
      });
      
      // Clean newContent - remove null/empty image fields and preview fields BEFORE merging
      const cleanedNewContent = {};
      Object.keys(newContent).forEach(key => {
        // Skip preview fields
        if (key.endsWith('_preview')) {
          return;
        }
        // Skip null/empty image fields
        if ((key.startsWith('image') || key === 'heroImage' || key === 'profileImage')) {
          if (newContent[key] !== null && newContent[key] !== '' && newContent[key] !== undefined) {
            cleanedNewContent[key] = newContent[key];
          }
        } else {
          // Keep non-image fields as-is
          cleanedNewContent[key] = newContent[key];
        }
      });
      
      // Now merge with cleaned new content and image updates
      const finalContent = {
        ...cleanedContent,
        ...cleanedNewContent,
        ...imageUpdates
      };
      
      var updatePayload = {
        ...pageData,
        content: finalContent,
        updated_at: new Date().toISOString()
      };
    } else {
      // Handle JSON-only updates (no file uploads)
      const currentContent = existingPage.content || {};
      const newContent = req.body.content || {};
      
      // Remove deleted image fields - if a field exists in current but not in new content, or is explicitly empty/null, remove it
      const cleanedContent = { ...currentContent };
      Object.keys(cleanedContent).forEach(key => {
        // Check if this is an image field
        if (key.startsWith('image') || key === 'heroImage' || key === 'profileImage') {
          // If field is not in new content or is explicitly empty/null, remove it
          if (!newContent.hasOwnProperty(key) || newContent[key] === '' || newContent[key] === null || newContent[key] === undefined) {
            delete cleanedContent[key];
          }
        }
      });
      
      // Clean newContent - remove null/empty image fields and preview fields BEFORE merging
      const cleanedNewContent = {};
      Object.keys(newContent).forEach(key => {
        // Skip preview fields
        if (key.endsWith('_preview')) {
          return;
        }
        // Skip null/empty image fields
        if ((key.startsWith('image') || key === 'heroImage' || key === 'profileImage')) {
          if (newContent[key] !== null && newContent[key] !== '' && newContent[key] !== undefined) {
            cleanedNewContent[key] = newContent[key];
          }
        } else {
          // Keep non-image fields as-is
          cleanedNewContent[key] = newContent[key];
        }
      });
      
      // Now merge with cleaned new content
      const finalContent = {
        ...cleanedContent,
        ...cleanedNewContent
      };
      
      var updatePayload = {
        ...req.body,
        content: finalContent,
        updated_at: new Date().toISOString()
      };
    }

    const updated = await db.updatePage(pageId, updatePayload);
    if (!updated) return res.status(500).json({ error: 'Failed to update page' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pages/:id', authenticateToken, async (req, res) => {
  try {
    const pageId = parseInt(req.params.id);
    const page = await db.getPageById(pageId);
    if (!page) return res.status(404).json({ error: 'Page not found' });

    // Delete associated images from storage/content
    if (page.content && typeof page.content === 'object') {
      const imageKeys = ['heroImage', 'profileImage', 'image1', 'image2', 'image3'];
      for (const key of imageKeys) {
        const url = page.content[key];
        if (url) {
          if (url.includes('supabase') || url.startsWith('http')) {
            await deleteFromStorage(url).catch(err => console.error('Error deleting from storage:', err));
          } else if (url.startsWith('/uploads/')) {
            const imagePath = join(__dirname, '..', 'public', url);
            if (existsSync(imagePath)) {
              fs.unlink(imagePath).catch(err => console.error('Error deleting image:', err));
            }
          }
        }
      }
    }

    await db.deletePage(pageId);
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

app.put('/api/department-pages/:slug', authenticateToken, async (req, res) => {
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

// Department page hero image upload
app.post('/api/department-pages/:slug/hero-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const slug = req.params.slug;
    const page = await db.getDepartmentPageBySlug(slug) || { slug, sections: {}, curriculum: { programs: [] } };
    const sections = page.sections || {};
    const hero = sections.hero || {};
    const oldImage = hero.image;
    if (oldImage) {
      if (oldImage.includes('supabase') || oldImage.startsWith('http')) {
        await deleteFromStorage(oldImage).catch(() => {});
      } else if (oldImage.startsWith('/uploads/')) {
        const oldPath = join(__dirname, '..', 'public', oldImage);
        if (existsSync(oldPath)) await fs.unlink(oldPath).catch(() => {});
      }
    }
    const imageUrl = await resolveFileUrl(req.file, 'department-hero');
    const updatedSections = { ...sections, hero: { ...hero, image: imageUrl } };
    const updated = await db.upsertDepartmentPage(slug, { sections: updatedSections, curriculum: page.curriculum || { programs: [] } });
    res.json({ image: imageUrl, page: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Department page asset upload (SVG icons, images for facilities, placements, etc.)
app.post('/api/department-pages/:slug/asset', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }
    const fileUrl = await resolveFileUrl(req.file, 'department-assets');
    res.json({ url: fileUrl, filename: req.file.originalname || req.file.filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Curriculum upload: program + regulation (existing = update file, new = add regulation)
app.post('/api/department-pages/:slug/curriculum', authenticateToken, (req, res, next) => {
  upload.single('syllabus')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
    next();
  });
}, async (req, res) => {
  try {
    const slug = req.params.slug;
    const page = await db.getDepartmentPageBySlug(slug) || { slug, sections: {}, curriculum: { programs: [] } };
    const curriculum = page.curriculum || { programs: [] };
    if (!curriculum.programs) curriculum.programs = [];

    const programName = (req.body.program || '').trim();
    const regulationName = (req.body.regulation || '').trim();
    if (!programName || !regulationName) {
      return res.status(400).json({ error: 'Program and regulation are required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Syllabus PDF file is required' });
    }

    const fileUrl = await resolveFileUrl(req.file, 'syllabus');
    const fileName = req.file.originalname || 'syllabus.pdf';

    let programEntry = curriculum.programs.find(p => p.name === programName);
    if (!programEntry) {
      programEntry = { name: programName, regulations: [] };
      curriculum.programs.push(programEntry);
    }
    if (!programEntry.regulations) programEntry.regulations = [];

    const existingReg = programEntry.regulations.find(r => r.name === regulationName);
    if (existingReg) {
      // Update file for existing regulation (delete old file from storage)
      if (existingReg.fileUrl) {
        if (existingReg.fileUrl.includes('supabase') || existingReg.fileUrl.startsWith('http')) {
          await deleteFromStorage(existingReg.fileUrl).catch(() => {});
        } else if (existingReg.fileUrl.startsWith('/uploads/')) {
          const oldPath = join(__dirname, '..', 'public', existingReg.fileUrl);
          if (existsSync(oldPath)) fs.unlink(oldPath).catch(() => {});
        }
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
app.delete('/api/department-pages/:slug/curriculum/:program/:regulation', authenticateToken, async (req, res) => {
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
    
    // Delete the file if it exists
    if (regulation.fileUrl) {
      if (regulation.fileUrl.includes('supabase') || regulation.fileUrl.startsWith('http')) {
        await deleteFromStorage(regulation.fileUrl).catch(() => {});
      } else if (regulation.fileUrl.startsWith('/uploads/')) {
        const filePath = join(__dirname, '..', 'public', regulation.fileUrl);
        if (existsSync(filePath)) {
          await fs.unlink(filePath).catch(() => {});
        }
      }
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




