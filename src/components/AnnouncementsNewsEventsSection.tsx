import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
  MapPin,
  Megaphone,
  Radio,
  Users,
} from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  time_end?: string;
  location?: string;
  image?: string;
  link?: string;
  featured?: boolean;
}

type EventTab = 'upcoming' | 'ongoing' | 'recent' | 'past';

const RIGHT_VISIBLE_ROWS = 4;
const RIGHT_SCROLL_DURATION_BASE = 14;
const ROW_GAP_PX = 10;
const EVENT_ROW_HEIGHT = 88;
const FEATURED_IMAGE_MIN_HEIGHT = 280;
const FEATURED_SLIDE_INTERVAL_MS = 8000;

type EventStatus = 'upcoming' | 'live' | 'completed';

const getEventStartMs = (e: Pick<Event, 'date' | 'time'>) =>
  new Date(`${e.date}T${e.time || '00:00'}`).getTime();

const getEventEndMs = (e: Pick<Event, 'date' | 'time' | 'time_end'>) => {
  const endTime = e.time_end?.trim();
  if (endTime) return new Date(`${e.date}T${endTime}`).getTime();
  return new Date(`${e.date}T23:59:59`).getTime();
};

const getEventStatus = (e: Pick<Event, 'date' | 'time' | 'time_end'>): EventStatus => {
  const now = Date.now();
  const start = getEventStartMs(e);
  const end = getEventEndMs(e);
  if (now < start) return 'upcoming';
  if (now <= end) return 'live';
  return 'completed';
};

const isFeaturedInCarousel = (e: Event) => {
  if (e.featured === false) return false;
  if (e.featured === true) return true;
  const status = getEventStatus(e);
  return status === 'upcoming' || status === 'live';
};

const sortFeaturedEvents = (events: Event[]) =>
  [...events].sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    const priority: Record<EventStatus, number> = { live: 0, upcoming: 1, completed: 2 };
    if (priority[statusA] !== priority[statusB]) return priority[statusA] - priority[statusB];
    if (statusA === 'upcoming') return getEventStartMs(a) - getEventStartMs(b);
    if (statusA === 'live') return getEventStartMs(a) - getEventStartMs(b);
    return getEventEndMs(b) - getEventEndMs(a);
  });

const EVENT_TABS: Array<{
  id: EventTab;
  label: string;
  sub: string;
  icon: typeof Calendar;
}> = [
  { id: 'upcoming', label: 'Upcoming Events', sub: "Don't miss what's next", icon: Calendar },
  { id: 'ongoing', label: 'Ongoing Events', sub: 'Live updates from campus', icon: Radio },
  { id: 'recent', label: 'Recent Events', sub: 'Highlights of happenings', icon: Megaphone },
  { id: 'past', label: 'Past Events', sub: 'Moments from the past', icon: History },
];

function formatDateBlock(dateString: string) {
  const d = new Date(dateString);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

function toGoogleCalendarDates(date: string, time: string, timeEnd?: string) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const start = new Date(`${date}T${time || '09:00'}`);
  const end = timeEnd ? new Date(`${date}T${timeEnd}`) : new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  return `${fmt(start)}/${fmt(end)}`;
}

function formatDateRange(event: Event) {
  const start = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  if (event.time_end) {
    return `${start} • ${event.time || '00:00'} – ${event.time_end}`;
  }
  if (event.time) return `${start} • ${event.time}`;
  return start;
}

const AnnouncementsNewsEventsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [featuredHeightPx, setFeaturedHeightPx] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>('recent');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isFeaturedAutoPlaying, setIsFeaturedAutoPlaying] = useState(true);
  const [countdowns, setCountdowns] = useState<
    Record<number, { days: number; hours: number; minutes: number; seconds: number }>
  >({});

  useEffect(() => {
    if (!ref.current) return;

    let fetched = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        setIsInView(visible);

        if (visible && !fetched) {
          fetched = true;
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
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const calculateCountdown = (eventDate: string, eventTime: string) => {
    const eventDateTime = new Date(`${eventDate}T${eventTime || '00:00'}`).getTime();
    const distance = eventDateTime - Date.now();
    if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    if (!isInView || events.length === 0) return;
    const updateCountdowns = () => {
      const next: Record<number, { days: number; hours: number; minutes: number; seconds: number }> = {};
      events.forEach((event) => {
        if (getEventStatus(event) === 'upcoming') {
          next[event.id] = calculateCountdown(event.date, event.time);
        }
      });
      setCountdowns(next);
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [events, isInView]);

  const liveEvents = useMemo(
    () => events.filter((e) => getEventStatus(e) === 'live'),
    [events]
  );
  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => getEventStatus(e) === 'upcoming')
        .sort((a, b) => getEventStartMs(a) - getEventStartMs(b)),
    [events]
  );
  const completedEvents = useMemo(
    () =>
      events
        .filter((e) => getEventStatus(e) === 'completed')
        .sort((a, b) => getEventEndMs(b) - getEventEndMs(a)),
    [events]
  );

  const featuredEvents = useMemo(() => {
    const featured = sortFeaturedEvents(events.filter(isFeaturedInCarousel));
    if (featured.length > 0) return featured;
    return completedEvents.length > 0 ? [completedEvents[0]] : [];
  }, [events, completedEvents]);

  const featuredIds = useMemo(() => new Set(featuredEvents.map((e) => e.id)), [featuredEvents]);

  useEffect(() => {
    setCurrentFeaturedIndex((prev) => {
      if (featuredEvents.length === 0) return 0;
      return prev >= featuredEvents.length ? 0 : prev;
    });
  }, [featuredEvents]);

  useEffect(() => {
    if (!isInView || !isFeaturedAutoPlaying || featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredEvents.length);
    }, FEATURED_SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isInView, isFeaturedAutoPlaying, featuredEvents.length]);

  const goToFeaturedSlide = (index: number) => {
    setCurrentFeaturedIndex(index);
    setIsFeaturedAutoPlaying(false);
    window.setTimeout(() => setIsFeaturedAutoPlaying(true), 10000);
  };

  const goToPrevFeaturedSlide = () => {
    const prev = currentFeaturedIndex === 0 ? featuredEvents.length - 1 : currentFeaturedIndex - 1;
    goToFeaturedSlide(prev);
  };

  const goToNextFeaturedSlide = () => {
    const next = (currentFeaturedIndex + 1) % featuredEvents.length;
    goToFeaturedSlide(next);
  };

  const tabEvents = useMemo(() => {
    const excludeFeatured = (list: Event[]) => list.filter((e) => !featuredIds.has(e.id));

    switch (activeTab) {
      case 'upcoming':
        return excludeFeatured(upcomingEvents);
      case 'ongoing':
        return excludeFeatured(liveEvents);
      case 'recent':
        return excludeFeatured(completedEvents.slice(0, 12));
      case 'past':
        return excludeFeatured(completedEvents);
      default:
        return [];
    }
  }, [activeTab, upcomingEvents, liveEvents, completedEvents, featuredIds]);

  const listCards = useMemo(
    () =>
      tabEvents.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        date: e.date,
        timeLabel: e.time_end
          ? `${e.time || '00:00'} – ${e.time_end}`
          : e.time || 'All day',
        location: e.location,
        image: e.image || null,
        link: e.link,
        status: getEventStatus(e),
      })),
    [tabEvents]
  );

  const needsScroll = listCards.length > RIGHT_VISIBLE_ROWS;
  const scrollDuration = Math.max(
    RIGHT_SCROLL_DURATION_BASE,
    (listCards.length / RIGHT_VISIBLE_ROWS) * 5
  );

  // Featured panel sets height; right column matches it on desktop only
  useEffect(() => {
    const el = featuredRef.current;
    if (!el || loading) return;
    const measure = () => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      setFeaturedHeightPx(isDesktop ? el.offsetHeight : null);
    };
    measure();
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [loading, featuredEvents.length, currentFeaturedIndex]);

  const getFeaturedStatusLabel = (status: EventStatus) =>
    status === 'live' ? 'Live Now' : status === 'upcoming' ? 'Upcoming' : 'Featured';

  const getFeaturedStatusBadgeClass = (status: EventStatus) =>
    status === 'live'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : status === 'upcoming'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-slate-100 text-slate-700 border-slate-200';

  const listHeaderLabel =
    activeTab === 'upcoming'
      ? 'Upcoming Events'
      : activeTab === 'ongoing'
        ? 'Ongoing Events'
        : activeTab === 'recent'
          ? 'Recent Events'
          : 'Past Events';

  const renderEventRow = (card: (typeof listCards)[0], keyPrefix: string) => {
    const dateBlock = formatDateBlock(card.date);
    const tagLabel =
      card.status === 'live' ? 'LIVE' : card.status === 'upcoming' ? 'UPCOMING' : 'COMPLETED';
    const tagClass =
      card.status === 'live'
        ? 'bg-emerald-100 text-emerald-800'
        : card.status === 'upcoming'
          ? 'bg-amber-50 text-amber-800'
          : 'bg-slate-100 text-slate-600';

    const inner = (
      <div className="happenings-event-row flex items-stretch h-full overflow-hidden">
        <div className="w-[62px] shrink-0 flex flex-col items-center justify-center border-r border-[#0a192f]/10 bg-[#f8fafc] px-1 py-2 text-center">
          <span className="text-[10px] font-bold text-emerald-800 tracking-wide">{dateBlock.month}</span>
          <span className="text-xl font-extrabold text-[#0a192f] leading-none">{dateBlock.day}</span>
          <span className="text-[9px] text-slate-500 mt-0.5">{dateBlock.year}</span>
        </div>
        <div className="w-[88px] shrink-0 border-r border-[#0a192f]/10 bg-slate-100">
          {card.image ? (
            <img src={card.image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">
              <Calendar className="h-6 w-6" aria-hidden />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 px-3 py-2.5 flex flex-col justify-center">
          <h4 className="text-sm font-bold text-[#0a192f] line-clamp-1">{card.title}</h4>
          {card.description && (
            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{card.description}</p>
          )}
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5', tagClass)}>
              {tagLabel}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {card.timeLabel}
            </span>
          </div>
        </div>
      </div>
    );

    if (card.link && card.link !== '#') {
      return (
        <a
          key={`${keyPrefix}-${card.id}`}
          href={card.link}
          target={card.link.startsWith('http') ? '_blank' : undefined}
          rel={card.link.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="block flex-shrink-0"
          style={{ height: EVENT_ROW_HEIGHT, marginBottom: ROW_GAP_PX }}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        key={`${keyPrefix}-${card.id}`}
        className="flex-shrink-0"
        style={{ height: EVENT_ROW_HEIGHT, marginBottom: ROW_GAP_PX }}
      >
        {inner}
      </div>
    );
  };

  return (
    <section
      id="happenings"
      ref={ref}
      className={cn(
        'happenings-section py-14 md:py-20',
        isInView ? 'section-in-view' : 'section-offscreen'
      )}
    >
      <div className="container mx-auto px-4 md:px-10 lg:px-12">
        {/* Header — same typography as Campus Updates */}
        <div className="mb-8 md:mb-10">
          <h2 className="home-section-title home-section-title--light">
            Happenings
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/90 max-w-xl">
            Stay updated with all the events and activities @ VIET
          </p>
        </div>

        {/* Featured drives height; recent-events panel matches it on desktop */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">
          {/* Featured event — left */}
          <div className="lg:col-span-7">
            <div ref={featuredRef} className="happenings-panel overflow-hidden w-full relative">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading events...</div>
              ) : featuredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No events yet. Add events in the admin panel.</div>
              ) : (
                <>
                  <div className={cn('relative', featuredEvents.length > 1 && 'pb-14')}>
                    {featuredEvents.map((featuredEvent, index) => {
                      const featuredStatus = getEventStatus(featuredEvent);
                      const featuredCountdown =
                        featuredStatus === 'upcoming'
                          ? countdowns[featuredEvent.id] ||
                            calculateCountdown(featuredEvent.date, featuredEvent.time || '00:00')
                          : null;
                      const isActive = index === currentFeaturedIndex;

                      return (
                        <div
                          key={featuredEvent.id}
                          className={cn(
                            'w-full transition-opacity duration-500',
                            isActive
                              ? 'relative opacity-100 z-10'
                              : 'absolute top-0 left-0 right-0 opacity-0 z-0 pointer-events-none'
                          )}
                          aria-hidden={!isActive}
                        >
                          <div className="grid md:grid-cols-[minmax(0,52%)_minmax(160px,48%)]">
                            <div className="p-6 md:p-9 flex flex-col">
                              <div className="flex items-center justify-between gap-3 mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                  Featured Event{featuredEvents.length > 1 ? ` ${index + 1} of ${featuredEvents.length}` : ''}
                                </span>
                                <span
                                  className={cn(
                                    'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border',
                                    getFeaturedStatusBadgeClass(featuredStatus)
                                  )}
                                >
                                  {getFeaturedStatusLabel(featuredStatus)}
                                </span>
                              </div>

                              <h3 className="text-2xl md:text-3xl font-bold text-[#0a192f] leading-tight">
                                {featuredEvent.title}
                              </h3>
                              {featuredEvent.description && (
                                <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-5">
                                  {featuredEvent.description}
                                </p>
                              )}

                              <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                  <Calendar className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden />
                                  <span>{formatDateRange(featuredEvent)}</span>
                                </li>
                                {featuredEvent.location && (
                                  <li className="flex items-start gap-2.5">
                                    <MapPin className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden />
                                    <span>{featuredEvent.location}</span>
                                  </li>
                                )}
                                <li className="flex items-start gap-2.5">
                                  <Users className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden />
                                  <span>Open for all students &amp; faculty</span>
                                </li>
                              </ul>

                              {featuredCountdown && featuredStatus === 'upcoming' && (
                                <div className="mt-6">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
                                    Event starts in
                                  </p>
                                  <div className="grid grid-cols-4 gap-2 max-w-sm">
                                    {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
                                      <div key={unit} className="happenings-countdown-box px-2 py-2.5 text-center">
                                        <div className="text-xl md:text-2xl font-extrabold text-[#0a192f] leading-none">
                                          {featuredCountdown[unit]}
                                        </div>
                                        <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">
                                          {unit}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-6 flex flex-wrap gap-3">
                                {featuredEvent.link && featuredEvent.link !== '#' ? (
                                  <a
                                    href={featuredEvent.link}
                                    target={featuredEvent.link.startsWith('http') ? '_blank' : undefined}
                                    rel={featuredEvent.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-colors"
                                  >
                                    View Details
                                    <ArrowRight className="h-4 w-4" aria-hidden />
                                  </a>
                                ) : null}
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 border-2 border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider px-4 py-2.5 hover:border-emerald-700/40 hover:text-emerald-800 transition-colors"
                                  onClick={() => {
                                    const dates = toGoogleCalendarDates(
                                      featuredEvent.date,
                                      featuredEvent.time,
                                      featuredEvent.time_end
                                    );
                                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(featuredEvent.title)}&dates=${dates}&details=${encodeURIComponent(featuredEvent.description || '')}&location=${encodeURIComponent(featuredEvent.location || 'VIET Campus')}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  <CalendarPlus className="h-4 w-4" aria-hidden />
                                  Add to Calendar
                                </button>
                              </div>
                            </div>

                            <div
                              className="relative bg-slate-100 border-t md:border-t-0 md:border-l border-[#0a192f]/10"
                              style={{ minHeight: FEATURED_IMAGE_MIN_HEIGHT }}
                            >
                              {featuredEvent.image ? (
                                <img
                                  src={featuredEvent.image}
                                  alt={featuredEvent.title}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                                  <Calendar className="h-16 w-16 text-emerald-200" aria-hidden />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {featuredEvents.length > 1 && (
                    <>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {featuredEvents.map((event, index) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => goToFeaturedSlide(index)}
                            className={cn(
                              'transition-all duration-300 rounded-full',
                              index === currentFeaturedIndex
                                ? 'w-8 h-2 bg-emerald-700'
                                : 'w-2 h-2 bg-emerald-700/35 hover:bg-emerald-700/55'
                            )}
                            aria-label={`Go to featured event ${index + 1}`}
                          />
                        ))}
                      </div>

                      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={goToPrevFeaturedSlide}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-[#0a192f]/15 text-[#0a192f] hover:bg-white hover:border-emerald-700/30 transition-colors"
                          aria-label="Previous featured event"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={goToNextFeaturedSlide}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-[#0a192f]/15 text-[#0a192f] hover:bg-white hover:border-emerald-700/30 transition-colors"
                          aria-label="Next featured event"
                        >
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Recent events — height locked to featured panel on desktop */}
          <div
            className="lg:col-span-5 flex flex-col min-h-0"
            style={
              featuredHeightPx != null
                ? { height: `${featuredHeightPx}px`, maxHeight: `${featuredHeightPx}px` }
                : undefined
            }
          >
            <div className="happenings-panel flex flex-col flex-1 min-h-0 h-full p-4 md:p-5">
              <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#0a192f]">
                  {listHeaderLabel}
                </h3>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                  onClick={() => setActiveTab('past')}
                >
                  View all
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </button>
              </div>

              <div className="campus-panel-scroll-viewport flex-1 min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">Loading...</div>
                ) : listCards.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm text-center px-4">
                    No events in this category.
                  </div>
                ) : (
                  <div
                    className={cn(needsScroll && 'notice-auto-scroll')}
                    style={
                      needsScroll
                        ? ({
                            '--scroll-duration': `${scrollDuration}s`,
                            height: listCards.length * 2 * (EVENT_ROW_HEIGHT + ROW_GAP_PX),
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {(needsScroll ? [1, 2] : [1]).map((copy) => (
                      <div key={copy}>
                        {listCards.map((card) => renderEventRow(card, String(copy)))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom category tabs */}
        <div className="mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {EVENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'happenings-tab text-left p-4 flex items-start gap-3',
                  isActive && 'happenings-tab--active'
                )}
              >
                <span
                  className={cn(
                    'shrink-0 w-10 h-10 flex items-center justify-center border',
                    isActive
                      ? 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
                      : 'border-[#0a192f]/10 bg-slate-50 text-slate-600'
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wide text-[#0a192f]">
                    {tab.label}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 leading-snug">{tab.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsNewsEventsSection;
