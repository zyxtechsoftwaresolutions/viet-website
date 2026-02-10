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
