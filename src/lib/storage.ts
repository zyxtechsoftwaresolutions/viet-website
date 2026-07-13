/**
 * Authenticated media uploads.
 * Flow: admin JWT → POST /api/upload/sign (service role) → PUT file to signed URL.
 * The public anon key is never used for writes (prevents storage overwrite attacks).
 */
import { API_BASE_URL } from './apiConfig';
import { compressImageForUpload, imageTooLargeMessage, isImageTooLargeForUpload } from './compressImage';

export type StorageBucket = 'videos' | 'images';

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
      ' Your file exceeds the storage limit. Free plan: max 50 MB. Pro: raise “Global file size limit” in Supabase Storage settings.';
    return new Error(msg + hint);
  }
  return error instanceof Error ? error : new Error(String(msg));
}

type SignedUploadResponse = {
  signedUrl: string;
  token?: string;
  path: string;
  bucket: string;
  publicUrl: string;
};

async function requestSignedUpload(params: {
  folder: string;
  fileName: string;
  contentType: string;
  bucket: StorageBucket;
  fileSize: number;
}): Promise<SignedUploadResponse> {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    throw new Error('You must be logged in as admin to upload files.');
  }

  const response = await fetch(`${API_BASE_URL}/upload/sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create upload URL' }));
    throw new Error(error.error || 'Failed to create upload URL');
  }

  return response.json();
}

async function putToSignedUrl(signedUrl: string, file: Blob, contentType: string): Promise<void> {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Upload failed (${response.status})`);
  }
}

/**
 * Upload a file via authenticated signed URL and return its public URL.
 * - Videos (video/*) → bucket "videos"
 * - Images and other files (e.g. PDF) → bucket "images"
 */
export async function uploadToSupabase(
  file: File,
  folder: string,
  bucket?: StorageBucket
): Promise<string> {
  const resolvedBucket: StorageBucket =
    bucket === 'videos' || bucket === 'images'
      ? bucket
      : file.type.startsWith('video/')
        ? 'videos'
        : 'images';

  let uploadFile: File | Blob = file;
  if (resolvedBucket === 'images' && file.type.startsWith('image/')) {
    uploadFile = await compressImageForUpload(file);
    if (isImageTooLargeForUpload(uploadFile as File)) {
      throw new Error(imageTooLargeMessage(uploadFile as File));
    }
  }

  const contentType =
    (uploadFile instanceof File ? uploadFile.type : file.type) ||
    (resolvedBucket === 'images' ? 'image/jpeg' : 'video/mp4');

  try {
    const signed = await requestSignedUpload({
      folder,
      fileName: file.name,
      contentType,
      bucket: resolvedBucket,
      fileSize: uploadFile.size,
    });

    await putToSignedUrl(signed.signedUrl, uploadFile, contentType);
    if (!signed.publicUrl) {
      throw new Error('Upload succeeded but no public URL was returned.');
    }
    return signed.publicUrl;
  } catch (err) {
    console.error('Secure upload error:', err);
    throw wrapUploadError(err);
  }
}

/** Upload a video file (hero, vibe-at-viet). Uses "videos" bucket. */
export async function uploadVideoToSupabase(
  file: File,
  folder: string = 'hero-videos'
): Promise<string> {
  return uploadToSupabase(file, folder, 'videos');
}

/** Upload an image file (poster, carousel, gallery, etc.). Uses "images" bucket. */
export async function uploadImageToSupabase(
  file: File,
  folder: string
): Promise<string> {
  return uploadToSupabase(file, folder, 'images');
}

/** Upload poster image for hero (kept in videos bucket for hero assets). */
export async function uploadPosterToSupabase(
  file: File,
  folder: string = 'hero-videos'
): Promise<string> {
  return uploadToSupabase(file, folder, 'videos');
}

/** Upload a video file for vibe-at-viet section. */
export async function uploadVibeVideoToSupabase(file: File): Promise<string> {
  return uploadVideoToSupabase(file, 'vibe-at-viet');
}
