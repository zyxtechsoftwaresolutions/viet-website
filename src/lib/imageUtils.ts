/**
 * Utility function to construct image URLs consistently across the application.
 * Supabase public storage URLs are proxied through the API so the website can
 * load uploads even when the bucket is not publicly readable (403).
 */

import { API_BASE_URL, getApiHostBase } from './apiConfig';

const SUPABASE_PUBLIC_STORAGE =
  /^https?:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//;

function storageProxyUrl(publicUrl: string): string {
  return `${API_BASE_URL}/media?url=${encodeURIComponent(publicUrl)}`;
}

export const imgUrl = (path: string | undefined | null): string => {
  if (!path) return '';

  // Full URL — proxy Supabase storage so public site avoids 403 on private buckets
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (SUPABASE_PUBLIC_STORAGE.test(path)) {
      return storageProxyUrl(path);
    }
    return path;
  }

  // Legacy relative /uploads paths served by the API host
  const base = getApiHostBase();

  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};

/** Same as imgUrl but keeps direct Supabase URLs (e.g. admin preview after upload). */
export const imgUrlDirect = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const base = getApiHostBase();
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};

/** Hero/profile image from leader page CMS content (Chairman, Principal, etc.) */
export function resolveLeaderHeroImage(
  content: Record<string, unknown> | null | undefined,
  fallback = '/chairmanedit.jpeg'
): string {
  const heroImage = content?.heroImage;
  const profileImage = content?.profileImage;
  const raw =
    (typeof heroImage === 'string' && heroImage.trim()) ||
    (typeof profileImage === 'string' && profileImage.trim()) ||
    '';
  return raw ? imgUrl(raw) : fallback;
}
