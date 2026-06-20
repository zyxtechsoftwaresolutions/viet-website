import { useState, useEffect } from 'react';
import { ChevronRight, Pin } from 'lucide-react';
import { announcementsAPI, newsAPI } from '@/lib/api';

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
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const ROW_HEIGHT_PX = 52;
const VISIBLE_ROWS = 6;
const SCROLL_CONTAINER_HEIGHT = ROW_HEIGHT_PX * VISIBLE_ROWS;

const typeBadgeClass = (type: string) => {
  if (type === 'result') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (type === 'notification') return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

interface NoticeBoardProps {
  title: string;
  accentColor: 'green' | 'sky';
  showType?: boolean;
  items: Array<{
    id: number;
    date: string;
    title: string;
    link?: string;
    isExternal?: boolean;
    description?: string;
    type?: string;
  }>;
  emptyMessage: string;
}

function NoticeBoard({ title, accentColor, showType = false, items, emptyMessage }: NoticeBoardProps) {
  const headerBg = accentColor === 'green' ? 'bg-emerald-700' : 'bg-sky-700';
  const boardBg = accentColor === 'green' ? 'bg-[#f5f0e6]' : 'bg-[#eef4f8]';
  const rowBorder = accentColor === 'green' ? 'border-emerald-200/60' : 'border-sky-200/60';
  const rowHover = accentColor === 'green' ? 'hover:bg-emerald-50/80' : 'hover:bg-sky-50/80';
  const pinColor = accentColor === 'green' ? 'text-emerald-600' : 'text-sky-600';

  const needsScroll = items.length > VISIBLE_ROWS;
  const scrollDuration = Math.max(25, (items.length / VISIBLE_ROWS) * 8);

  const renderRow = (item: NoticeBoardProps['items'][0], copyKey: string) => {
    const hasLink = item.link && item.link.trim() !== '' && item.link !== '#';
    const isExternal = hasLink && /^https?:\/\//i.test(item.link!);

    return (
      <tr
        key={`${copyKey}-${item.id}`}
        className={`border-b ${rowBorder} ${rowHover} transition-colors duration-200`}
        style={{ height: ROW_HEIGHT_PX }}
      >
        <td className="px-3 sm:px-4 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap w-[80px] sm:w-[105px] align-middle">
          {formatDate(item.date)}
        </td>
        <td className="px-2 sm:px-3 py-2.5 align-middle">
          <div className="flex items-start gap-2">
            <Pin className={`w-3 h-3 mt-1 shrink-0 ${pinColor} opacity-70`} aria-hidden />
            <div className="min-w-0 flex-1">
              {hasLink ? (
                <a
                  href={item.link}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="font-semibold text-slate-800 hover:text-[#0a192f] line-clamp-2 transition-colors text-xs sm:text-sm leading-snug"
                >
                  {item.title}
                </a>
              ) : (
                <span className="font-semibold text-slate-800 line-clamp-2 text-xs sm:text-sm leading-snug">
                  {item.title}
                </span>
              )}
              {item.description && (
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 hidden sm:block">{item.description}</p>
              )}
            </div>
          </div>
        </td>
        {item.type && showType && (
          <td className="px-2 sm:px-3 py-2.5 w-[72px] sm:w-[90px] hidden sm:table-cell align-middle">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${typeBadgeClass(item.type)}`}>
              {item.type}
            </span>
          </td>
        )}
        <td className="px-2 py-2.5 w-8 align-middle">
          {hasLink ? (
            <a
              href={item.link}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Read more"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          ) : (
            <span className="inline-flex text-slate-300" aria-hidden><ChevronRight className="w-4 h-4" /></span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className={`rounded-2xl overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-white/60 ${boardBg}`}>
      {/* Board header */}
      <div className={`${headerBg} px-5 py-3.5 flex items-center gap-2 shrink-0`}>
        <Pin className="w-4 h-4 text-white/80 rotate-45" aria-hidden />
        <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h3>
      </div>

      {/* Column headers */}
      <div className={`grid gap-0 px-3 sm:px-4 py-2 bg-white/60 border-b border-black/5 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 ${showType ? 'grid-cols-[80px_1fr_32px] sm:grid-cols-[105px_1fr_90px_32px]' : 'grid-cols-[80px_1fr_32px] sm:grid-cols-[105px_1fr_32px]'}`}>
        <span>Date</span>
        <span>Notice</span>
        {showType && <span className="hidden sm:block">Type</span>}
        <span className="sr-only">Link</span>
      </div>

      {/* Scrollable notice list */}
      <div
        className="overflow-hidden relative"
        style={{ height: SCROLL_CONTAINER_HEIGHT }}
      >
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
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
              <table key={copy} className="w-full text-left border-collapse font-notice" style={{ height: items.length * ROW_HEIGHT_PX }}>
                <tbody>
                  {items.map((item) => renderRow(item, String(copy)))}
                </tbody>
              </table>
            ))}
          </div>
        ) : (
          <div className="notice-board-scroll h-full">
            <table className="w-full text-left border-collapse font-notice">
              <tbody>
                {items.map((item) => renderRow(item, '1'))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
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
    <section className="glossy-green-texture relative overflow-hidden border-y border-emerald-200/50 font-notice">
      <div className="container relative z-10 mx-auto px-4 md:px-10 lg:px-12 py-12 md:py-16">
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0a192f] tracking-tight">
            News &amp; Announcements
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
            Latest updates from the campus notice board
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-2xl bg-white/80 border border-slate-200 animate-pulse" style={{ height: SCROLL_CONTAINER_HEIGHT + 80 }} />
            <div className="rounded-2xl bg-white/80 border border-slate-200 animate-pulse" style={{ height: SCROLL_CONTAINER_HEIGHT + 80 }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <NoticeBoard
              title="News"
              accentColor="green"
              items={news.map((n) => ({
                id: n.id,
                date: n.date,
                title: n.title,
                link: n.link,
                description: n.description ? n.description.slice(0, 60) : undefined,
              }))}
              emptyMessage="No news at the moment."
            />
            <NoticeBoard
              title="Announcements"
              accentColor="sky"
              showType
              items={announcements.map((a) => ({
                id: a.id,
                date: a.date,
                title: a.title,
                link: a.link,
                isExternal: a.isExternal,
                type: a.type,
              }))}
              emptyMessage="No announcements at the moment."
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsAnnouncementsSection;
