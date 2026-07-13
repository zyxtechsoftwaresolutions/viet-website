import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { isProduction } from '../lib/security.js';

export function applySecurityMiddleware(app) {
  app.use(
    helmet({
      contentSecurityPolicy: false, // SPA + inline fonts; set at CDN/reverse-proxy if needed
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (isProduction()) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction() ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again later.' },
  });

  const admissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: isProduction() ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many submissions. Please try again later.' },
  });

  const visitorLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: isProduction() ? 30 : 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { count: 0, todayCount: 0 },
  });

  const uploadSignLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction() ? 60 : 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many upload requests. Please try again later.' },
  });

  const mediaProxyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: isProduction() ? 120 : 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many media requests. Please try again later.' },
  });

  const videoProxyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: isProduction() ? 60 : 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many video proxy requests. Please try again later.',
  });

  const resolveVideoLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: isProduction() ? 30 : 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many resolve requests. Please try again later.' },
  });

  app.use('/api/auth/login', loginLimiter);
  app.use('/api/upload', uploadSignLimiter);
  app.use('/api/media', mediaProxyLimiter);
  app.use('/api/video-proxy', videoProxyLimiter);
  app.use('/api/resolve-video', resolveVideoLimiter);
  app.use('/api/admission-leads', (req, res, next) => {
    if (req.method === 'POST') return admissionLimiter(req, res, next);
    return next();
  });
  app.use('/api/visitor-count', (req, res, next) => {
    if (req.method === 'POST') return visitorLimiter(req, res, next);
    return next();
  });
}
