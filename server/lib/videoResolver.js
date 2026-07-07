/**
 * Resolve social reel/post URLs to direct MP4 streams for chromeless gallery playback.
 * Falls back gracefully when the platform blocks server-side fetch.
 */

const BROWSER_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

function decodeJsonUrl(value) {
  if (!value) return null;
  let url = value
    .replace(/\\u0026/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\u00253D/gi, '=')
    .replace(/u00253D/gi, '=')
    .replace(/&amp;/g, '&');
  while (url.includes('\\/')) {
    url = url.replace(/\\\//g, '/');
  }
  return url.replace(/\\/g, '');
}

function extractVideoUrlFromHtml(html) {
  if (!html) return null;

  const normalized = html
    .replace(/\\u0026/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/\\"/g, '"');

  const patterns = [
    /"video_url":"(https[^"]+\.mp4[^"]*)"/i,
    /property="og:video:secure_url"\s+content="([^"]+)"/i,
    /property="og:video"\s+content="([^"]+)"/i,
    /"playback_url":"(https[^"]+)"/i,
    /(https:\/\/[^"'\s]+\.mp4[^"'\s]*)/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const url = decodeJsonUrl(match[1]);
      if (url?.startsWith('http')) return url;
    }
  }

  return null;
}

export function extractInstagramReelId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}

export async function resolveInstagramReelDirectUrl(reelUrl) {
  const reelId = extractInstagramReelId(reelUrl);
  if (!reelId) return null;

  const candidates = [
    `https://www.instagram.com/reel/${reelId}/embed/`,
    `https://www.instagram.com/p/${reelId}/embed/`,
    `https://www.instagram.com/reel/${reelId}/`,
    `https://www.instagram.com/p/${reelId}/`,
    reelUrl.trim(),
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': BROWSER_UA,
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://www.instagram.com/',
        },
        redirect: 'follow',
      });
      if (!response.ok) continue;
      const html = await response.text();
      const directUrl = extractVideoUrlFromHtml(html);
      if (directUrl) return directUrl;
    } catch (error) {
      console.warn('Instagram resolve attempt failed:', error?.message || error);
    }
  }

  return null;
}

export function isAllowedVideoProxyUrl(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('cdninstagram.com') ||
    lower.includes('fbcdn.net') ||
    lower.includes('instagram.') ||
    lower.includes('supabase.co/storage')
  );
}
