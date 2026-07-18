import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import { pagesAPI } from '@/lib/api';
import {
  DEFAULT_IQAC_CONTENT,
  normalizeIqacContent,
  type IqacContent,
} from '@/lib/iqacContent';
import { ChevronDown, Download, Mail } from 'lucide-react';

const TABS = [
  { id: 'documents', label: 'Documents' },
  { id: 'committee', label: 'Committee' },
  { id: 'about', label: 'About' },
];

const IQAC = () => {
  const [content, setContent] = useState<IqacContent>(DEFAULT_IQAC_CONTENT);
  const [activeTab, setActiveTab] = useState('documents');
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await pagesAPI.getBySlug('iqac');
        if (!cancelled && page?.content) {
          setContent(normalizeIqacContent(page.content));
        }
      } catch {
        // keep defaults — page still renders
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setOpenCategory((prev) => prev ?? content.documents[0]?.category ?? null);
  }, [content]);

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      <LeaderPageNavbar backHref="/" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-14 md:pt-36 md:pb-16">
        {/* Faint watermark text */}
        <div
          className="pointer-events-none select-none absolute -right-5 -bottom-8 text-[160px] font-black leading-none tracking-[-6px] text-white/[0.03]"
          aria-hidden
        >
          IQAC
        </div>

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
              {content.hero.titleLight} <span className="font-bold">{content.hero.titleBold}</span>
            </h1>

            <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed mb-11">
              {content.hero.subtitle}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap">
              {content.hero.stats.map((s, i) => (
                <div
                  key={i}
                  className={`pr-8 mr-8 mb-3 ${
                    i < content.hero.stats.length - 1 ? 'border-r border-white/10' : 'border-r-0'
                  }`}
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary leading-none">{s.val}</div>
                  <div className="text-[11px] md:text-xs text-white/50 mt-1.5 tracking-wide">{s.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12 flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 text-center px-5 pt-4 pb-3.5 text-sm md:text-[0.95rem] transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'font-semibold text-slate-900 border-primary bg-slate-50/70'
                  : 'font-normal text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 md:px-10 lg:px-12 pt-11 pb-20">
        {/* ===== DOCUMENTS ===== */}
        {activeTab === 'documents' && (
          <div>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">{content.documentsIntro}</p>

            <div className="flex flex-col gap-2">
              {content.documents.map((grp) => {
                const isOpen = openCategory === grp.category;
                return (
                  <div
                    key={grp.category}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                  >
                    {/* ── Header row ── */}
                    <button
                      onClick={() => setOpenCategory(isOpen ? null : grp.category)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                        isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      {/* Category tag badge */}
                      <div
                        className={`min-w-[44px] h-9 px-1.5 rounded flex items-center justify-center text-[10px] font-bold tracking-wider flex-shrink-0 transition-colors ${
                          isOpen ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {grp.tag}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm md:text-[0.95rem] font-semibold text-slate-900">
                          {grp.category}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {grp.label} &nbsp;·&nbsp; {grp.items.length} files
                        </div>
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* ── File rows ── */}
                    {isOpen && (
                      <div className="border-t border-slate-100">
                        {grp.items.map((item, idx) => {
                          const hasFile = Boolean(item.fileUrl);
                          return (
                            <div
                              key={idx}
                              className={`group flex items-center gap-3.5 py-3 pr-5 pl-5 md:pl-[82px] hover:bg-slate-50 transition-colors ${
                                idx < grp.items.length - 1 ? 'border-b border-slate-100' : ''
                              }`}
                            >
                              {/* File type marker */}
                              <span className="text-[10px] font-bold tracking-wide text-red-500 min-w-[28px] select-none">
                                PDF
                              </span>

                              {/* Title */}
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-slate-800">{item.title}</span>
                                {item.latest && (
                                  <span className="ml-2 align-middle text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-px rounded tracking-wide">
                                    NEW
                                  </span>
                                )}
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {item.year}
                                  {item.size ? <>&nbsp;·&nbsp;{item.size}</> : null}
                                </div>
                              </div>

                              {/* Download */}
                              <a
                                href={hasFile ? item.fileUrl : '#'}
                                target={hasFile ? '_blank' : undefined}
                                rel={hasFile ? 'noopener noreferrer' : undefined}
                                onClick={(e) => {
                                  if (!hasFile) e.preventDefault();
                                }}
                                title={hasFile ? 'Download PDF' : 'File will be available soon'}
                                className={`flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 transition-colors ${
                                  hasFile
                                    ? 'text-slate-400 group-hover:text-primary cursor-pointer'
                                    : 'text-slate-300 cursor-default'
                                }`}
                              >
                                <Download className="h-3.5 w-3.5" />
                                {hasFile ? 'Download' : 'Soon'}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact notice */}
            <div className="mt-8 px-5 py-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed">
              For document queries or physical copies, write to{' '}
              <a
                href={`mailto:${content.contactNotice.email}`}
                className="text-primary font-semibold hover:underline"
              >
                {content.contactNotice.email}
              </a>{' '}
              or visit {content.contactNotice.location}.
            </div>
          </div>
        )}

        {/* ===== COMMITTEE ===== */}
        {activeTab === 'committee' && (
          <div>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">{content.committeeIntro}</p>

            <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(290px,1fr))]">
              {content.committee.map((m, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-lg px-5 py-5 flex gap-4 items-start transition-shadow hover:shadow-lg hover:shadow-slate-200/60"
                >
                  {/* Initials avatar */}
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-[13px] font-bold text-primary flex-shrink-0 tracking-wide">
                    {m.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 mb-0.5">{m.name}</div>
                    <div className="text-xs text-primary font-medium mb-1">{m.role}</div>
                    <div className="text-xs text-slate-400">{m.dept}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ABOUT ===== */}
        {activeTab === 'about' && (
          <div className="grid gap-12 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
                {content.about.heading}
              </h2>
              {content.about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-sm md:text-[0.9rem] text-slate-600 leading-[1.85] ${
                    i === content.about.paragraphs.length - 1 ? 'mb-7' : 'mb-4'
                  }`}
                >
                  {p}
                </p>
              ))}

              <p className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-3.5">
                Core Functions
              </p>
              <div className="flex flex-col gap-2.5">
                {content.about.coreFunctions.map((fn, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-[13px] text-primary font-semibold min-w-[20px] pt-px">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-slate-600 leading-relaxed">{fn}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-3.5">
                Contact
              </p>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4">
                {[
                  { label: 'Address', val: content.about.contact.address },
                  { label: 'Phone', val: content.about.contact.phone },
                  { label: 'Email', val: content.about.contact.email },
                  { label: 'Office Hours', val: content.about.contact.hours },
                ]
                  .filter((row) => row.val)
                  .map((row, i, arr) => (
                    <div
                      key={row.label}
                      className={`flex gap-4 px-5 py-3.5 ${
                        i < arr.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <div className="text-[11px] font-bold text-slate-400 tracking-wide uppercase min-w-[90px] pt-0.5">
                        {row.label}
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {row.label === 'Email' ? (
                          <a
                            href={`mailto:${row.val}`}
                            className="text-primary font-semibold hover:underline"
                          >
                            {row.val}
                          </a>
                        ) : (
                          row.val
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="bg-slate-900 rounded-lg px-5 py-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1.5">
                  <Mail className="h-4 w-4" />
                  Have a quality-related suggestion?
                </div>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  Students, faculty, and stakeholders can write to the IQAC with suggestions for
                  improving institutional quality. Every input is reviewed in the cell's periodic
                  meetings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default IQAC;
