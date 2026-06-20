import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Pin, ImageIcon } from 'lucide-react';
import { announcementsAPI, newsAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

interface Announcement {
  id: number;
  title: string;
  date: string;
  type: string;
  link: string;
  isExternal?: boolean;
}

interface News {
  id: number;
  title: string;
  description: string;
  date: string;
  link?: string;
  image?: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatDateLong = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const ROW_HEIGHT_PX = 48;
const VISIBLE_EXAM_ROWS = 8;
const EXAM_VIEWPORT_HEIGHT = ROW_HEIGHT_PX * VISIBLE_EXAM_ROWS;

const CARD_MIN_HEIGHT = 200;
const GRID_GAP_PX = 16;
const VISIBLE_UPDATE_ROWS = 2;
const UPDATE_VIEWPORT_HEIGHT = VISIBLE_UPDATE_ROWS * (CARD_MIN_HEIGHT + GRID_GAP_PX) - GRID_GAP_PX;

function getScrollDuration(itemCount: number, visibleCount: number, baseSeconds = 8) {
  return Math.max(28, (itemCount / Math.max(visibleCount, 1)) * baseSeconds);
}

function getGridContentHeight(itemCount: number) {
  const rowCount = Math.ceil(itemCount / 2);
  return rowCount * CARD_MIN_HEIGHT + Math.max(0, rowCount - 1) * GRID_GAP_PX;
}

interface ExaminationCornerProps {
  items: Array<{
    id: number;
    date: string;
    title: string;
    link?: string;
    isExternal?: boolean;
  }>;
  emptyMessage: string;
}

function ExaminationCorner({ items, emptyMessage }: ExaminationCornerProps) {
  const needsScroll = items.length > VISIBLE_EXAM_ROWS;
  const scrollDuration = getScrollDuration(items.length, VISIBLE_EXAM_ROWS, 6);

  const renderRow = (item: ExaminationCornerProps['items'][0], copyKey: string) => {
    const hasLink = item.link && item.link.trim() !== '' && item.link !== '#';
    const isExternal = hasLink && /^https?:\/\//i.test(item.link!);

    return (
      <tr
        key={`${copyKey}-${item.id}`}
        className="campus-craft-row campus-craft-row--sky border-b border-[#1e3a5f]/10 hover:bg-sky-50/70 transition-colors duration-200"
        style={{ height: ROW_HEIGHT_PX }}
      >
        <td className="px-3 py-2 text-[11px] font-bold text-[#1e3a5f] whitespace-nowrap w-[72px] align-middle border-r border-[#1e3a5f]/8">
          {formatDate(item.date)}
        </td>
        <td className="px-2.5 py-2 align-middle">
          {hasLink ? (
            <a
              href={item.link}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="font-semibold text-slate-800 hover:text-[#0a192f] line-clamp-2 transition-colors text-xs leading-snug"
            >
              {item.title}
            </a>
          ) : (
            <span className="font-semibold text-slate-800 line-clamp-2 text-xs leading-snug">{item.title}</span>
          )}
        </td>
        <td className="px-1 py-2 w-6 align-middle">
          {hasLink ? (
            <a
              href={item.link}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Read more"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          ) : null}
        </td>
      </tr>
    );
  };

  const tableBody = (copyKey: string) => (
    <tbody>
      {items.map((item) => renderRow(item, copyKey))}
    </tbody>
  );

  return (
    <div className="campus-craft-panel campus-craft-panel--sky flex flex-col h-full">
      <div className="campus-craft-header campus-craft-header--sky flex items-center gap-2 shrink-0">
        <Pin className="w-4 h-4 text-white/85 rotate-45 shrink-0" aria-hidden />
        <h3 className="campus-craft-header-title">Examination Corner</h3>
      </div>

      <div className="campus-craft-col-head campus-craft-col-head--sky grid grid-cols-[72px_1fr_24px] shrink-0 relative z-[3]">
        <span>Date</span>
        <span>Notice</span>
        <span className="sr-only">Link</span>
      </div>

      <div
        className="campus-panel-scroll-viewport relative z-[3] flex-1"
        style={{ height: EXAM_VIEWPORT_HEIGHT }}
      >
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm font-medium px-4 text-center">
            {emptyMessage}
          </div>
        ) : needsScroll ? (
          <div
            className="notice-auto-scroll"
            style={{
              '--scroll-duration': `${scrollDuration}s`,
              height: 2 * items.length * ROW_HEIGHT_PX,
            } as React.CSSProperties}
          >
            {[1, 2].map((copy) => (
              <table
                key={copy}
                className="w-full text-left border-collapse font-notice"
                style={{ height: items.length * ROW_HEIGHT_PX }}
              >
                {tableBody(String(copy))}
              </table>
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse font-notice">
            {tableBody('1')}
          </table>
        )}
      </div>
    </div>
  );
}

interface UpdateCardProps {
  item: News;
}

function UpdateCard({ item }: UpdateCardProps) {
  const hasLink = item.link && item.link.trim() !== '' && item.link !== '#';
  const isExternal = hasLink && /^https?:\/\//i.test(item.link!);
  const imageSrc = item.image ? imgUrl(item.image) : '';

  const content = (
    <>
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#f0ebe0] to-[#e8e2d6] overflow-hidden border-b-2 border-[#1a3a2a]/10">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#1a5c44]/25">
            <ImageIcon className="w-9 h-9" aria-hidden />
          </div>
        )}
        <span className="campus-craft-card-badge absolute top-2 left-2">Update</span>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] font-extrabold text-[#1a5c44] uppercase tracking-[0.12em]">
          {formatDateLong(item.date)}
        </span>
        <h4 className="font-bold text-[#0a192f] text-sm leading-snug line-clamp-2">{item.title}</h4>
        {item.description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>
        )}
      </div>
    </>
  );

  if (hasLink) {
    return (
      <a
        href={item.link}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="campus-craft-card group"
        style={{ '--craft-card-height': `${CARD_MIN_HEIGHT}px` } as React.CSSProperties}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      className="campus-craft-card"
      style={{ '--craft-card-height': `${CARD_MIN_HEIGHT}px` } as React.CSSProperties}
    >
      {content}
    </article>
  );
}

interface LatestUpdatesGridProps {
  items: News[];
  emptyMessage: string;
}

function LatestUpdatesGrid({ items, emptyMessage }: LatestUpdatesGridProps) {
  const rowCount = Math.ceil(items.length / 2);
  const needsScroll = rowCount > VISIBLE_UPDATE_ROWS;
  const contentHeight = getGridContentHeight(items.length);
  const scrollDuration = getScrollDuration(rowCount, VISIBLE_UPDATE_ROWS, 10);

  const grid = (keyPrefix: string) => (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      style={{ height: contentHeight, minHeight: contentHeight }}
    >
      {items.map((item) => (
        <UpdateCard key={`${keyPrefix}-${item.id}`} item={item} />
      ))}
    </div>
  );

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center border-2 border-dashed border-[#1a3a2a]/20 bg-[#fffef9] text-slate-500 text-sm font-medium relative z-[3]"
        style={{ minHeight: UPDATE_VIEWPORT_HEIGHT }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className="campus-panel-scroll-viewport relative z-[3]"
      style={{ height: UPDATE_VIEWPORT_HEIGHT }}
    >
      {needsScroll ? (
        <div
          className="notice-auto-scroll"
          style={{
            '--scroll-duration': `${scrollDuration}s`,
            height: contentHeight * 2,
          } as React.CSSProperties}
        >
          {grid('a')}
          {grid('b')}
        </div>
      ) : (
        grid('static')
      )}
    </div>
  );
}

const PANEL_FRAME_HEIGHT = Math.max(EXAM_VIEWPORT_HEIGHT, UPDATE_VIEWPORT_HEIGHT) + 96;

const NewsAnnouncementsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0, rootMargin: '120px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsData, newsData] = await Promise.all([
          announcementsAPI.getAll().catch(() => []),
          newsAPI.getAll().catch(() => []),
        ]);
        setAnnouncements((announcementsData as Announcement[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setNews((newsData as News[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch {
        setNews([]);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        'campus-updates-bg relative overflow-hidden border-y border-rose-100/60 font-notice',
        isInView ? 'section-in-view' : 'section-offscreen'
      )}
    >
      <div className="container relative z-10 mx-auto px-4 md:px-10 lg:px-12 py-12 md:py-16">
        <div className="mb-8 md:mb-10">
          <h2 className="home-section-title">
            Campus Updates
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-xl">
            Latest updates from the campus notice board
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-8 border-2 border-[#1a3a2a]/15 bg-white/70 animate-pulse" style={{ height: PANEL_FRAME_HEIGHT }} />
            <div className="lg:col-span-4 border-2 border-[#1e3a5f]/15 bg-white/70 animate-pulse" style={{ height: PANEL_FRAME_HEIGHT }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
              <div className="campus-craft-panel flex flex-col flex-1">
                <div className="campus-craft-header flex items-center justify-between shrink-0">
                  <h3 className="campus-craft-header-title">Latest Updates</h3>
                  <span className="text-[10px] sm:text-xs text-emerald-100/90 font-semibold tracking-wide hidden sm:inline uppercase">
                    News &amp; campus highlights
                  </span>
                </div>
                <div className="p-4 sm:p-5 flex-1 relative z-[3]">
                  <LatestUpdatesGrid items={news} emptyMessage="No updates at the moment." />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col">
              <ExaminationCorner
                items={announcements.map((a) => ({
                  id: a.id,
                  date: a.date,
                  title: a.title,
                  link: a.link,
                  isExternal: a.isExternal,
                }))}
                emptyMessage="No examination notices at the moment."
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsAnnouncementsSection;
