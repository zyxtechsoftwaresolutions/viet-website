/**
 * Ensures bgvideoexp.mp4 is a real video file in dist after build.
 * Git LFS pointer files are tiny text stubs and will not play in the browser.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicVideo = path.join(root, 'public', 'bgvideoexp.mp4');
const distVideo = path.join(root, 'dist', 'bgvideoexp.mp4');

function isLfsPointer(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  if (stat.size < 1024) {
    const head = fs.readFileSync(filePath, 'utf8').slice(0, 80);
    return head.startsWith('version https://git-lfs.github.com/spec/v1');
  }
  return false;
}

function isMp4(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const buf = fs.readFileSync(filePath);
  if (buf.length < 12) return false;
  return buf.slice(4, 8).toString('ascii') === 'ftyp';
}

if (fs.existsSync(publicVideo)) {
  if (isLfsPointer(publicVideo)) {
    console.warn(
      '\n[build] WARNING: public/bgvideoexp.mp4 is a Git LFS pointer, not the real video.\n' +
        '  Deployment will not show the Explore Your Path background video unless you:\n' +
        '  1) Run "git lfs pull" before build (see render.yaml), or\n' +
        '  2) Upload the video in Admin → Intro Video → Explore Your Path section, or\n' +
        '  3) Set VITE_BGVIDEOEXP_URL to a Supabase/CDN URL in your deployment env.\n'
    );
  } else if (isMp4(publicVideo)) {
    fs.mkdirSync(path.dirname(distVideo), { recursive: true });
    fs.copyFileSync(publicVideo, distVideo);
    console.log('[build] Ensured bgvideoexp.mp4 in dist');
  }
} else {
  console.warn('[build] public/bgvideoexp.mp4 not found — Explore Your Path will use Supabase URL if configured.');
}
