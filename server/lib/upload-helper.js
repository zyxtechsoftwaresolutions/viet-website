/**
 * Resolves file URL: uploads to Supabase Storage when configured, else returns local path
 */
import path from 'path';
import fs from 'fs/promises';
import { supabase } from './supabase.js';
import { uploadToStorage } from './storage.js';

export async function resolveFileUrl(reqFile, folder, baseUrl = '/uploads') {
  if (!reqFile) return null;
  if (supabase) {
    try {
      const buffer = await fs.readFile(reqFile.path);
      const ext = reqFile.originalname?.split('.').pop() || 'bin';
      const filename = `${reqFile.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
      const url = await uploadToStorage(buffer, folder, filename, reqFile.mimetype);
      await fs.unlink(reqFile.path).catch(() => {});
      return url;
    } catch (err) {
      console.error('Supabase upload failed, using local:', err.message);
      return `${baseUrl}/${folder}/${reqFile.filename}`;
    }
  }
  return `${baseUrl}/${folder}/${reqFile.filename}`;
}

export async function resolveFileUrlFromPath(localPath, folder, contentType = 'image/jpeg') {
  if (!localPath) return null;
  const fullPath = path.join(process.cwd(), 'public', localPath);
  if (supabase) {
    try {
      const buffer = await fs.readFile(fullPath);
      const filename = path.basename(localPath);
      return await uploadToStorage(buffer, folder, filename, contentType);
    } catch (err) {
      console.error('Supabase upload failed:', err.message);
      return localPath;
    }
  }
  return localPath;
}
