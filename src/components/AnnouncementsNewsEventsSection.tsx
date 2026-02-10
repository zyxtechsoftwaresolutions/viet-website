import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { eventsAPI } from '@/lib/api';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  image?: string;
  link?: string;
}

const RIGHT_VISIBLE_CARDS = 3;
const RIGHT_SCROLL_DURATION_BASE = 12;
const CARD_GAP_PX = 12;

const AnnouncementsNewsEventsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [leftCardHeightPx, setLeftCardHeightPx] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState<
    Record<number, { days: number; hours: number; minutes: number; seconds: number }>
  >({});

  // Defer API call until component is in viewport (intersection observer)
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const fetchData = async () => {
            try {
              const eventsData = await eventsAPI.getAll().catch(() => []);
              setEvents(eventsData);
            } catch (error) {
              console.error('Error fetching events:', error);
              setEvents([]);
            } finally {
              setLoading(false);
            }
          };
          fetchData();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before section enters viewport
    );
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);

  const calculateCountdown = (eventDate: string, eventTime: string) => {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`).getTime();
    const now = new Date().getTime();
    const distance = eventDateTime - now;
    if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    if (events.length === 0) return;
    const updateCountdowns = () => {
      const next: Record<number, { days: number; hours: number; minutes: number; seconds: number }> = {};
      events.forEach((event) => {
        next[event.id] = calculateCountdown(event.date, event.time);
      });
      setCountdowns(next);
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const toDateShort = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    return `${day} ${month}`;
  };

  // Event images are full Supabase Storage URLs from DB; use as-is.
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const now = new Date().getTime();
  const eventsSortedByDateAsc = [...events].sort((a, b) => {
    const aTime = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const bTime = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return aTime - bTime;
  });
  const eventsSortedByDateDesc = [...events].sort((a, b) => {
    const aTime = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const bTime = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return bTime - aTime;
  });
  const upcomingEvents = eventsSortedByDateAsc.filter((e) => {
    const eventTime = new Date(`${e.date}T${e.time || '00:00'}`).getTime();
    return eventTime >= now;
  });
  const latestEvent = upcomingEvents[0] || eventsSortedByDateDesc[0];
  const rightListEvents = eventsSortedByDateDesc.filter((e) => e.id !== latestEvent?.id);
  const rightListCards = rightListEvents.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description || '',
    dateShort: toDateShort(e.date),
    time: e.time,
    location: e.location,
    image: e.image || null,
    link: e.link,
  }));
  const latestEventCountdown = latestEvent ? (countdowns[latestEvent.id] || calculateCountdown(latestEvent.date, latestEvent.time || '00:00')) : null;
  const latestEventIsUpcoming = latestEventCountdown
    ? (latestEventCountdown.days > 0 || latestEventCountdown.hours > 0 || latestEventCountdown.minutes > 0 || latestEventCountdown.seconds > 0)
    : false;
  const latestEventImageUrl = latestEvent?.image || null;
  const rightVisibleCount = Math.min(rightListCards.length, RIGHT_VISIBLE_CARDS) || 1;
  // Use margin on each card so spacing is reliable (no attached cards). Each card: margin 6px top + 6px bottom = 12px between cards.
  const rightGapTotal = rightVisibleCount * CARD_GAP_PX;
  const rightCardHeightStyle =
    rightListCards.length > 0
      ? {
          height: `calc((100% - ${rightGapTotal}px) / ${rightVisibleCount})`,
          minHeight: 0,
          maxHeight: `calc((100% - ${rightGapTotal}px) / ${rightVisibleCount})`,
          flexShrink: 0,
          flexGrow: 0,
          marginTop: CARD_GAP_PX / 2,
          marginBottom: CARD_GAP_PX / 2,
        }
      : {};

  // Lock right column height to left card so: sum of 3 right cards = left card height (aligned).
  useEffect(() => {
    const el = leftCardRef.current;
    if (!el) return;
    const measure = () => setLeftCardHeightPx(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [events.length, loading]);

  // JS-driven animation: freezes exactly where it is on hover, continues from there on unhover.
  const duration = Math.max(RIGHT_SCROLL_DURATION_BASE, (rightListCards.length / RIGHT_VISIBLE_CARDS) * 4);
  const speed = 0.5 / (duration * 60);
  useEffect(() => {
    if (rightListCards.length <= RIGHT_VISIBLE_CARDS) return;
    const el = animRef.current;
    if (!el) return;
    let rafId: number;
    const tick = () => {
      if (!isHovered) {
        offsetRef.current += speed;
        if (offsetRef.current >= 0.5) offsetRef.current = 0;
        el.style.transform = `translate3d(0, ${-offsetRef.current * 100}%, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered, rightListCards.length, speed]);


  return (
    <>
      <style>{`
        .happenings-anim {
          will-change: transform;
          backface-visibility: hidden;
          contain: layout paint;
        }
      `}</style>
      <section
      id="happenings"
      className="glossy-green-texture relative py-20 overflow-hidden border-y border-emerald-200/50"
      ref={ref}
      >
      <div className="container relative z-10 mx-auto px-4 md:px-10 lg:px-12">
        {/* Section Header - aligned and styled like VIBE@VIET */}
        <div className="mb-6 md:mb-8 flex items-center gap-3">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f] px-3 py-1 rounded-lg bg-white/70 backdrop-blur-sm"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}
          >
            Happenings
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:items-stretch">
          {/* Left: Latest/Upcoming Event + Countdown – content-sized (16/9 image + content); height drives right column */}
          <div className="lg:col-span-3 order-2 lg:order-1 lg:self-start">
            <div ref={leftCardRef} className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              {latestEventImageUrl && (
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                  <img
                    src={latestEventImageUrl}
                    alt={latestEvent?.title ?? 'Latest event'}
                    className="h-full w-full object-cover"
                    width={800}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                  />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {latestEventIsUpcoming ? 'Latest upcoming event' : 'Latest event'}
                    </p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-bold text-foreground line-clamp-2">
                      {latestEvent ? latestEvent.title : 'No events yet'}
                    </h3>
                    {latestEvent && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {formatDate(latestEvent.date)} {latestEvent.time ? `• ${latestEvent.time}` : ''} {latestEvent.location ? `• ${latestEvent.location}` : ''}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {loading ? (
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    ) : latestEvent && latestEventCountdown && latestEventIsUpcoming ? (
                      <div className="flex gap-2">
                        <div className="rounded-lg bg-primary/10 px-2.5 py-2 text-center min-w-[3rem]">
                          <div className="text-lg md:text-xl font-bold text-primary leading-tight">{latestEventCountdown.days}</div>
                          <div className="text-[10px] uppercase text-muted-foreground">Days</div>
                        </div>
                        <div className="rounded-lg bg-primary/10 px-2.5 py-2 text-center min-w-[3rem]">
                          <div className="text-lg md:text-xl font-bold text-primary leading-tight">{latestEventCountdown.hours}</div>
                          <div className="text-[10px] uppercase text-muted-foreground">Hrs</div>
                        </div>
                        <div className="rounded-lg bg-primary/10 px-2.5 py-2 text-center min-w-[3rem]">
                          <div className="text-lg md:text-xl font-bold text-primary leading-tight">{latestEventCountdown.minutes}</div>
                          <div className="text-[10px] uppercase text-muted-foreground">Min</div>
                        </div>
                        <div className="rounded-lg bg-primary/10 px-2.5 py-2 text-center min-w-[3rem]">
                          <div className="text-lg md:text-xl font-bold text-primary leading-tight">{latestEventCountdown.seconds}</div>
                          <div className="text-[10px] uppercase text-muted-foreground">Sec</div>
                        </div>
                      </div>
                    ) : latestEvent && !latestEventIsUpcoming ? (
                      <span className="text-sm font-medium text-green-700 bg-green-100 rounded-lg px-3 py-2">Event completed</span>
                    ) : !latestEvent ? (
                      <p className="text-sm text-muted-foreground">Add events in the admin panel.</p>
                    ) : (
                      <div className="rounded-full bg-primary/10 p-3 text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: height locked to left card so 3 cards sum = left card height (aligned) */}
          <div
            className="lg:col-span-2 order-1 lg:order-2 flex min-h-0 overflow-hidden"
            style={
              leftCardHeightPx != null
                ? { height: `${leftCardHeightPx}px`, minHeight: 0, maxHeight: `${leftCardHeightPx}px` }
                : { minHeight: 0 }
            }
          >
            <div
              className="relative overflow-hidden flex-1 min-h-0 w-full h-full"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                ref={animRef}
                className="happenings-anim flex flex-col h-full"
                style={{
                  height: rightListCards.length > RIGHT_VISIBLE_CARDS ? '200%' : '100%',
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">Loading events...</div>
                ) : rightListCards.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">No events</div>
                ) : (
                  <>
                    {(rightListCards.length > RIGHT_VISIBLE_CARDS ? [1, 2] : [1]).map((copy) => (
                      <div
                        key={copy}
                        className="flex flex-col flex-shrink-0 items-stretch"
                        style={{
                          height: rightListCards.length > RIGHT_VISIBLE_CARDS ? '50%' : '100%',
                        }}
                      >
                        {rightListCards.map((card) => (
                          <a
                            key={`${copy}-${card.id}`}
                            href={card.link || '#'}
                            target={card.link?.startsWith('http') ? '_blank' : undefined}
                            rel={card.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="block rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                            style={rightCardHeightStyle}
                          >
                            <div className="relative h-full w-full">
                              {card.image ? (
                                <img
                                  src={card.image}
                                  alt={card.title}
                                  className="h-full w-full object-cover"
                                  width={400}
                                  height={300}
                                  loading="lazy"
                                  decoding="async"
                                  fetchpriority="auto"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-muted-foreground">
                                  <Calendar className="h-10 w-10 opacity-60" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                              <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                                  {card.dateShort}
                                </span>
                                <h4 className="mt-2 text-sm font-bold text-white line-clamp-2 tracking-tight drop-shadow-md [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                                  {card.title}
                                </h4>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/90 line-clamp-1">
                                  <Clock className="h-3.5 w-3.5 shrink-0 opacity-90" />
                                  <span>{card.time || 'TBA'}</span>
                                  {card.location && <span className="opacity-80">· {card.location}</span>}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                        {/* Spacer so next copy doesn't attach to this one when scrolling */}
                        {rightListCards.length > RIGHT_VISIBLE_CARDS && (
                          <div style={{ height: CARD_GAP_PX, minHeight: CARD_GAP_PX, flexShrink: 0 }} aria-hidden />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default AnnouncementsNewsEventsSection;
