import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import FacilityWaveHero from "@/components/FacilityWaveHero";
import { useFacilityCms } from "@/hooks/useFacilityCms";

const Sports = () => {
  const { hero, content } = useFacilityCms("sports");

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

      {/* About Sports — Chairman spacing, left-aligned */}
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

      {/* A glimpse into VIET sports — LPU-style image grid */}
      <section className="py-20 md:py-28 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Gallery</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">A glimpse into VIET sports</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 max-w-2xl">
              Highlights from our sports facilities, events, and campus activities.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {content.gallery.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.35) }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-slate-200 aspect-[4/3] hover:shadow-xl transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white text-left">
                  <h3 className="text-base md:text-lg font-bold drop-shadow-md">{item.title}</h3>
                  {item.caption && <p className="text-white/90 text-sm mt-0.5">{item.caption}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Hall of Fame — LPU-style achievers */}
      <section id="hall-of-fame" className="py-20 md:py-28 bg-white border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Achievers</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Hall of Fame</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 max-w-2xl">
              From local triumphs to zonal and state-level victories, our students and teams redefine success on and off the field.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {content.hallOfFame.map((entry, i) => (
              <motion.article
                key={`${entry.name}-${entry.sport}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.3) }}
                className="group bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Trophy className="w-7 h-7" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{entry.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-2">{entry.achievement}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {entry.sport}
                  </span>
                  {entry.year && (
                    <span className="text-xs text-slate-500">{entry.year}</span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Sports we offer — grid */}
      <section id="sports-offered" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">What we offer</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Sports we offer</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
            <p className="text-slate-600 max-w-2xl">
              Indoor and outdoor games for all students. Practice and compete in a supportive environment.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-left">
            {content.sportsOffered.map((sport, i) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${sport.category === "Indoor" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}`}>
                  {sport.category}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{sport.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities — Indoor sports room + PT */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Facilities</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Our sports facilities</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {content.facilities.map((fac, i) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-10 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
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
            className="max-w-2xl text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">{content.contact.label}</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">{content.contact.title}</h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-8">
              {content.contact.description}
            </p>
            <div className="flex flex-wrap gap-4">
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

export default Sports;
