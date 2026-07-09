import React from "react";
import { motion } from "framer-motion";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import FacilityWaveHero from "@/components/FacilityWaveHero";
import { useFacilityCms } from "@/hooks/useFacilityCms";

const STAT_STYLES = [
  { bg: "from-indigo-50 to-indigo-100", text: "text-indigo-700" },
  { bg: "from-blue-50 to-blue-100", text: "text-blue-700" },
  { bg: "from-slate-50 to-slate-100", text: "text-slate-700" },
  { bg: "from-indigo-50 to-slate-100", text: "text-slate-700" },
];

const NSSPage = () => {
  const { hero, content } = useFacilityCms("nss");

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

      {/* About NSS — Chairman spacing, left-aligned */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center text-left">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">{content.about.label}</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight">
                {content.about.title}
              </h2>
              <div className="h-px w-16 bg-indigo-400" aria-hidden />
              {content.about.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </motion.div>
            <div className="grid grid-cols-2 gap-4 text-left">
              {content.stats.map((stat, i) => {
                const style = STAT_STYLES[i % STAT_STYLES.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-gradient-to-br ${style.bg} p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all`}
                  >
                    <div className={`text-2xl md:text-3xl font-bold ${style.text}`}>{stat.value}</div>
                    <div className="text-slate-600 font-medium text-sm mt-1">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* NSS Objectives — site theme */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">Objectives</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">NSS Objectives</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {content.objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center flex-shrink-0 w-36 group cursor-default"
              >
                <div className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d={obj.icon} /></svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {obj.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Activities */}
      <section id="activities" className="py-20 md:py-28 bg-white border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">What we do</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">Key Activities</h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {content.activities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center flex-shrink-0 w-36 group cursor-default"
              >
                <div className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d={act.icon} /></svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {act.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Special Camp — site theme gradient */}
      <section className="py-20 md:py-28 relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #312e81 0%, #1e3a8a 50%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, transparent 48%, white 49%, white 51%, transparent 52%)", backgroundSize: "20px 20px" }} aria-hidden />
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-left">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{content.specialCamp.title}</h2>
            <div className="h-px w-16 bg-white/50 rounded-full mb-6" aria-hidden />
            <p className="text-lg text-indigo-100 leading-relaxed mb-8">
              {content.specialCamp.description}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {content.specialCamp.stats.map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <div className="text-2xl md:text-3xl font-bold">{item.value}</div>
                  <div className="text-indigo-100 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join NSS — Chairman spacing */}
      <section id="join" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-24">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">{content.getInvolved.label}</p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">{content.getInvolved.title}</h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-10">
              {content.getInvolved.description}
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-8 rounded-2xl border-l-4 border-indigo-600 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Eligibility</h3>
                <ul className="text-slate-600 space-y-2 text-left">
                  {content.getInvolved.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl border-l-4 border-blue-600 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Benefits</h3>
                <ul className="text-slate-600 space-y-2 text-left">
                  {content.getInvolved.benefits.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <a
              href={content.getInvolved.ctaHref}
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              {content.getInvolved.ctaText}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact — site theme */}
      <section className="py-20 md:py-28 bg-slate-900 text-white border-t border-slate-700">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {content.contact.columns.map((col, i) => (
              <div key={i}>
                <h3 className="text-lg font-bold mb-3 text-indigo-300">{col.title}</h3>
                {col.lines.map((line, j) => (
                  <p key={j} className={j === 0 ? "text-slate-300" : "text-slate-400"}>{line}</p>
                ))}
                {col.email && (
                  <a href={`mailto:${col.email}`} className="text-slate-400 hover:text-white">{col.email}</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NSSPage;
