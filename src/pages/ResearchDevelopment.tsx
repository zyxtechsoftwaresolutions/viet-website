import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutList } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import RDynamicContent from '@/components/RD/RDynamicContent';
import { pagesAPI } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_RD_CONTENT, RD_SECTIONS, normalizeRdContent } from '@/lib/rdContent';
import { cn } from '@/lib/utils';

const ResearchDevelopment = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [content, setContent] = useState(DEFAULT_RD_CONTENT);
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activeMeta = RD_SECTIONS.find((s) => s.id === activeSection) ?? RD_SECTIONS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && RD_SECTIONS.some((s) => s.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await pagesAPI.getBySlug('research-development');
        if (!cancelled) setContent(normalizeRdContent(page?.content));
      } catch {
        if (!cancelled) setContent(DEFAULT_RD_CONTENT);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const switchSection = (sectionId: string) => {
    setActiveSection(sectionId);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      <LeaderPageNavbar backHref="/" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-14 md:pt-36 md:pb-16">
        <div
          className="pointer-events-none select-none absolute -right-5 -bottom-8 text-[140px] md:text-[160px] font-black leading-none tracking-[-6px] text-white/[0.03]"
          aria-hidden
        >
          R&D
        </div>

        {/* Subtle animated gradient orb */}
        <motion.div
          className="pointer-events-none absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-5">
              {content.hero.badge}
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight mb-3">
              {content.hero.titleLight}{' '}
              <span className="font-bold">{content.hero.titleBold}</span>
            </h1>

            <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed mb-11">
              {content.hero.subtitle}
            </p>

            <div className="flex flex-wrap">
              {content.hero.stats.map((s, i) => (
                <motion.div
                  key={s.desc}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`pr-8 mr-8 mb-3 ${
                    i < content.hero.stats.length - 1 ? 'border-r border-white/10' : 'border-r-0'
                  }`}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary leading-none">{s.val}</div>
                  <div className="text-[11px] md:text-xs text-white/50 mt-1.5 tracking-wide">{s.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT + SIDEBAR NAV ── */}
      <div className="container mx-auto px-4 md:px-10 lg:px-12 py-11 md:py-14 pb-20">
        {/* Mobile / tablet: section picker (no horizontal bar) */}
        <div className="lg:hidden mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3">
            Jump to section
          </p>
          <Select value={activeSection} onValueChange={switchSection}>
            <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-white shadow-sm text-left">
              <div className="flex items-center gap-2 min-w-0">
                <LayoutList className="w-4 h-4 text-primary shrink-0" aria-hidden />
                <SelectValue placeholder="Choose a section">{activeMeta.title}</SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[min(70vh,420px)]">
              {RD_SECTIONS.map(({ id, title, icon: Icon }) => (
                <SelectItem key={id} value={id} className="py-2.5">
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
                    {title}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12">
          {/* Desktop: sticky vertical nav */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  Sections
                </p>
              </div>
              <nav
                className="p-2 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin"
                aria-label="Research & Development sections"
              >
                {RD_SECTIONS.map(({ id, title, icon: Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => switchSection(id)}
                      className={cn(
                        'w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all mb-0.5',
                        isActive
                          ? 'bg-primary/10 text-slate-900 font-semibold shadow-sm ring-1 ring-primary/15'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        <Icon className="w-4 h-4" aria-hidden />
                      </span>
                      <span className="leading-snug pt-1">{title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0" ref={contentRef}>
            <AnimatePresence mode="wait">
              <RDynamicContent key={activeSection} activeSection={activeSection} content={content} />
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResearchDevelopment;
