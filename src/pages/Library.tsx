import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Wifi, MapPin, Coffee, type LucideIcon } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import FacilityWaveHero from "@/components/FacilityWaveHero";
import { useFacilityCms } from "@/hooks/useFacilityCms";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  users: Users,
  wifi: Wifi,
  clock: Clock,
  coffee: Coffee,
  "map-pin": MapPin,
};

const Library = () => {
  const { hero, content } = useFacilityCms("library");

  return (
    <div className="min-h-screen bg-slate-100">
      <LeaderPageNavbar backHref="/" />

      <FacilityWaveHero
        badge={hero.badge}
        title={hero.title}
        description={hero.description}
        heroImage={hero.heroImage}
        video={hero.video}
        gradient={hero.gradient}
        waveFill={hero.waveFill}
        align={hero.align}
      />

      {/* About — Chairman-style section */}
      <section className="py-20 md:py-28 bg-[#fafafa] border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              {content.about.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 leading-tight">
              {content.about.title}
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85]">
              {content.about.paragraphs.map((paragraph, i) => (
                <p key={i} className={i < content.about.paragraphs.length - 1 ? "mb-6" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features — Chairman-style spacing */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              What we offer
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 leading-tight">
              Library Features
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[feature.icon] ?? BookOpen;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-amber-700" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collection Stats */}
      <section
        className="py-20 md:py-28 border-t border-slate-200"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)" }}
      >
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-white/70 uppercase mb-4">
              {content.collection.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight mb-8 leading-tight">
              {content.collection.title}
            </h2>
            <div className="h-px w-16 bg-white/40 mb-10" aria-hidden />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              {content.collection.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timings & Rules — Chairman-style spacing */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
                Opening hours
              </p>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-8">
                Library Timings
              </h3>
              <div className="h-px w-16 bg-slate-300 mb-6" aria-hidden />
              <div className="space-y-0">
                {content.timings.map((item, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-800">{item.day}</span>
                    <span className="text-amber-600 font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
                Guidelines
              </p>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-8">
                Library Rules
              </h3>
              <div className="h-px w-16 bg-slate-300 mb-6" aria-hidden />
              <ul className="space-y-3 text-slate-600 text-[1.0625rem] leading-relaxed">
                {content.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2"><span className="text-amber-600 shrink-0">•</span> {rule}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Library;
