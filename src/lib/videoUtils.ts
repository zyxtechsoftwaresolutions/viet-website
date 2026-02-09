/**
 * Utility functions for handling video URLs from various platforms
 */

export type VideoPlatform = 'youtube' | 'instagram' | 'vimeo' | 'file' | 'unknown';

export interface VideoInfo {
  platform: VideoPlatform;
  embedUrl: string;
  originalUrl: string;
}

/**
 * Detects if a video string is a URL or a file path
 */
export function isVideoUrl(video: string | null | undefined): boolean {
  if (!video) return false;
  // If it starts with /uploads/, it's a file path
  if (video.startsWith('/uploads/')) return false;
  // If it starts with http:// or https://, it's a URL
  if (video.startsWith('http://') || video.startsWith('https://')) return true;
  // If it starts with //, it's a protocol-relative URL
  if (video.startsWith('//')) return true;
  return false;
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
  
  return 'unknown';
}

/**
 * Converts a YouTube URL to an embed URL
 */
function convertYouTubeUrl(url: string): string {
  // Handle various YouTube URL formats
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://m.youtube.com/watch?v=VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID (YouTube Shorts)
  // https://youtube.com/shorts/VIDEO_ID
  
  let videoId = '';
  
  // Extract video ID from different URL formats
  // Priority: shorts, watch, youtu.be, embed
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([^&\n?#\/]+)/);
  if (shortsMatch) {
    videoId = shortsMatch[1];
  } else {
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
  }
  
  if (!videoId) {
    // Fallback: try to extract from URL path
    const pathMatch = url.match(/\/watch\?v=([^&\n?#]+)/);
    if (pathMatch) {
      videoId = pathMatch[1];
    }
  }
  
  if (!videoId) {
    // If we can't extract, return original URL
    return url;
  }
  
  // Check if original URL was a Shorts URL
  const isShorts = url.toLowerCase().includes('/shorts/');
  
  // Return embed URL with autoplay, mute, loop, and no controls
  // For YouTube Shorts, add loop and playlist for continuous playback
  const params = isShorts 
    ? 'autoplay=1&mute=1&loop=1&playlist=' + videoId + '&controls=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3'
    : 'autoplay=1&mute=1&loop=1&playlist=' + videoId + '&controls=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3';
  
  return `https://www.youtube.com/embed/${videoId}?${params}`;
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
  
  return `https://www.instagram.com/${path}/${postId}/embed/`;
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
  
  return `https://player.vimeo.com/video/${videoId}`;
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
    default:
      return {
        platform: 'unknown',
        embedUrl: video,
        originalUrl: video,
      };
  }
}
