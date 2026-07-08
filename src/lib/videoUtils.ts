/**
 * Utility functions for handling video URLs from various platforms
 */

import { getGoogleDrivePreviewEmbedUrl } from '@/lib/googleDriveUtils';

export type VideoPlatform = 'youtube' | 'instagram' | 'vimeo' | 'googledrive' | 'file' | 'unknown';

export interface VideoInfo {
  platform: VideoPlatform;
  embedUrl: string;
  originalUrl: string;
}

/** Extract Instagram reel/post id from a URL. */
export function extractInstagramReelId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}

/** Same-origin API path for gallery video playback (dev proxy + production). */
export function resolveApiMediaPath(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/api/')) return path;
  const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
  return path.startsWith('/') ? `${apiBase}${path}` : `${apiBase}/${path}`;
}

/** Build a proxied playback URL from resolve-video API response. */
export function buildProxiedPlaybackUrl(data: {
  proxyUrl?: string;
  directUrl?: string;
}): string | null {
  const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
  if (data.proxyUrl) {
    return resolveApiMediaPath(data.proxyUrl);
  }
  if (data.directUrl) {
    return `${apiBase}/video-proxy?url=${encodeURIComponent(data.directUrl)}`;
  }
  return null;
}

/** Detects if a video string is a full URL (not a relative path). */
export function isVideoUrl(video: string | null | undefined): boolean {
  if (!video) return false;
  return video.startsWith('http://') || video.startsWith('https://') || video.startsWith('//');
}

/**
 * Detects the video platform from a URL
 */
export function detectVideoPlatform(url: string): VideoPlatform {
  if (!isVideoUrl(url)) return 'file';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (lowerUrl.includes('instagram.com')) {
    return 'instagram';
  }
  if (lowerUrl.includes('vimeo.com')) {
    return 'vimeo';
  }
  if (lowerUrl.includes('drive.google.com')) {
    return 'googledrive';
  }

  return 'unknown';
}

/**
 * Converts a YouTube URL to an embed URL
 */
function convertYouTubeUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return url;
  return buildChromelessYouTubeEmbedUrl(videoId);
}

/** Extract YouTube video id from common URL shapes */
export function extractYouTubeVideoId(url: string): string | null {
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([^&\n?#/]+)/);
  if (shortsMatch) return shortsMatch[1];

  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (watchMatch) return watchMatch[1];

  const pathMatch = url.match(/\/watch\?v=([^&\n?#]+)/);
  if (pathMatch) return pathMatch[1];

  return null;
}

/** Minimal UI embed — use in gallery tiles where controls must not show */
export function buildChromelessYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    controls: '0',
    rel: '0',
    modestbranding: '1',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    playsinline: '1',
    cc_load_policy: '0',
    autohide: '1',
    showinfo: '0',
    enablejsapi: '0',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getChromelessYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return convertYouTubeUrl(url);
  return buildChromelessYouTubeEmbedUrl(videoId);
}

/** High-quality still for gallery tiles — avoids broken autoplay iframes */
export function getYouTubeThumbnailUrl(videoIdOrUrl: string): string | null {
  const videoId = extractYouTubeVideoId(videoIdOrUrl) ?? videoIdOrUrl;
  if (!videoId || videoId.length < 6) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/** Standard embed with controls — use in modals / detail views only */
export function buildYouTubeWatchEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeWatchEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return buildYouTubeWatchEmbedUrl(videoId);
}

/**
 * Converts an Instagram URL to an embed URL
 */
function convertInstagramUrl(url: string): string {
  // Handle Instagram post and reel URLs
  // https://www.instagram.com/p/POST_ID/
  // https://www.instagram.com/reel/REEL_ID/
  // https://instagram.com/p/POST_ID/
  
  // Instagram embed URLs use the format: https://www.instagram.com/p/POST_ID/embed/
  // But we need to extract the post/reel ID
  
  let postId = '';
  
  // Extract post/reel ID
  const postMatch = url.match(/instagram\.com\/(?:p|reel)\/([^\/\n?#]+)/);
  if (postMatch) {
    postId = postMatch[1];
  }
  
  if (!postId) {
    return url;
  }
  
  // Check if it's a reel or post
  const isReel = url.includes('/reel/');
  const path = isReel ? 'reel' : 'p';
  
  return `https://www.instagram.com/${path}/${postId}/embed/captioned/`;
}

/**
 * Converts a Vimeo URL to an embed URL
 */
function convertVimeoUrl(url: string): string {
  // Handle Vimeo URLs
  // https://vimeo.com/VIDEO_ID
  // https://player.vimeo.com/video/VIDEO_ID
  
  let videoId = '';
  
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    videoId = vimeoMatch[1];
  }
  
  if (!videoId) {
    return url;
  }
  
  // autoplay, mute, loop so video plays automatically without pause or permission screen
  const params = new URLSearchParams({
    autoplay: '1',
    muted: '1',
    loop: '1',
    background: '1',
  });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

/**
 * Converts a video URL to an embed URL based on platform
 */
export function getVideoEmbedUrl(video: string): VideoInfo {
  if (!isVideoUrl(video)) {
    return {
      platform: 'file',
      embedUrl: video,
      originalUrl: video,
    };
  }
  
  const platform = detectVideoPlatform(video);
  
  switch (platform) {
    case 'youtube':
      return {
        platform: 'youtube',
        embedUrl: convertYouTubeUrl(video),
        originalUrl: video,
      };
    case 'instagram':
      return {
        platform: 'instagram',
        embedUrl: convertInstagramUrl(video),
        originalUrl: video,
      };
    case 'vimeo':
      return {
        platform: 'vimeo',
        embedUrl: convertVimeoUrl(video),
        originalUrl: video,
      };
    case 'googledrive':
      return {
        platform: 'googledrive',
        embedUrl: getGoogleDrivePreviewEmbedUrl(video),
        originalUrl: video,
      };
    default:
      return {
        platform: 'unknown',
        embedUrl: video,
        originalUrl: video,
      };
  }
}
