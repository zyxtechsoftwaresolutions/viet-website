import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import { pagesAPI } from '@/lib/api';
import { imgUrl } from '@/lib/imageUtils';
import {
  DEFAULT_CAMPUS_LIFE_CONTENT,
  normalizeCampusLifeContent,
  highlightGridClass,
  type CampusLifeContent,
} from '@/lib/campusLifeContent';
import { resolveHeroMedia, heroHasVideo } from '@/lib/heroMedia';
import HeroMediaBackground from '@/components/HeroMediaBackground';

export default function CampusLife() {
  const [content, setContent] = useState<CampusLifeContent>(DEFAULT_CAMPUS_LIFE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    pagesAPI
      .getBySlug('campus-life')
      .then((page) => {
        if (cancelled) return;
        if (page?.content) {
          setContent(normalizeCampusLifeContent(page.content));
        }
      })
      .catch(() => {
        /* keep defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const photoSrc = (path: string) => {
    if (!path) return '/placeholder.svg';
    return imgUrl(path) || path;
  };

  const heroMedia = resolveHeroMedia(content.hero);
  const hasBackgroundMedia = heroHasVideo(heroMedia) || Boolean(heroMedia.imageUrl);

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/about" />

      <section className="relative min-h-[55vh] md:min-h-[90vh] pt-20 md:pt-28 pb-10 md:pb-16 flex items-center overflow-hidden">
        <HeroMediaBackground
          media={heroMedia}
          fallbackGradient="linear-gradient(160deg, #422006 0%, #713f12 35%, #a16207 70%, #ca8a04 100%)"
          imageOpacityClass="opacity-100"
        />
        {hasBackgroundMedia && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-black/50 from-0% via-black/20 via-[30%] to-transparent to-[55%]"
            aria-hidden
          />
        )}
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              {content.hero.badge}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
              {content.hero.title}
            </h1>
            <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
              {content.hero.description}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/80 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-amber-300"></div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#fafafa] border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.intro.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 leading-tight">
              {content.intro.title}{' '}
              <span className="text-amber-600">{content.intro.titleAccent}</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] [&_p]:mb-6 [&_p:last-child]:mb-0">
              {content.intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.highlightsLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 leading-tight">
              {content.highlightsTitle}
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />

            {loading && content.highlights.length === 0 ? (
              <div className="min-h-[200px] flex items-center justify-center text-slate-400">
                Loading photos…
              </div>
            ) : content.highlights.length === 0 ? (
              <p className="text-slate-500 text-center py-12">Campus photos coming soon.</p>
            ) : (
              <div className="grid grid-cols-12 gap-4 auto-rows-[280px] md:auto-rows-[300px]">
                {content.highlights.map((item) => {
                  const isLarge = item.size === 'large';
                  const isFull = item.size === 'full';
                  return (
                    <div
                      key={item.id}
                      className={`${highlightGridClass(item.size)} relative group overflow-hidden rounded-xl shadow-lg ${
                        isLarge ? 'shadow-xl' : ''
                      }`}
                    >
                      <img
                        src={photoSrc(item.image)}
                        alt={item.alt || item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      {isLarge || isFull ? (
                        <div
                          className={`absolute inset-0 ${
                            isFull
                              ? 'bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent flex items-center p-8 md:p-10'
                              : 'bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent opacity-70'
                          }`}
                        >
                          {isFull ? (
                            <div className="max-w-xl">
                              <div className="w-12 h-1 bg-amber-400 mb-4"></div>
                              <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-zinc-100 text-[1.0625rem] md:text-lg leading-[1.85]">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="absolute bottom-0 left-0 p-8 md:p-10">
                              <div className="w-12 h-1 bg-amber-400 mb-4"></div>
                              <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="text-zinc-100 text-base md:text-lg max-w-2xl leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-zinc-900/60 flex items-end p-6">
                          <div>
                            <div className="w-8 h-1 bg-amber-400 mb-3"></div>
                            <h4 className="text-xl md:text-2xl font-bold text-white">{item.title}</h4>
                            {item.description && (
                              <p className="text-zinc-100 text-sm mt-2 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.statsLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 leading-tight">
              {content.statsTitle} <span className="text-amber-600">{content.statsTitleAccent}</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {content.stats.map((stat, i) => (
                <div key={i} className="flex-shrink-0 w-56 md:w-64 snap-start">
                  <div className="relative group bg-white p-6 shadow-lg border border-slate-200 group-hover:border-amber-400 transition-colors rounded-xl">
                    <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">{stat.number}</div>
                    <div className="text-slate-600 font-semibold tracking-wide uppercase text-xs">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.featuresLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 leading-tight">
              {content.featuresTitle}{' '}
              <span className="text-amber-600">{content.featuresTitleAccent}</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group p-6 md:p-8 rounded-xl border-2 border-slate-200 group-hover:border-amber-400 bg-white group-hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-[1.0625rem] leading-[1.85]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-amber-50/70 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute top-0 left-0 text-[150px] md:text-[200px] font-black text-amber-400/20 leading-none">
              "
            </div>
            <div className="relative pl-12 md:pl-24 pt-12 md:pt-20">
              <p className="text-xl md:text-3xl lg:text-4xl font-light text-slate-800 leading-relaxed mb-8 italic">
                {content.testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-1 bg-amber-500"></div>
                <div>
                  <div className="text-slate-900 font-bold text-lg">{content.testimonial.name}</div>
                  <div className="text-slate-600 text-sm">{content.testimonial.role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.facilitiesLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-10 leading-tight">
              {content.facilitiesTitle}{' '}
              <span className="text-amber-600">{content.facilitiesTitleAccent}</span>
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {content.facilities.map((facility, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 md:w-72 snap-start group relative bg-white border-2 border-slate-200 hover:border-amber-400 p-6 transition-all hover:shadow-xl rounded-xl"
                >
                  <div className="text-4xl md:text-5xl mb-4">{facility.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">{facility.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{facility.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.eventsLabel}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4 leading-tight">
              {content.eventsTitle}
            </h2>
            <p className="text-slate-600 text-[1.0625rem] md:text-lg">{content.eventsSubtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {content.events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative bg-gradient-to-br ${event.gradient} p-8 md:p-10 rounded-xl border-2 border-slate-200 shadow-xl`}
              >
                <div className="text-white font-bold text-sm tracking-widest mb-2 opacity-90">
                  {event.subtitle}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h3>
                <p className="text-white/90 text-[1.0625rem] leading-[1.85]">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-500 p-12 md:p-16 text-center overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                {content.cta.titleLine1}
                <br />
                <span className="text-white">{content.cta.titleLine2}</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-800 mb-10 max-w-2xl mx-auto text-[1.0625rem] md:text-lg leading-[1.85]">
                {content.cta.description}
              </p>
              <a
                href={content.cta.buttonHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 md:px-10 py-4 md:py-5 hover:bg-slate-100 transition-all rounded-full shadow-xl hover:shadow-2xl"
              >
                <span className="text-base md:text-lg">{content.cta.buttonText}</span>
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
