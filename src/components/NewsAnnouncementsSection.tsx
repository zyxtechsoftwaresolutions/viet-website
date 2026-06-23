import { useState, useEffect } from 'react';
import { ChevronRight, Pin, ImageIcon } from 'lucide-react';
import { announcementsAPI, newsAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import CampusAutoScrollViewport from '@/components/CampusAutoScrollViewport';
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

const CARD_MIN_HEIGHT = 200;
const GRID_GAP_PX = 16;
const VISIBLE_UPDATE_ROWS = 2;

/** Shared layout — both panels align to the same height and scroll area */
const CRAFT_HEADER_HEIGHT = 52;
const SUBHEADER_HEIGHT = 36;
const SCROLL_VIEWPORT_HEIGHT = 416;
const CAMPUS_PANEL_HEIGHT = CRAFT_HEADER_HEIGHT + SUBHEADER_HEIGHT + SCROLL_VIEWPORT_HEIGHT;

const EXAM_VIEWPORT_HEIGHT = SCROLL_VIEWPORT_HEIGHT;
const UPDATE_VIEWPORT_HEIGHT = SCROLL_VIEWPORT_HEIGHT;

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
  const contentHeight = items.length * ROW_HEIGHT_PX;
  const needsScroll = contentHeight > EXAM_VIEWPORT_HEIGHT;
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
    <div
      className="campus-craft-panel campus-craft-panel--sky flex h-full w-full flex-col overflow-hidden"
      style={{ height: CAMPUS_PANEL_HEIGHT, maxHeight: CAMPUS_PANEL_HEIGHT }}
    >
      <div
        className="campus-craft-header campus-craft-header--sky flex shrink-0 items-center gap-2"
        style={{ minHeight: CRAFT_HEADER_HEIGHT }}
      >
        <Pin className="h-4 w-4 shrink-0 rotate-45 text-white/85" aria-hidden />
        <h3 className="campus-craft-header-title">Examination Corner</h3>
      </div>

      <div
        className="campus-craft-col-head campus-craft-col-head--sky relative z-[3] grid shrink-0 grid-cols-[72px_1fr_24px]"
        style={{ minHeight: SUBHEADER_HEIGHT }}
      >
        <span>Date</span>
        <span>Notice</span>
        <span className="sr-only">Link</span>
      </div>

      {items.length === 0 ? (
        <div
          className="relative z-[3] flex items-center justify-center px-4 text-center text-sm font-medium text-slate-500"
          style={{ height: EXAM_VIEWPORT_HEIGHT, maxHeight: EXAM_VIEWPORT_HEIGHT }}
        >
          {emptyMessage}
        </div>
      ) : (
        <CampusAutoScrollViewport
          height={EXAM_VIEWPORT_HEIGHT}
          loop={needsScroll}
          duration={scrollDuration}
        >
          <table
            className="w-full border-collapse text-left font-notice"
            style={{ height: items.length * ROW_HEIGHT_PX }}
          >
            {tableBody('a')}
          </table>
          {needsScroll && (
            <table
              className="w-full border-collapse text-left font-notice"
              style={{ height: items.length * ROW_HEIGHT_PX }}
            >
              {tableBody('b')}
            </table>
          )}
        </CampusAutoScrollViewport>
      )}
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
  const contentHeight = getGridContentHeight(items.length);
  const needsScroll = contentHeight > UPDATE_VIEWPORT_HEIGHT;
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
        className="relative z-[3] flex items-center justify-center border-2 border-dashed border-[#1a3a2a]/20 bg-[#fffef9] text-sm font-medium text-slate-500"
        style={{ height: UPDATE_VIEWPORT_HEIGHT, maxHeight: UPDATE_VIEWPORT_HEIGHT }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <CampusAutoScrollViewport
      height={UPDATE_VIEWPORT_HEIGHT}
      loop={needsScroll}
      duration={scrollDuration}
    >
      {grid('a')}
      {needsScroll && grid('b')}
    </CampusAutoScrollViewport>
  );
}

const NewsAnnouncementsSection = () => {
  const [news, setNews] = useState<News[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

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
      className="campus-updates-bg section-in-view relative overflow-hidden border-y border-rose-100/60 font-notice"
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
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-stretch">
            <div
              className="animate-pulse border-2 border-[#1a3a2a]/15 bg-white/70 lg:col-span-7"
              style={{ height: CAMPUS_PANEL_HEIGHT }}
            />
            <div
              className="animate-pulse border-2 border-[#1e3a5f]/15 bg-white/70 lg:col-span-5"
              style={{ height: CAMPUS_PANEL_HEIGHT }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="flex h-full lg:col-span-7">
              <div
                className="campus-craft-panel flex h-full flex-col overflow-hidden"
                style={{ height: CAMPUS_PANEL_HEIGHT, maxHeight: CAMPUS_PANEL_HEIGHT }}
              >
                <div
                  className="campus-craft-header flex shrink-0 items-center"
                  style={{ minHeight: CRAFT_HEADER_HEIGHT }}
                >
                  <h3 className="campus-craft-header-title">News &amp; Campus Highlights</h3>
                </div>
                <div
                  className="campus-craft-col-head relative z-[3] flex shrink-0 items-center px-3"
                  style={{ minHeight: SUBHEADER_HEIGHT }}
                >
                  <span>Latest updates</span>
                </div>
                <div className="relative z-[3] min-h-0 flex-1">
                  <LatestUpdatesGrid items={news} emptyMessage="No updates at the moment." />
                </div>
              </div>
            </div>

            <div className="flex h-full lg:col-span-5">
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
