/**
 * Client-side uploads to Supabase Storage. Admin uploads files directly from the browser; backend only stores URLs.
 * Use uploadToSupabase() for all media. Videos go to "videos" bucket, images/documents to "images" bucket.
 * Large videos (>6MB) use resumable (TUS) uploads for reliability and to respect higher size limits.
 */
import { supabase, VIDEOS_BUCKET, IMAGES_BUCKET, getVideosPublicUrl, getImagesPublicUrl } from './supabase';

export type StorageBucket = 'videos' | 'images';

const RESUMABLE_THRESHOLD = 6 * 1024 * 1024; // 6 MB – use TUS for larger files

function isSizeLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('413') ||
    lower.includes('entity too large') ||
    lower.includes('max limit') ||
    lower.includes('maximum size exceeded') ||
    lower.includes('size exceeded') ||
    lower.includes('file size')
  );
}

function wrapUploadError(error: unknown): Error {
  const msg =
    (error && typeof error === 'object' && 'message' in error && String((error as { message: unknown }).message)) ||
    (error instanceof Error ? error.message : String(error));
  if (isSizeLimitError(msg)) {
    const hint =
      ' Your file exceeds Supabase’s limit. Free plan: max 50 MB. To allow larger files (Pro): Supabase Dashboard → your project → Storage → Settings → set “Global file size limit” (e.g. 500 MB), then try again.';
    return new Error(msg + hint);
  }
  return error instanceof Error ? error : new Error(String(error));
}

/**
 * Resumable (TUS) upload for large video files. Uses direct storage hostname and 6MB chunks.
 * Loads tus-js-client dynamically so the admin page works even if the package is not installed.
 */
async function uploadVideoResumable(
  file: File,
  path: string,
  bucketName: string,
  contentType: string
): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase URL and anon key are required for resumable upload.');
  }

  let tus: typeof import('tus-js-client');
  try {
    const mod = await import('tus-js-client');
    tus = mod.default ?? mod;
  } catch {
    throw new Error(
      'Resumable upload requires tus-js-client. Run: npm install tus-js-client'
    );
  }

  const projectId = new URL(supabaseUrl).hostname.split('.')[0];
  const endpoint = `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`;

  const UploadClass = (tus as { Upload?: unknown })?.Upload ?? tus;
  return new Promise((resolve, reject) => {
    const upload = new UploadClass(file, {
      endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${anonKey}`,
        'x-upsert': 'true',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName,
        objectName: path,
        contentType: contentType || 'video/mp4',
      },
      chunkSize: 6 * 1024 * 1024, // 6 MB required by Supabase
      onError: (err: Error) => reject(err),
      onSuccess: () => resolve(),
    });
    upload.findPreviousUploads().then((previousUploads: unknown[]) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 * - Videos (video/*) → bucket "videos"
 * - Images and other files (e.g. PDF) → bucket "images"
 * For videos >6MB, uses resumable (TUS) upload.
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

  const contentType = file.type || 'application/octet-stream';

  if (resolvedBucket === 'videos' && file.size > RESUMABLE_THRESHOLD) {
    try {
      await uploadVideoResumable(file, path, bucketName, contentType);
      return getVideosPublicUrl(path);
    } catch (err) {
      console.error('Supabase resumable upload error:', err);
      throw wrapUploadError(err);
    }
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw wrapUploadError(error);
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
