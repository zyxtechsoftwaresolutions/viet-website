import { useEffect, useRef, useState } from 'react';

const INTRO_VIDEO_SRC = '/LOGO_RENDER.mp4';

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlayThrough = () => {
      setIsReady(true);
    };

    const handleEnded = () => {
      setIsFading(true);
      setTimeout(() => onComplete(), 150);
    };

    const handleError = () => {
      setError('Video failed to load');
      setTimeout(() => onComplete(), 800);
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    if (video.readyState >= 3) {
      setIsReady(true);
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;
    video.play().catch(() => setError('Autoplay blocked'));
  }, [isReady]);

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
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="mt-4 text-sm text-white/70">Loading...</p>
        </div>
      )}
      <video
        ref={videoRef}
        src={INTRO_VIDEO_SRC}
        preload="auto"
        muted
        playsInline
        className="h-full w-full object-contain"
        aria-label="VIET intro video"
      />
    </div>
  );
}
