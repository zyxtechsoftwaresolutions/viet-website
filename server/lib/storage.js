import { supabase, UPLOADS_BUCKET, getStoragePublicUrl } from './supabase.js';

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

  const path = `${folder}/${filename}`;
  const { data, error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(path, fileBuffer, {
      contentType: contentType || 'application/octet-stream',
      upsert: true
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

/**
 * Download a file from Supabase Storage using the service role (works even when bucket is private).
 * @param {string} publicUrl - Full public storage URL stored in the database
 * @returns {Promise<Blob | null>}
 */
export async function downloadFromPublicUrl(publicUrl) {
  const parsed = parseSupabasePublicUrl(publicUrl);
  if (!parsed || !supabase) return null;
  const { data, error } = await supabase.storage.from(parsed.bucket).download(parsed.objectPath);
  if (error || !data) {
    console.error('Storage download error:', error?.message || 'no data');
    return null;
  }
  return data;
}

/**
 * Delete file from Supabase Storage by full public URL (supports any bucket: images, videos, etc.)
 * @param {string} urlOrPath - Full public URL (e.g. https://xxx.supabase.co/storage/v1/object/public/bucket/path)
 */
export async function deleteFromStorage(urlOrPath) {
  if (!supabase || !urlOrPath) return;

  const m = urlOrPath.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
  if (m) {
    const [, bucket, objectPath] = m;
    await supabase.storage.from(bucket).remove([objectPath]);
  }
}
