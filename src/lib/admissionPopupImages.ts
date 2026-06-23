/** Preload popup carousel images so they appear instantly when the dialog opens. */
export function preloadAdmissionPopupImages(urls: string[]): void {
  const valid = urls.filter(Boolean);
  if (!valid.length) return;

  valid.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });

  const first = valid[0];
  if (!document.querySelector(`link[data-admission-preload="${first}"]`)) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = first;
    link.setAttribute('data-admission-preload', first);
    document.head.appendChild(link);
  }
}

/** Resize & compress before upload — keeps popup loads fast on slow connections. */
export async function compressAdmissionPopupImage(
  file: File,
  maxWidth = 1200,
  quality = 0.85
): Promise<File> {
  if (!file.type.startsWith('image/') || file.size < 200_000) {
    return file;
  }

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

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });

  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'admission-image';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}
