import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import FacilityWaveHero from '@/components/FacilityWaveHero';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { galleryAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import {
  DEFAULT_GALLERY_SETTINGS,
  normalizeGalleryPageData,
  photosForEvent,
  type GalleryEvent,
  type GalleryPageData,
  type GalleryPhoto,
} from '@/lib/galleryContent';

const GalleryPage = () => {
  const [data, setData] = useState<GalleryPageData>(() =>
    normalizeGalleryPageData({ settings: DEFAULT_GALLERY_SETTINGS, events: [], images: [] })
  );
  const [loading, setLoading] = useState(true);
  const [activeEventId, setActiveEventId] = useState<number | 'all'>('all');
  const [lightbox, setLightbox] = useState<{ photos: GalleryPhoto[]; index: number } | null>(null);

  useEffect(() => {
    galleryAPI
      .getPage()
      .then((page) => setData(normalizeGalleryPageData(page)))
      .catch(() => setData(normalizeGalleryPageData(null)))
      .finally(() => setLoading(false));
  }, []);

  const eventsWithPhotos = useMemo(
    () =>
      data.events
        .map((event) => ({ event, photos: photosForEvent(data.images, event) }))
        .filter((entry) => entry.photos.length > 0),
    [data.events, data.images]
  );

  const visibleSections = useMemo(() => {
    if (activeEventId === 'all') return eventsWithPhotos;
    return eventsWithPhotos.filter((entry) => entry.event.id === activeEventId);
  }, [activeEventId, eventsWithPhotos]);

  const openLightbox = (photos: GalleryPhoto[], index: number) => {
    setLightbox({ photos, index });
  };

  const shiftLightbox = (delta: number) => {
    if (!lightbox) return;
    const next = (lightbox.index + delta + lightbox.photos.length) % lightbox.photos.length;
    setLightbox({ ...lightbox, index: next });
  };

  const hero = data.settings.hero;

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />

      <FacilityWaveHero
        badge={hero.badge}
        title={hero.title}
        description={hero.description}
        heroImage={hero.heroImage}
        video={hero.video}
        gradient="linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)"
        waveFill="rgb(248 250 252)"
        showDotPattern
        align="end"
      />

      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="mb-10 text-left max-w-3xl">
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
              {data.settings.eventsSectionLabel}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-3">
              {data.settings.eventsSectionTitle}
            </h2>
            <div className="h-px w-16 bg-slate-300" aria-hidden />
          </div>

          {eventsWithPhotos.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                type="button"
                onClick={() => setActiveEventId('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeEventId === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                All events
              </button>
              {eventsWithPhotos.map(({ event }) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setActiveEventId(event.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeEventId === event.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {event.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-slate-500">Loading gallery…</div>
          ) : visibleSections.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              No event photos have been published yet. Check back soon.
            </div>
          ) : (
            <div className="space-y-16 md:space-y-20">
              {visibleSections.map(({ event, photos }) => (
                <EventGallerySection
                  key={event.id}
                  event={event}
                  photos={photos}
                  onOpenPhoto={(index) => openLightbox(photos, index)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={lightbox != null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-black border-none">
          <DialogTitle className="sr-only">Gallery photo</DialogTitle>
          {lightbox && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={imgUrl(lightbox.photos[lightbox.index]?.src)}
                alt={lightbox.photos[lightbox.index]?.caption || 'Gallery photo'}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              {lightbox.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => shiftLightbox(-1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftLightbox(1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              {lightbox.photos[lightbox.index]?.caption && (
                <p className="px-4 py-3 text-sm text-white/90 bg-black/80 text-center">
                  {lightbox.photos[lightbox.index].caption}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

function EventGallerySection({
  event,
  photos,
  onOpenPhoto,
}: {
  event: GalleryEvent;
  photos: GalleryPhoto[];
  onOpenPhoto: (index: number) => void;
}) {
  return (
    <motion.section
      id={`event-${event.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="scroll-mt-28"
    >
      <div className="mb-6 text-left">
        {event.badge && (
          <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-100 text-slate-700">
            {event.badge}
          </span>
        )}
        <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">{event.name}</h3>
        {event.description && (
          <p className="mt-2 text-slate-600 max-w-3xl leading-relaxed">{event.description}</p>
        )}
        <p className="mt-2 text-sm text-slate-500">{photos.length} photo{photos.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => onOpenPhoto(index)}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[4/3] text-left"
          >
            <img
              src={imgUrl(photo.src)}
              alt={photo.caption || event.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {photo.caption && (
              <p className="absolute bottom-0 left-0 right-0 p-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                {photo.caption}
              </p>
            )}
          </button>
        ))}
      </div>
    </motion.section>
  );
}

export default GalleryPage;
