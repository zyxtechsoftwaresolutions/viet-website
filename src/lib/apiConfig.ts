/**
 * Shared API base URLs for dev (Vite proxy), Vercel (proxied /api), and Render (full stack).
 * Prefer relative `/api` in production so Vercel can proxy to the Node backend on Render.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/** Host origin for legacy `/uploads` paths — same-origin in production, localhost in dev. */
export function getApiHostBase(): string {
  const configured = import.meta.env.VITE_API_URL;
  if (configured && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/api\/?$/, '') || configured;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  return '';
}
