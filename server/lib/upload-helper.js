/**
 * Resolves file URL: ALWAYS uploads to Supabase Storage (no local fallback)
 * Requires Supabase to be configured - throws error if not configured
 */
import { supabase } from './supabase.js';
import { uploadToStorage } from './storage.js';

export async function resolveFileUrl(reqFile, folder) {
  if (!reqFile) return null;
  
  if (!supabase) {
    throw new Error('Supabase Storage is required but not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  }

  try {
    // For memory storage, reqFile.buffer contains the file data
    // For disk storage (legacy), reqFile.path contains the file path
    let buffer;
    if (reqFile.buffer) {
      // Memory storage - buffer is already available
      buffer = reqFile.buffer;
    } else if (reqFile.path) {
      // Disk storage (legacy) - read from path
      const fs = await import('fs/promises');
      buffer = await fs.readFile(reqFile.path);
      // Clean up temporary file
      await fs.unlink(reqFile.path).catch(() => {});
    } else {
      throw new Error('File buffer or path not available');
    }

    const ext = reqFile.originalname?.split('.').pop() || 'bin';
    const filename = `${reqFile.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
    const url = await uploadToStorage(buffer, folder, filename, reqFile.mimetype);
    return url;
  } catch (err) {
    console.error('Supabase upload failed:', err.message);
    throw new Error(`Failed to upload file to Supabase Storage: ${err.message}`);
  }
}

export async function resolveFileUrlFromPath(localPath, folder, contentType = 'image/jpeg') {
  if (!localPath) return null;
  
  if (!supabase) {
    throw new Error('Supabase Storage is required but not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  }

  try {
    const path = await import('path');
    const fs = await import('fs/promises');
    const fullPath = path.default.join(process.cwd(), 'public', localPath);
    const buffer = await fs.default.readFile(fullPath);
    const filename = path.default.basename(localPath);
    return await uploadToStorage(buffer, folder, filename, contentType);
  } catch (err) {
    console.error('Supabase upload failed:', err.message);
    throw new Error(`Failed to upload file from path to Supabase Storage: ${err.message}`);
  }
}
