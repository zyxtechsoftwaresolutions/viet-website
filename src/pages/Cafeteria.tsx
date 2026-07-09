import React from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import FacilityWaveHero from "@/components/FacilityWaveHero";
import { useFacilityCms } from "@/hooks/useFacilityCms";

const Cafeteria = () => {
  const { hero, content } = useFacilityCms("cafeteria");

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref="/" />

      <FacilityWaveHero
        badge={hero.badge}
        title={hero.title}
        description={hero.description}
        heroImage={hero.heroImage}
        video={hero.video}
        gradient={hero.gradient}
        waveFill={hero.waveFill}
        showDotPattern={hero.showDotPattern}
        align={hero.align}
      />

      {/* About Cafeteria */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            className="max-w-3xl text-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">{content.about.label}</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">
              {content.about.title}
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            {content.about.paragraphs.map((paragraph, i) => (
              <p key={i} className={`text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed${i < content.about.paragraphs.length - 1 ? " mb-6" : ""}`}>
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cafeteria gallery — one viewport height, scales with window size */}
      <section
        id="gallery"
        className="min-h-screen bg-slate-100 border-t border-slate-200 scroll-mt-24 flex flex-col"
        style={{ minHeight: "100vh" }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col flex-1 min-h-0 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="shrink-0 pt-6 pb-3 md:pt-8 md:pb-4 flex flex-wrap items-end justify-between gap-2 text-left"
          >
            <div>
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-0.5">Gallery</p>
              <h2 className="text-base md:text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight">Our dining space</h2>
            </div>
            <p className="text-slate-600 text-xs md:text-sm max-w-sm">
              Dining area, food counters, and where students and staff enjoy their meals.
            </p>
          </motion.div>
          <div className="flex-1 min-h-0 w-full grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 lg:gap-3 grid-rows-6 md:grid-rows-[1fr_1fr_1fr_0.5fr] pb-6 md:pb-8">
            {content.gallery.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.25) }}
                className={`group relative overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-slate-200 hover:shadow-md transition-shadow min-h-0 h-full
                  ${item.large ? "md:row-span-2" : item.wide ? "md:col-span-2" : ""}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2 lg:p-2.5 text-white text-left">
                  <h3 className="text-[10px] md:text-xs lg:text-sm font-bold drop-shadow-md truncate">{item.title}</h3>
                  {item.caption && <p className="text-white/90 text-[9px] md:text-[10px] lg:text-xs truncate">{item.caption}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Hygienic, Variety, Seating */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Why our cafeteria</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">What we offer</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {content.features.map((fac, i) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-10 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fac.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{fac.title}</h3>
                <p className="text-slate-600 text-[1.0625rem] leading-relaxed">{fac.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-left flex flex-col md:flex-row md:items-center md:gap-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mb-4 md:mb-0">
              <UtensilsCrossed className="w-8 h-8" aria-hidden />
            </div>
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">{content.contact.label}</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">{content.contact.title}</h2>
              <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
              <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-6">
                {content.contact.description}
              </p>
              <a href={content.contact.ctaHref} className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">
                {content.contact.ctaText}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cafeteria;
