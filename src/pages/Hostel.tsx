import React from "react";
import { Link } from "react-router-dom";
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

const Hostel: React.FC = () => {
  const { hero, content } = useFacilityCms("hostel");

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

      {/* About Hostel */}
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
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
                {content.intro.label}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight">
                {content.intro.title}
              </h2>
              <div className="h-px w-16 bg-indigo-400" aria-hidden />
              <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed">
                {content.intro.description}
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4 text-left">
              {content.intro.stats.map((stat, i) => {
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

      {/* Boys & Girls Hostel */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
              Accommodation
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">
              Separate Residential Blocks
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border-l-4 border-indigo-600 border border-slate-200 shadow-sm text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{content.boysHostel.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{content.boysHostel.description}</p>
              <ul className="text-slate-600 space-y-2">
                {content.boysHostel.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border-l-4 border-blue-600 border border-slate-200 shadow-sm text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{content.girlsHostel.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{content.girlsHostel.description}</p>
              <ul className="text-slate-600 space-y-2">
                {content.girlsHostel.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Facilities — NSS horizontal scroll style */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
              What we offer
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">
              Hostel Facilities
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-4" aria-hidden />
          </motion.div>
          <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {content.facilities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center flex-shrink-0 w-36 group cursor-default"
              >
                <div className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Types — NSS special camp style */}
      <section
        className="py-20 md:py-28 relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #312e81 0%, #1e3a8a 50%, #0f172a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(45deg, transparent 48%, white 49%, white 51%, transparent 52%)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden
        />
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          <div className="max-w-3xl text-left">
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-indigo-200 uppercase mb-4">
              Room options
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Accommodation Options</h2>
            <div className="h-px w-16 bg-white/50 rounded-full mb-6" aria-hidden />
            <p className="text-lg text-indigo-100 leading-relaxed mb-8">
              Choose from single, double, or triple occupancy rooms — each designed for comfort,
              study, and a safe residential experience on campus.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {content.rooms.map((room, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-left">
                  <div className="text-xl font-bold mb-1">{room.type}</div>
                  <div className="text-indigo-200 text-sm mb-3">{room.capacity}</div>
                  <div className="text-indigo-100 text-sm leading-relaxed">{room.amenities}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community & Rules — NSS get involved style */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl text-left"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
              {content.community.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">
              {content.community.title}
            </h2>
            <div className="h-px w-16 bg-indigo-400 mb-6" aria-hidden />
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-10">
              {content.community.description}
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-8 rounded-2xl border-l-4 border-indigo-600 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Campus Life</h3>
                <ul className="text-slate-600 space-y-2 text-left">
                  {content.community.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl border-l-4 border-blue-600 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{content.rules.title}</h3>
                <ul className="text-slate-600 space-y-3 text-left">
                  {content.rules.rules.map((rule, i) => (
                    <li key={i}>
                      <span className="font-semibold text-slate-800">{rule.title}: </span>
                      <span>{rule.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed mb-6">
              {content.cta.description}
            </p>
            <Link
              to={content.cta.buttonHref}
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              {content.cta.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-28 bg-slate-900 text-white border-t border-slate-700">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {content.contact.columns.map((col, i) => (
              <div key={i}>
                <h3 className="text-lg font-bold mb-3 text-indigo-300">{col.title}</h3>
                {col.lines.map((line, j) => (
                  <p key={j} className={j === 0 ? "text-slate-300" : "text-slate-400"}>
                    {line}
                  </p>
                ))}
                {col.email && (
                  <a href={`mailto:${col.email}`} className="text-slate-400 hover:text-white">
                    {col.email}
                  </a>
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

export default Hostel;
