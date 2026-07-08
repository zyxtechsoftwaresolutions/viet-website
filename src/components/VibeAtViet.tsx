import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { vibeAtVietAPI, type VibeAtVietItem } from '@/lib/api';
import {
  isVideoUrl,
  getVideoEmbedUrl,
  detectVideoPlatform,
  getYouTubeThumbnailUrl,
  getYouTubeWatchEmbedUrl,
  getChromelessYouTubeEmbedUrl,
  extractInstagramReelId,
  buildProxiedPlaybackUrl,
  resolveApiMediaPath,
  type VideoPlatform,
} from '@/lib/videoUtils';
import { convertGoogleDriveLink, isGoogleDriveLink, convertGoogleDriveToDownload } from '@/lib/googleDriveUtils';
import { getVibeAtVietGridClass, VIBE_AT_VIET_SLOT_COUNT, vibeOrderToSlotIndex } from '@/lib/vibeAtVietLayout';
import { imgUrl } from '@/lib/imageUtils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const VIMEO_PLATFORM: VideoPlatform = 'vimeo';

function usesNativeVideo(video: string | null | undefined): boolean {
  if (!video) return false;
  if (!isVideoUrl(video)) return true;
  const platform = detectVideoPlatform(video);
  return platform === 'file' || platform === 'googledrive' || platform === 'unknown';
}

function usesVimeoBackground(video: string): boolean {
  return isVideoUrl(video) && detectVideoPlatform(video) === VIMEO_PLATFORM;
}

function isExternalGalleryVideo(video: string): boolean {
  if (!video || !isVideoUrl(video)) return false;
  const platform = detectVideoPlatform(video);
  return platform === 'youtube' || platform === 'instagram';
}

function resolveItemVideo(item: VibeAtVietItem): string | null {
  const direct = item.video?.trim();
  if (direct) return direct;
  const linked = item.video_link?.trim();
  return linked || null;
}

const imageSrc = (path: string) => {
  if (!path) return '/placeholder.svg';
  if (isGoogleDriveLink(path)) return convertGoogleDriveLink(path);
  const resolved = imgUrl(path);
  return resolved || '/placeholder.svg';
};

function getTilePoster(item: VibeAtVietItem): string {
  if (item.image) return imageSrc(item.image);
  if (item.video && detectVideoPlatform(item.video) === 'youtube') {
    return getYouTubeThumbnailUrl(item.video) ?? '/placeholder.svg';
  }
  return '/placeholder.svg';
}

function VibeGalleryVideo({
  slotIndex,
  videoPath,
  poster,
  caption,
  videoRefs,
  onPlaybackFailed,
}: {
  slotIndex: number;
  videoPath: string;
  poster: string;
  caption: string;
  videoRefs: MutableRefObject<(HTMLVideoElement | null)[]>;
  onPlaybackFailed?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const src = (() => {
    if (!videoPath) return '';
    if (videoPath.startsWith('/api/')) return videoPath;
    if (isGoogleDriveLink(videoPath)) return convertGoogleDriveToDownload(videoPath);
    if (isVideoUrl(videoPath)) return videoPath;
    return resolveApiMediaPath(imgUrl(videoPath) || videoPath);
  })();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const video = videoRefs.current[slotIndex];
        if (!video) return;
        if (entries[0]?.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [slotIndex, videoRefs]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden rounded-[inherit]">
      <video
        ref={(el) => {
          videoRefs.current[slotIndex] = el;
        }}
        className="vibe-gallery-video absolute inset-0 h-full w-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload={videoPath.startsWith('/api/') ? 'auto' : 'metadata'}
        controls={false}
        controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        poster={poster}
        onCanPlay={() => {
          const video = videoRefs.current[slotIndex];
          if (video) video.play().catch(() => {});
        }}
        onError={(e) => {
          if (onPlaybackFailed) {
            onPlaybackFailed();
            return;
          }
          const target = e.target as HTMLVideoElement;
          target.style.display = 'none';
          const img = document.createElement('img');
          img.src = poster;
          img.className = 'absolute inset-0 h-full w-full object-cover pointer-events-none vibe-gallery-poster';
          img.alt = caption;
          target.parentElement?.appendChild(img);
        }}
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
      </video>
    </div>
  );
}

function VibeVimeoBackground({ videoUrl, title }: { videoUrl: string; title: string }) {
  const { embedUrl } = getVideoEmbedUrl(videoUrl);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="vibe-gallery-iframe border-0 pointer-events-none"
        allow="autoplay; fullscreen; picture-in-picture"
        loading="lazy"
        tabIndex={-1}
      />
    </div>
  );
}

