import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
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

const ROW_HEIGHT_PX = 48;
const VISIBLE_ROWS = 6;
const SCROLL_CONTAINER_HEIGHT = ROW_HEIGHT_PX * VISIBLE_ROWS; // 288px
const SCROLL_DURATION_BASE = 25; // seconds for one full cycle when we have many items

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
    <>
      <style>{`
        @keyframes news-announce-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        .news-announce-anim {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          contain: layout paint;
        }
      `}</style>
      <section className="glossy-green-texture relative overflow-hidden border-y border-emerald-200/50">
        <div className="container relative z-10 mx-auto px-4 md:px-10 lg:px-12 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight px-3 py-1 rounded-lg bg-white/70 backdrop-blur-sm"
              style={{ fontFamily: "'Libre Baskerville', 'Cinzel', Georgia, serif", letterSpacing: '0.08em' }}
            >
              News & Announcements
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl bg-white border border-slate-200 h-[288px] animate-pulse" />
              <div className="rounded-xl bg-white border border-slate-200 h-[288px] animate-pulse" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* News table */}
              <div className="rounded-xl overflow-hidden flex flex-col bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="px-5 py-3.5 shrink-0 bg-green-100 border-b border-green-200/80">
                  <h3 className="text-base font-semibold text-slate-800 pl-3 border-l-4 border-green-600" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                    News
                  </h3>
                </div>
                <div className="overflow-hidden bg-green-50" style={{ height: SCROLL_CONTAINER_HEIGHT, scrollbarWidth: 'none' }}>
                  <style>{`.news-scroll-wrap::-webkit-scrollbar { display: none; }`}</style>
                  <div
                    className="news-scroll-wrap news-announce-anim bg-green-50"
                    style={{
                      height: news.length > VISIBLE_ROWS ? 2 * news.length * ROW_HEIGHT_PX : news.length * ROW_HEIGHT_PX,
                      animation: news.length > VISIBLE_ROWS
                        ? `news-announce-scroll ${Math.max(SCROLL_DURATION_BASE, (news.length / VISIBLE_ROWS) * 8)}s linear infinite`
                        : 'none',
                    }}
                  >
                    {news.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium bg-green-50">No news at the moment.</div>
                    ) : (
                      <>
                        {(news.length > VISIBLE_ROWS ? [1, 2] : [1]).map((copy) => (
                          <table key={copy} className="w-full text-left border-collapse" style={{ height: news.length * ROW_HEIGHT_PX }}>
                            <tbody>
                              {news.map((item) => {
                                const hasLink = item.link && item.link.trim() !== '';
                                const isExternal = hasLink && /^https?:\/\//i.test(item.link!);
                                return (
                                <tr key={`${copy}-${item.id}`} className="border-b border-green-100 hover:bg-green-100/80 transition-colors" style={{ height: ROW_HEIGHT_PX }}>
                                  <td className="px-4 py-2 text-xs text-slate-500 whitespace-nowrap w-[100px]">{formatDate(item.date)}</td>
                                  <td className="px-4 py-2">
                                    {hasLink ? (
                                      <a
                                        href={item.link}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                        className="font-medium text-slate-800 hover:text-[#0a192f] line-clamp-2 transition-colors text-sm"
                                      >
                                        {item.title}
                                      </a>
                                    ) : (
                                      <span className="font-medium text-slate-800 line-clamp-2 text-sm">
                                        {item.title}
                                      </span>
                                    )}
                                    {item.description && (
                                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description.slice(0, 50)}…</p>
                                    )}
                                  </td>
                                  <td className="px-2 py-2 w-8">
                                    {hasLink ? (
                                      <a
                                        href={item.link}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                        className="inline-flex text-slate-400 hover:text-slate-700"
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
                              })}
                            </tbody>
                          </table>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Announcements table */}
              <div className="rounded-xl overflow-hidden flex flex-col bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="px-5 py-3.5 shrink-0 bg-sky-100 border-b border-sky-200/80">
                  <h3 className="text-base font-semibold text-slate-800 pl-3 border-l-4 border-sky-600" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                    Announcements
                  </h3>
                </div>
                <div className="overflow-hidden bg-sky-50" style={{ height: SCROLL_CONTAINER_HEIGHT, scrollbarWidth: 'none' }}>
                  <style>{`.ann-scroll-wrap::-webkit-scrollbar { display: none; }`}</style>
                  <div
                    className="ann-scroll-wrap news-announce-anim bg-sky-50"
                    style={{
                      height: announcements.length > VISIBLE_ROWS ? 2 * announcements.length * ROW_HEIGHT_PX : announcements.length * ROW_HEIGHT_PX,
                      animation: announcements.length > VISIBLE_ROWS
                        ? `news-announce-scroll ${Math.max(SCROLL_DURATION_BASE, (announcements.length / VISIBLE_ROWS) * 8)}s linear infinite`
                        : 'none',
                    }}
                  >
                    {announcements.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium bg-sky-50">No announcements at the moment.</div>
                    ) : (
                      <>
                        {(announcements.length > VISIBLE_ROWS ? [1, 2] : [1]).map((copy) => (
                          <table key={copy} className="w-full text-left border-collapse" style={{ height: announcements.length * ROW_HEIGHT_PX }}>
                            <tbody>
                              {announcements.map((item) => (
                                <tr key={`${copy}-${item.id}`} className="border-b border-sky-100 hover:bg-sky-100/80 transition-colors" style={{ height: ROW_HEIGHT_PX }}>
                                  <td className="px-4 py-2 text-xs text-slate-500 whitespace-nowrap w-[100px]">{formatDate(item.date)}</td>
                                  <td className="px-4 py-2">
                                    <a
                                      href={item.link || '#'}
                                      target={item.isExternal ? '_blank' : undefined}
                                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                                      className="font-medium text-slate-800 hover:text-[#0a192f] line-clamp-2 transition-colors text-sm"
                                    >
                                      {item.title}
                                    </a>
                                  </td>
                                  <td className="px-4 py-2 w-[90px]">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                        item.type === 'result' ? 'bg-green-50 text-green-700' : item.type === 'notification' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {item.type}
                                    </span>
                                  </td>
                                  <td className="px-2 py-2 w-8">
                                    <a
                                      href={item.link || '#'}
                                      target={item.isExternal ? '_blank' : undefined}
                                      rel={item.isExternal ? 'noopener noreferrer' : undefined}
                                      className="inline-flex text-slate-400 hover:text-slate-700"
                                      aria-label="Open link"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsAnnouncementsSection;
