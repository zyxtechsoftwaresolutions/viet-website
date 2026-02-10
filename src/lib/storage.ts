/**
 * Client-side uploads to Supabase Storage. Admin uploads files directly from the browser; backend only stores URLs.
 * Use uploadToSupabase() for all media. Videos go to "videos" bucket, images/documents to "images" bucket.
 */
import { supabase, VIDEOS_BUCKET, IMAGES_BUCKET, getVideosPublicUrl, getImagesPublicUrl } from './supabase';

export type StorageBucket = 'videos' | 'images';

/**
 * Upload a file to Supabase Storage and return its public URL.
 * - Videos (video/*) → bucket "videos"
 * - Images and other files (e.g. PDF) → bucket "images"
 * @param file - The file to upload
 * @param folder - Folder path within the bucket (e.g. 'events', 'carousel', 'gallery')
 * @param bucket - Optional: force 'videos' or 'images'. Default: inferred from file.type
 */
export async function uploadToSupabase(
  file: File,
  folder: string,
  bucket?: StorageBucket
): Promise<string> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
    );
  }

  const resolvedBucket: StorageBucket =
    bucket ||
    (file.type.startsWith('video/') ? 'videos' : 'images');
  const bucketName = resolvedBucket === 'videos' ? VIDEOS_BUCKET : IMAGES_BUCKET;
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const path = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload: ${error.message}`);
  }

  const publicUrl =
    resolvedBucket === 'videos'
      ? getVideosPublicUrl(data.path)
      : getImagesPublicUrl(data.path);
  return publicUrl;
}

/**
 * Upload a video file (hero, vibe-at-viet). Uses "videos" bucket.
 */
export async function uploadVideoToSupabase(
  file: File,
  folder: string = 'hero-videos'
): Promise<string> {
  return uploadToSupabase(file, folder, 'videos');
}

/**
 * Upload an image file (poster, carousel, gallery, etc.). Uses "images" bucket.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: string
): Promise<string> {
  return uploadToSupabase(file, folder, 'images');
}

/**
 * Upload poster image for hero (kept in videos bucket for hero assets).
 */
export async function uploadPosterToSupabase(
  file: File,
  folder: string = 'hero-videos'
): Promise<string> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
    );
  }
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${folder}/poster-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(VIDEOS_BUCKET)
    .upload(filename, file, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    });
  if (error) throw new Error(`Failed to upload poster: ${error.message}`);
  return getVideosPublicUrl(data.path);
}

/**
 * Upload a video file for vibe-at-viet section.
 */
export async function uploadVibeVideoToSupabase(file: File): Promise<string> {
  return uploadVideoToSupabase(file, 'vibe-at-viet');
}
