import { useEffect, useRef, useState } from 'react';
import { introVideoSettingsAPI } from '@/lib/api';
import { isGoogleDriveLink, getGoogleDrivePreviewEmbedUrl } from '@/lib/googleDriveUtils';

let INTRO_VIDEO_SRC = '/LOGO_RENDER.mp4'; // Fallback
let INTRO_VIDEO_ENABLED = false; // Fallback

/** Preload these during intro so hero has no black gap when intro ends. */
const HERO_VIDEO_PRELOAD_SRCS = ['/campus1.mp4', '/campus2 (2).mp4'];

/**
 * Full-screen intro video. Plays on every site load/refresh.
 * Waits for enough buffering (canplaythrough) before playing to avoid stutter.
 * Preloads hero videos during intro so home screen plays immediately.
 */
export default function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Fetch intro video settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await introVideoSettingsAPI.get();
        if (settings.is_enabled && settings.video_url) {
          setVideoSrc(settings.video_url);
          INTRO_VIDEO_SRC = settings.video_url;
          INTRO_VIDEO_ENABLED = true;
        } else {
          setVideoSrc(null);
          INTRO_VIDEO_ENABLED = false;
          // If disabled, complete immediately
          onComplete();
        }
      } catch (err) {
        console.error('Failed to fetch intro video settings:', err);
        // Use fallback on error
        if (INTRO_VIDEO_ENABLED) {
          setVideoSrc(INTRO_VIDEO_SRC);
        } else {
          onComplete();
        }
      }
    };
    fetchSettings();
  }, [onComplete]);

  // Set up video event listeners when videoSrc is available
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // Reset state when source changes
    setIsReady(false);
    setIsFading(false);
    setError(null);

    const handleCanPlayThrough = () => {
      setIsReady(true);
    };

    const handleEnded = () => {
      setIsFading(true);
      setTimeout(() => onComplete(), 150);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setError('Video failed to load');
      setTimeout(() => onComplete(), 800);
    };

    const handleLoadedData = () => {
      // Video has loaded enough data
      if (video.readyState >= 3) {
        setIsReady(true);
      }
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Load the video source
    video.load();

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc, onComplete]);

  // Play video when ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady || !videoSrc) return;
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Video is playing
        })
        .catch((err) => {
          console.error('Autoplay blocked:', err);
          setError('Autoplay blocked. Click to continue.');
        });
    }
  }, [isReady, videoSrc]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => onComplete(), 150);
  };

  if (error) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 transition-opacity duration-300"
        role="presentation"
      >
        <p className="text-neutral-400 text-sm mb-4">{error}</p>
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          Continue to site
        </button>
      </div>
    );
  }

  if (!videoSrc) {
    return null; // Don't render if no video source
  }

  const isDrive = isGoogleDriveLink(videoSrc);
  const embedUrl = isDrive ? getGoogleDrivePreviewEmbedUrl(videoSrc) : null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-150 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      role="presentation"
    >
      {/* Preload hero videos during intro so home screen plays immediately */}
      {HERO_VIDEO_PRELOAD_SRCS.map((src) => (
        <video
          key={src}
          src={src}
          preload="auto"
          muted
          playsInline
          className="hidden"
          aria-hidden
        />
      ))}
      {embedUrl ? (
        <>
          <iframe
            src={embedUrl}
            title="VIET intro video"
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-4 right-4 px-4 py-2 rounded-md bg-black/50 text-white text-sm font-medium hover:bg-black/70 transition-colors z-10"
            aria-label="Skip intro video"
          >
            Skip
          </button>
        </>
      ) : (
        <>
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <p className="mt-4 text-sm text-white/70">Loading video...</p>
            </div>
          )}
          <video
            ref={videoRef}
            src={videoSrc}
            preload="auto"
            muted
            playsInline
            className="h-full w-full object-contain"
            aria-label="VIET intro video"
            onClick={handleSkip}
          />
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-4 right-4 px-4 py-2 rounded-md bg-black/50 text-white text-sm font-medium hover:bg-black/70 transition-colors z-10"
            aria-label="Skip intro video"
          >
            Skip
          </button>
        </>
      )}
    </div>
  );
}
