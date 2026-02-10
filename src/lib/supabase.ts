/**
 * Browser Supabase client for direct Storage uploads (e.g. hero videos).
 * Uses anon key; Storage bucket must allow public uploads or use RLS policies.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/** Bucket for video files (hero, vibe-at-viet). Must be public. */
export const VIDEOS_BUCKET = 'videos';

/** Bucket for images (carousel, gallery, events, faculty, etc.). Must be public. */
export const IMAGES_BUCKET = 'images';

/**
 * Get public URL for a file in the videos bucket.
 */
export function getVideosPublicUrl(path: string): string {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${VIDEOS_BUCKET}/${path}`;
}

/**
 * Get public URL for a file in the images bucket.
 */
export function getImagesPublicUrl(path: string): string {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${IMAGES_BUCKET}/${path}`;
}
