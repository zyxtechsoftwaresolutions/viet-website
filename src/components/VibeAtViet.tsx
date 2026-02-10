import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { vibeAtVietAPI, type VibeAtVietItem } from '@/lib/api';
import { isVideoUrl, getVideoEmbedUrl } from '@/lib/videoUtils';
import { convertGoogleDriveLink, isGoogleDriveLink, convertGoogleDriveToDownload } from '@/lib/googleDriveUtils';

const imageSrc = (path: string) => {
  if (!path) return '/placeholder.svg';
  if (isGoogleDriveLink(path)) return convertGoogleDriveLink(path);
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return path;
  return path;
};

const VibeAtViet = () => {
  const navigate = useNavigate();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [galleryItems, setGalleryItems] = useState<VibeAtVietItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vibeAtVietAPI.getAll()
      .then((items) => {
        const list = items || [];
        // Deduplicate by id to avoid duplicate tiles
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

  const videoSrc = (path: string) => {
    if (!path) return '';
    if (isGoogleDriveLink(path)) return convertGoogleDriveToDownload(path);
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path;
  };

  // Grid layout pattern - Based on provided HTML/CSS structure
  // 5 columns × 5 rows grid
  // div1: col 1, row 1 (default)
  // div2: col 2, row 1 (default)
  // div3: col 1, row 2
  // div4: col 2, row 2
  // div5: col 3, row 1, spans 2 rows
  // div6: col 4, row 1, spans 2 columns
  // div7: col 5, row 2, spans 3 rows
  // div8: col 4, row 5, spans 2 columns
  // div9: col 4, row 2
  // div10: col 4, row 3, spans 2 rows
  // div11: col 1, row 3, spans 3 rows
  // div13: col 2, row 3, spans 2 columns and 3 rows
  const getGridClass = (index: number) => {
    const patterns: { [key: number]: string } = {
      0: 'col-span-1 row-span-1', // div1: default position (col 1, row 1)
      1: 'col-span-1 row-span-1', // div2: default position (col 2, row 1)
      2: 'col-start-1 row-start-2 col-span-1 row-span-1', // div3: col 1, row 2
      3: 'col-start-2 row-start-2 col-span-1 row-span-1', // div4: col 2, row 2
      4: 'col-start-3 row-start-1 col-span-1 row-span-2', // div5: col 3, row 1, spans 2 rows
      5: 'col-start-4 row-start-1 col-span-2 row-span-1', // div6: col 4, row 1, spans 2 columns
      6: 'col-start-5 row-start-2 col-span-1 row-span-3', // div7: col 5, row 2, spans 3 rows
      7: 'col-start-4 row-start-5 col-span-2 row-span-1', // div8: col 4, row 5, spans 2 columns
      8: 'col-start-4 row-start-2 col-span-1 row-span-1', // div9: col 4, row 2
      9: 'col-start-4 row-start-3 col-span-1 row-span-2', // div10: col 4, row 3, spans 2 rows
      10: 'col-start-1 row-start-3 col-span-1 row-span-3', // div11: col 1, row 3, spans 3 rows
      11: 'col-start-2 row-start-3 col-span-2 row-span-3', // div13: col 2, row 3, spans 2 cols and 3 rows
    };
    return patterns[index] || 'col-span-1 row-span-1';
  };

  // Build 12 slots by order: slot[i] = item with order === i (so each grid position shows its assigned media)
  const orderedSlots: (VibeAtVietItem | null)[] = Array(12).fill(null);
  galleryItems.forEach((item) => {
    const o = item.order ?? 999;
    if (o >= 0 && o <= 11 && orderedSlots[o] === null) {
      orderedSlots[o] = item;
    }
  });
  // Fallback: if no items use order, fill slots in array order so we don't show empty grid
  const hasOrdered = orderedSlots.some((s) => s !== null);
  if (!hasOrdered && galleryItems.length > 0) {
    galleryItems.slice(0, 12).forEach((item, i) => {
      orderedSlots[i] = item;
    });
  }

  // Preload images when gallery items change
  useEffect(() => {
    galleryItems.forEach((item) => {
      if (item.image) {
        const src = imageSrc(item.image);
        const img = new Image();
        img.src = src;
      }
    });
  }, [galleryItems]);

  return (
    <section className="py-8 md:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 lg:px-12">
        {/* Section Header */}
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
          <div
            className="grid grid-cols-5 gap-1.5 md:gap-2 lg:gap-2.5"
            style={{
              gridTemplateRows: 'repeat(5, minmax(90px, 1fr))',
              maxHeight: 'calc(100vh - 180px)',
            }}
          >
            {orderedSlots.map((item, slotIndex) => {
              const gridClass = getGridClass(slotIndex);
              if (!item) {
                return <div key={`vibe-slot-${slotIndex}-empty`} className={`${gridClass} bg-gray-100 rounded-xl min-h-[60px]`} aria-hidden />;
              }
              return (
              <div
                key={`vibe-slot-${slotIndex}-${item.id}`}
                className={`vibe-gallery-item relative group cursor-pointer ${gridClass}`}
              >
                {item.video ? (
                  isVideoUrl(item.video) ? (
                    // Render iframe for video links (YouTube, Instagram, etc.)
                    (() => {
                      const videoInfo = getVideoEmbedUrl(item.video);
                      // YouTube URLs already have autoplay params from videoUtils
                      const embedUrl = videoInfo.embedUrl;
                      return (
                        <div className="w-full h-full relative" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                          <iframe
                            src={embedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            className="absolute inset-0 w-full h-full"
                            style={{ 
                              border: 'none', 
                              position: 'absolute', 
                              top: '50%',
                              left: '50%',
                              width: '177.78%',
                              height: '177.78%',
                              minWidth: '100%',
                              minHeight: '100%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 0,
                              pointerEvents: 'none',
                              backgroundColor: '#000'
                            }}
                            title={item.caption}
                            loading="lazy"
                            frameBorder="0"
                            allowFullScreen={false}
                          />
                          {/* Fallback image overlay - shows behind video */}
                          <img
                            src={imageSrc(item.image)}
                            alt={item.caption}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            width={400}
                            height={400}
                            loading={slotIndex < 4 ? "eager" : "lazy"}
                            fetchpriority={slotIndex < 4 ? "high" : "auto"}
                            decoding="async"
                            style={{ zIndex: -1, opacity: 1 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      );
                    })()
                  ) : (
                    // Render video element for uploaded files or Google Drive videos
                    <video
                      ref={(el) => { videoRefs.current[slotIndex] = el; }}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={imageSrc(item.image)}
                      onCanPlay={() => {
                        const video = videoRefs.current[slotIndex];
                        if (video) video.play().catch(() => {});
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        const img = document.createElement('img');
                        img.src = imageSrc(item.image);
                        img.className = 'w-full h-full object-cover';
                        img.alt = item.caption;
                        target.parentElement?.appendChild(img);
                      }}
                    >
                      {/* Support both MP4 and Google Drive direct links */}
                      <source src={videoSrc(item.video!)} type="video/mp4" />
                      <source src={videoSrc(item.video!)} type="video/webm" />
                      <img src={imageSrc(item.image)} alt={item.caption} className="w-full h-full object-cover" loading="eager" />
                    </video>
                  )
                ) : (
                  <img
                    src={imageSrc(item.image)}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                  />
                )}
                <div className="vibe-caption">
                  <p className="text-[#0a192f] text-sm md:text-base font-medium leading-snug" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {item.caption}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* View More Button - Amrita Style */}
        <div className="flex justify-start mt-4 md:mt-6">
          <button
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
      </div>
    </section>
  );
};

export default VibeAtViet;
