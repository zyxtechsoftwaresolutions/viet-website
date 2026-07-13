/**
 * Resolve social reel/post URLs to direct MP4 streams for chromeless gallery playback.
 * Falls back gracefully when the platform blocks server-side fetch.
 */

const BROWSER_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

/** Host suffixes allowed for /api/video-proxy (exact hostname match, not substring-in-URL). */
const VIDEO_PROXY_HOST_SUFFIXES = [
  '.cdninstagram.com',
  '.fbcdn.net',
  '.instagram.com',
];

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

function isPrivateOrLocalHostname(hostname) {
  const host = String(hostname || '').toLowerCase();
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host === '::1') return true;
  if (host === '0.0.0.0') return true;
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  return false;
}

function hostMatchesSuffix(hostname, suffix) {
  const host = hostname.toLowerCase();
  const s = suffix.toLowerCase();
  if (s.startsWith('.')) {
    return host === s.slice(1) || host.endsWith(s);
  }
  return host === s || host.endsWith(`.${s}`);
}

/**
 * Strict allowlist for video-proxy targets (hostname-based, https only).
 * Prevents SSRF via substring tricks like ?x=cdninstagram.com on internal IPs.
 */
export function isAllowedVideoProxyUrl(url) {
  if (!url || typeof url !== 'string') return false;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  if (parsed.username || parsed.password) return false;
  const host = parsed.hostname.toLowerCase();
  if (isPrivateOrLocalHostname(host)) return false;

  const supabaseBase = process.env.SUPABASE_URL;
  if (supabaseBase) {
    try {
      const sb = new URL(supabaseBase);
      if (
        host === sb.hostname.toLowerCase() &&
        parsed.pathname.includes('/storage/')
      ) {
        return true;
      }
    } catch {
      /* ignore bad SUPABASE_URL */
    }
  } else if (
    (host.endsWith('.supabase.co') || host === 'supabase.co') &&
    parsed.pathname.includes('/storage/')
  ) {
    return true;
  }

  return VIDEO_PROXY_HOST_SUFFIXES.some((suffix) => hostMatchesSuffix(host, suffix));
}
