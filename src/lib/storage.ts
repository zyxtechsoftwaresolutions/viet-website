/**
 * Client-side uploads to Supabase Storage. Admin uploads files directly from the browser; backend only stores URLs.
 * Use uploadToSupabase() for all media. Videos go to "videos" bucket, images/documents to "images" bucket.
 * Large videos (>6MB) use resumable (TUS) uploads for reliability and to respect higher size limits.
 */
import { getSupabase, readSupabasePublicConfig, VIDEOS_BUCKET, IMAGES_BUCKET, getVideosPublicUrl, getImagesPublicUrl } from './supabase';
import { compressImageForUpload, imageTooLargeMessage, isImageTooLargeForUpload } from './compressImage';

export type StorageBucket = 'videos' | 'images';

const RESUMABLE_THRESHOLD = 6 * 1024 * 1024; // 6 MB – use TUS for larger files

function isSizeLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('413') ||
    lower.includes('entity too large') ||
    lower.includes('max limit') ||
    lower.includes('maximum size exceeded') ||
    lower.includes('maximum allowed size') ||
    lower.includes('exceeded the maximum') ||
    lower.includes('size exceeded') ||
    lower.includes('file size') ||
    lower.includes('too large')
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
  const { supabaseUrl, supabaseAnonKey } = readSupabasePublicConfig();
  if (!supabaseUrl || !supabaseAnonKey) {
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
        authorization: `Bearer ${supabaseAnonKey}`,
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
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. On Render set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY), then redeploy.'
    );
  }

  const resolvedBucket: StorageBucket =
    bucket ||
    (file.type.startsWith('video/') ? 'videos' : 'images');
  const bucketName = resolvedBucket === 'videos' ? VIDEOS_BUCKET : IMAGES_BUCKET;
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const path = `${folder}/${fileName}`;

  let uploadFile = file;
  if (resolvedBucket === 'images' && file.type.startsWith('image/')) {
    uploadFile = await compressImageForUpload(file);
    if (isImageTooLargeForUpload(uploadFile)) {
      throw new Error(imageTooLargeMessage(uploadFile));
    }
  }

  const contentType =
    uploadFile.type || (resolvedBucket === 'images' ? 'image/jpeg' : 'application/octet-stream');

  if (resolvedBucket === 'videos' && uploadFile.size > RESUMABLE_THRESHOLD) {
    try {
      await getSupabase();
      await uploadVideoResumable(uploadFile, path, bucketName, contentType);
      return getVideosPublicUrl(path);
    } catch (err) {
      console.error('Supabase resumable upload error:', err);
      throw wrapUploadError(err);
    }
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, uploadFile, {
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
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. On Render set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY), then redeploy.'
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
