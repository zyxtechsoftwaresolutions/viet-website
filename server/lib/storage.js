import { supabase, UPLOADS_BUCKET, getStoragePublicUrl } from './supabase.js';

export const IMAGES_BUCKET = 'images';
export const VIDEOS_BUCKET = 'videos';

const ALLOWED_FOLDERS = new Set([
  'carousel',
  'placement-carousel',
  'hero-videos',
  'intro-video',
  'explore-path',
  'vibe-at-viet',
  'gallery',
  'home-gallery',
  'events',
  'campus-updates',
  'campus-life',
  'facilities',
  'departments',
  'department-hero',
  'department-pages',
  'department-assets',
  'syllabus',
  'faculty',
  'hods',
  'recruiters',
  'accreditations',
  'aicte-letters',
  'admission-popup',
  'about',
  'pages',
  'organizational-chart',
  'research-development',
  'transport-routes',
  'ug-pg-examinations',
  'examinations',
  'iqac',
]);

const ALLOWED_BUCKETS = new Set([IMAGES_BUCKET, VIDEOS_BUCKET, UPLOADS_BUCKET]);
const MEDIA_PROXY_BUCKETS = new Set([IMAGES_BUCKET, VIDEOS_BUCKET]);

const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB (enforced by Supabase plan too)
const MAX_DOC_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_DOC_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

/**
 * Sanitize folder and original filename; build a unique non-guessable object path.
 * Unique paths prevent attackers from overwriting known public URLs even if write
 * access is somehow regained.
 */
export function buildUniqueObjectPath(folder, originalName) {
  const safeFolder = String(folder || 'uploads')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')
    .slice(0, 80);
  const base = String(originalName || 'file')
    .split(/[/\\]/)
    .pop()
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80);
  const ext = base.includes('.') ? base.slice(base.lastIndexOf('.')) : '';
  const stem = base.includes('.') ? base.slice(0, base.lastIndexOf('.')) : base;
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${safeFolder || 'uploads'}/${stem || 'file'}-${unique}${ext}`;
}

export function assertAllowedUpload({ folder, bucket, contentType, fileSize }) {
  const folderKey = String(folder || '').split('/')[0];
  if (!ALLOWED_FOLDERS.has(folderKey)) {
    throw Object.assign(new Error('Upload folder is not allowed'), { status: 400 });
  }
  if (!ALLOWED_BUCKETS.has(bucket)) {
    throw Object.assign(new Error('Upload bucket is not allowed'), { status: 400 });
  }

  const type = String(contentType || '').toLowerCase().split(';')[0].trim();
  const size = Number(fileSize);
  if (!Number.isFinite(size) || size <= 0) {
    throw Object.assign(new Error('Valid fileSize is required'), { status: 400 });
  }

  if (bucket === VIDEOS_BUCKET) {
    const okVideo = type.startsWith('video/');
    const okPoster = ALLOWED_IMAGE_TYPES.has(type);
    if (!okVideo && !okPoster) {
      throw Object.assign(new Error('Invalid content type for videos bucket'), { status: 400 });
    }
    if (size > MAX_VIDEO_BYTES) {
      throw Object.assign(new Error('File exceeds maximum allowed size'), { status: 400 });
    }
    if (okPoster && size > MAX_IMAGE_BYTES) {
      throw Object.assign(new Error('File exceeds maximum allowed size'), { status: 400 });
    }
    return;
  }

  const allowedImageOrDoc = ALLOWED_IMAGE_TYPES.has(type) || ALLOWED_DOC_TYPES.has(type);
  if (!allowedImageOrDoc) {
    throw Object.assign(new Error('Invalid content type for images bucket'), { status: 400 });
  }
  const limit = ALLOWED_IMAGE_TYPES.has(type) ? MAX_IMAGE_BYTES : MAX_DOC_BYTES;
  if (size > limit) {
    throw Object.assign(new Error('File exceeds maximum allowed size'), { status: 400 });
  }
}

function publicUrlFor(bucket, objectPath) {
  const base = process.env.SUPABASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${objectPath}`;
}

/**
 * Mint a short-lived signed upload URL (service role). Browser uploads directly
 * to Supabase without needing anon INSERT/UPDATE policies.
 */
