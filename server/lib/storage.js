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
 * Delete file from Supabase Storage by URL or path
 * @param {string} urlOrPath - Full URL or storage path
 */
export async function deleteFromStorage(urlOrPath) {
  if (!supabase || !urlOrPath) return;

  // Extract path from URL if full URL is passed
  let path = urlOrPath;
  if (urlOrPath.includes('/storage/v1/object/public/')) {
    const match = urlOrPath.match(new RegExp(`${UPLOADS_BUCKET}/(.+)`));
    path = match ? match[1] : urlOrPath;
  } else if (urlOrPath.startsWith('/uploads/')) {
    path = urlOrPath.replace(/^\/uploads\//, '');
  }

  await supabase.storage.from(UPLOADS_BUCKET).remove([path]);
}