function VibeInstagramEmbed({ reelUrl, title }: { reelUrl: string; title: string }) {
  const reelId = extractInstagramReelId(reelUrl);
  if (!reelId) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-black">
      <iframe
        src={`https://www.instagram.com/reel/${reelId}/embed/`}
        title={title}
        className="vibe-gallery-iframe vibe-gallery-iframe--instagram border-0 pointer-events-none"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        loading="lazy"
        tabIndex={-1}
      />
    </div>
  );
}

function VibeInstagramChromelessVideo({
  reelUrl,
  poster,
  caption,
  slotIndex,
  videoRefs,
}: {
  reelUrl: string;
  poster: string;
  caption: string;
  slotIndex: number;
  videoRefs: MutableRefObject<(HTMLVideoElement | null)[]>;
}) {
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [useEmbedFallback, setUseEmbedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

    fetch(`${apiBase}/resolve-video?url=${encodeURIComponent(reelUrl)}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { proxyUrl?: string; directUrl?: string }) => {
        if (cancelled) return;
        const resolved = buildProxiedPlaybackUrl(data);
        if (resolved) {
          setPlayUrl(resolved);
        } else {
          setUseEmbedFallback(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUseEmbedFallback(true);
      });

    return () => {
      cancelled = true;
    };
  }, [reelUrl]);

  if (useEmbedFallback) {
    return <VibeInstagramEmbed reelUrl={reelUrl} title={caption} />;
  }

  if (!playUrl) {
    return (
      <img
        src={poster}
        alt={caption}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <VibeGalleryVideo
      slotIndex={slotIndex}
      videoPath={playUrl}
      poster={poster}
      caption={caption}
      videoRefs={videoRefs}
      onPlaybackFailed={() => setUseEmbedFallback(true)}
    />
  );
}

function VibeYouTubeBackground({ videoUrl, title }: { videoUrl: string; title: string }) {
  const embedUrl = getChromelessYouTubeEmbedUrl(videoUrl);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="vibe-gallery-iframe border-0 pointer-events-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        tabIndex={-1}
      />
    </div>
  );
}

function VibeGalleryPoster({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover pointer-events-none vibe-gallery-poster"
      loading="lazy"
    />
  );
}

function VibeGalleryTileMedia({
  item,
  slotIndex,
  videoRefs,
  onExternalVideoClick,
}: {
  item: VibeAtVietItem;
  slotIndex: number;
  videoRefs: MutableRefObject<(HTMLVideoElement | null)[]>;
  onExternalVideoClick?: (item: VibeAtVietItem) => void;
}) {
  const video = resolveItemVideo(item);
  const poster = getTilePoster(item);

  if (!video) {
    return (
      <img
        src={poster}
        alt={item.caption}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }

  const platform = detectVideoPlatform(video);

  if (platform === 'instagram') {
    return (
      <VibeInstagramChromelessVideo
        reelUrl={video}
        poster={poster}
        caption={item.caption}
        slotIndex={slotIndex}
        videoRefs={videoRefs}
      />
    );
  }

  if (platform === 'youtube') {
    return <VibeYouTubeBackground videoUrl={video} title={item.caption} />;
  }

  if (usesNativeVideo(video)) {
    return (
      <VibeGalleryVideo
        slotIndex={slotIndex}
        videoPath={video}
        poster={poster}
        caption={item.caption}
        videoRefs={videoRefs}
      />
    );
  }

  if (usesVimeoBackground(video)) {
    return <VibeVimeoBackground videoUrl={video} title={item.caption} />;
  }

  if (isExternalGalleryVideo(video)) {
    return (
      <button
        type="button"
        className="absolute inset-0 w-full h-full border-0 p-0 bg-transparent cursor-pointer"
        onClick={() => onExternalVideoClick?.(item)}
        aria-label={`Play ${item.caption}`}
      >
        <VibeGalleryPoster src={poster} alt={item.caption} />
      </button>
    );
  }

  return <VibeGalleryPoster src={poster} alt={item.caption} />;
}

const VibeAtViet = () => {
  const navigate = useNavigate();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [galleryItems, setGalleryItems] = useState<VibeAtVietItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchVideo, setWatchVideo] = useState<{ embedUrl: string; title: string } | null>(null);

  const openExternalVideo = (item: VibeAtVietItem) => {
    const video = resolveItemVideo(item);
    if (!video) return;
    const platform = detectVideoPlatform(video);
    if (platform === 'youtube') {
      const embedUrl = getYouTubeWatchEmbedUrl(video);
      if (embedUrl) {
        setWatchVideo({ embedUrl, title: item.caption });
        return;
      }
    }
    const { embedUrl } = getVideoEmbedUrl(video);
    setWatchVideo({ embedUrl, title: item.caption });
  };

  useEffect(() => {
    vibeAtVietAPI.getAll()
      .then((items) => {
        const list = items || [];
        const seen = new Set<number>();
        const deduped = list.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        setGalleryItems(deduped);
      })
      .catch(() => setGalleryItems([]))
      .finally(() => setLoading(false));
  }, []);

  const orderedSlots: (VibeAtVietItem | null)[] = Array(VIBE_AT_VIET_SLOT_COUNT).fill(null);
  const sortedItems = [...galleryItems].sort((a, b) => b.id - a.id);
  sortedItems.forEach((item) => {
    const slotIndex = vibeOrderToSlotIndex(item.order ?? 999);
    if (slotIndex >= 0 && slotIndex < VIBE_AT_VIET_SLOT_COUNT && orderedSlots[slotIndex] === null) {
      orderedSlots[slotIndex] = item;
    }
  });
  const hasOrdered = orderedSlots.some((s) => s !== null);
  if (!hasOrdered && galleryItems.length > 0) {
    galleryItems.slice(0, VIBE_AT_VIET_SLOT_COUNT).forEach((item, i) => {
      orderedSlots[i] = item;
    });
  }

  useEffect(() => {
    galleryItems.forEach((item) => {
      const src = getTilePoster(item);
      const img = new Image();
      img.src = src;
    });
  }, [galleryItems]);

  const renderTile = (item: VibeAtVietItem, slotIndex: number, className: string) => (
    <div
      key={`vibe-slot-${slotIndex}-${item.id}`}
      className={`vibe-gallery-item relative group overflow-hidden ${className}`}
    >
      <VibeGalleryTileMedia
        item={item}
        slotIndex={slotIndex}
        videoRefs={videoRefs}
        onExternalVideoClick={openExternalVideo}
      />
      <div className="vibe-caption">
        <p
          className="text-[#0a192f] text-xs md:text-sm lg:text-base font-medium leading-snug"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {item.caption}
        </p>
      </div>
    </div>
  );

  return (
    <section id="vibe-at-viet" className="py-8 md:py-10 mb-3 md:mb-5 bg-white">
      <div className="container mx-auto px-4 md:px-10 lg:px-12">
        <div className="mb-6 md:mb-8 flex items-center gap-3">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f]"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}
          >
            Vibe@Viet
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-5 gap-2 min-h-[300px] place-items-center">
            <div className="col-span-5 flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0a192f] border-t-transparent" />
            </div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-gray-500">
            <p>No photos in Vibe@Viet yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 md:hidden">
              {orderedSlots.filter(Boolean).slice(0, 8).map((item, idx) => {
                if (!item) return null;
                const tall = idx === 0 || idx === 3 || idx === 5;
                return renderTile(
                  item,
                  idx,
                  `rounded-xl overflow-hidden ${tall ? 'row-span-2 min-h-[200px]' : 'min-h-[120px]'}`
                );
              })}
            </div>

            <div
              className="hidden md:grid grid-cols-5 gap-2 vibe-at-viet-grid"
            >
              {orderedSlots.map((item, slotIndex) => {
                const gridClass = getVibeAtVietGridClass(slotIndex);
                if (!item) {
                  return (
                    <div
                      key={`vibe-slot-${slotIndex}-empty`}
                      className={`${gridClass} bg-gray-100 rounded-xl min-h-[60px]`}
                      aria-hidden
                    />
                  );
                }
                return renderTile(item, slotIndex, `h-full min-h-[60px] ${gridClass}`);
              })}
            </div>
          </>
        )}

        {!loading && galleryItems.length > 0 && (
          <div className="relative z-10 flex justify-start mt-4 md:mt-5">
            <button
              type="button"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/gallery');
              }}
              className="group inline-flex items-center gap-3 text-[#0a192f] font-medium text-base hover:gap-4 transition-all duration-300"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors duration-300">
                <ArrowRight className="w-5 h-5 text-white" />
              </span>
              <span className="group-hover:underline underline-offset-4">View More</span>
            </button>
          </div>
        )}
      </div>

      <Dialog open={!!watchVideo} onOpenChange={(open) => !open && setWatchVideo(null)}>
        <DialogContent className="max-w-4xl w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden bg-black border-0">
          <button
            type="button"
            onClick={() => setWatchVideo(null)}
            className="absolute top-3 right-3 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
            aria-label="Close video"
          >
            <X className="h-5 w-5" />
          </button>
          {watchVideo && (
            <div className="relative w-full aspect-video">
              <iframe
                src={watchVideo.embedUrl}
                title={watchVideo.title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VibeAtViet;