export async function createSignedUpload({ folder, originalName, contentType, bucket, fileSize }) {
  if (!supabase) {
    throw Object.assign(
      new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'),
      { status: 503 }
    );
  }

  const resolvedBucket =
    bucket === 'videos' || bucket === VIDEOS_BUCKET ? VIDEOS_BUCKET : IMAGES_BUCKET;

  assertAllowedUpload({
    folder,
    bucket: resolvedBucket,
    contentType,
    fileSize,
  });

  const objectPath = buildUniqueObjectPath(folder, originalName);
  const { data, error } = await supabase.storage
    .from(resolvedBucket)
    .createSignedUploadUrl(objectPath);

  if (error || !data) {
    console.error('Signed upload URL error:', error);
    throw Object.assign(new Error(error?.message || 'Failed to create upload URL'), { status: 500 });
  }

  return {
    bucket: resolvedBucket,
    path: data.path || objectPath,
    token: data.token,
    signedUrl: data.signedUrl,
    publicUrl: publicUrlFor(resolvedBucket, data.path || objectPath),
  };
}

/**
 * Upload file buffer to Supabase Storage and return public URL
 * @param {Buffer} fileBuffer - File content
 * @param {string} folder - Folder path (e.g., 'carousel', 'gallery', 'faculty')
 * @param {string} filename - Filename with extension
 * @param {string} contentType - MIME type
 * @returns {Promise<string|null>} Public URL or null on failure
 */
export async function uploadToStorage(fileBuffer, folder, filename, contentType) {
  if (!supabase) {
    throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const path = buildUniqueObjectPath(folder, filename);
  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(path, fileBuffer, {
      contentType: contentType || 'application/octet-stream',
      upsert: false,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw error;
  }

  return getStoragePublicUrl(data.path);
}

/**
 * Parse a Supabase public object URL into bucket + object path.
 * @param {string} url
 * @returns {{ bucket: string, objectPath: string } | null}
 */
export function parseSupabasePublicUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.trim().match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+?)(?:\?|#|$)/);
  if (!m) return null;
  return { bucket: m[1], objectPath: decodeURIComponent(m[2]) };
}

function isOurSupabaseHost(url) {
  const base = process.env.SUPABASE_URL;
  if (!base) return true; // cannot verify; other checks still apply
  try {
    return new URL(url).hostname.toLowerCase() === new URL(base).hostname.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Download a file from Supabase Storage using the service role (works even when bucket is private).
 * Restricted to images/videos buckets on this project's host.
 * @param {string} publicUrl - Full public storage URL stored in the database
 * @returns {Promise<Blob | null>}
 */
export async function downloadFromPublicUrl(publicUrl) {
  const parsed = parseSupabasePublicUrl(publicUrl);
  if (!parsed || !supabase) return null;
  if (!MEDIA_PROXY_BUCKETS.has(parsed.bucket)) return null;
  if (!isOurSupabaseHost(publicUrl)) return null;
  const { data, error } = await supabase.storage.from(parsed.bucket).download(parsed.objectPath);
  if (error || !data) {
    console.error('Storage download error:', error?.message || 'no data');
    return null;
  }
  return data;
}

/**
 * Delete file from Supabase Storage by full public URL.
 * Restricted to images/videos and known upload folders.
 * @param {string} urlOrPath - Full public URL (e.g. https://xxx.supabase.co/storage/v1/object/public/bucket/path)
 */
export async function deleteFromStorage(urlOrPath) {
  if (!supabase || !urlOrPath) return;

  const m = urlOrPath.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
  if (!m) return;
  const [, bucket, objectPathRaw] = m;
  const objectPath = decodeURIComponent(objectPathRaw.split('?')[0]);
  if (!MEDIA_PROXY_BUCKETS.has(bucket)) return;
  if (!isOurSupabaseHost(urlOrPath)) return;
  const folderKey = objectPath.split('/')[0];
  if (!ALLOWED_FOLDERS.has(folderKey)) return;

  await supabase.storage.from(bucket).remove([objectPath]);
}

export { ALLOWED_FOLDERS };
