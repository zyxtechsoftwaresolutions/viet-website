/**
 * Sanitize CMS HTML before rendering with dangerouslySetInnerHTML.
 * Admin-authored content is trusted in intent but must not execute scripts.
 */
import DOMPurify from 'dompurify';

const DEFAULT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'figure', 'figcaption',
    'div', 'span', 'hr',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'alt', 'width', 'height', 'loading',
    'class', 'style',
    'colspan', 'rowspan',
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
};

/** Sanitize rich text from the CMS (paragraphs, lists, links, images). */
export function sanitizeRichHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, DEFAULT_CONFIG);
}

const MAP_IFRAME_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['iframe'],
  ALLOWED_ATTR: [
    'src', 'width', 'height', 'style', 'allowfullscreen',
    'loading', 'referrerpolicy', 'title', 'frameborder',
  ],
  ALLOW_DATA_ATTR: false,
};

function isAllowedMapSrc(src: string): boolean {
  try {
    const parsed = new URL(src, window.location.origin);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    return host === 'www.google.com' || host === 'google.com' || host.endsWith('.google.com');
  } catch {
    return false;
  }
}

/**
 * Sanitize map embed HTML or return a safe Google Maps iframe src URL.
 * Returns null when the embed is not from an allowed maps provider.
 */
export function sanitizeMapEmbed(
  mapEmbed: string | null | undefined
): { mode: 'iframe'; src: string } | { mode: 'html'; html: string } | null {
  const trimmed = String(mapEmbed ?? '').trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('<')) {
    const sanitized = DOMPurify.sanitize(trimmed, MAP_IFRAME_CONFIG);
    if (!sanitized) return null;
    const match = sanitized.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (!match || !isAllowedMapSrc(match[1])) return null;
    return { mode: 'html', html: sanitized };
  }

  if (isAllowedMapSrc(trimmed)) {
    return { mode: 'iframe', src: trimmed };
  }

  return null;
}
