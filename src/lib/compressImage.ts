/** Resize & compress images before Supabase upload to avoid bucket size limits. */

const DEFAULT_MAX_WIDTH = 1600;
const DEFAULT_QUALITY = 0.85;
/** Supabase bucket limits are often 5 MB on smaller plans — stay safely under. */
export const MAX_IMAGE_UPLOAD_BYTES = 4.5 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function compressImageForUpload(
  file: File,
  maxWidth = DEFAULT_MAX_WIDTH,
  quality = DEFAULT_QUALITY
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  // Skip tiny files and GIFs (animation would be lost)
  if (file.size < 200_000 || file.type === 'image/gif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let q = quality;
    let blob: Blob | null = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', q);
      });
      if (!blob || blob.size <= MAX_IMAGE_UPLOAD_BYTES) break;
      q -= 0.12;
    }

    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}

export function isImageTooLargeForUpload(file: File): boolean {
  return file.size > MAX_IMAGE_UPLOAD_BYTES;
}

export function imageTooLargeMessage(file: File): string {
  return `Image is too large (${formatFileSize(file.size)}). Maximum is ${formatFileSize(MAX_IMAGE_UPLOAD_BYTES)}. Use a smaller photo or let the uploader compress it.`;
}
