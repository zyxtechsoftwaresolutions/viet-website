import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import LeaderPageNavbar from "@/components/LeaderPageNavbar";
import Footer from "@/components/Footer";
import FacilityWaveHero from "@/components/FacilityWaveHero";
import { useFacilityCms } from "@/hooks/useFacilityCms";

const Laboratory = () => {
  const { hero, content } = useFacilityCms("laboratory");
  const [activeLabIndex, setActiveLabIndex] = useState<number | null>(null);

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
            <div className="text-slate-600 text-[1.0625rem] md:text-lg leading-[1.85] max-w-3xl">
              <p>
                {content.about.paragraph}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Laboratory Facilities — lab cards */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-4">
              Explore labs
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-8 leading-tight">
              Laboratory Facilities
            </h2>
            <div className="h-px w-16 bg-slate-300 mb-10" aria-hidden />
            <p className="text-slate-600 text-sm mb-8 max-w-xl">Hover over each lab to view details, or tap on mobile.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.labs.map((lab, index) => (
                <div
                  key={lab.id}
                  className="group relative h-[380px] md:h-[400px] overflow-hidden border border-slate-200 cursor-pointer rounded-tl-[4rem] rounded-tr-[2rem] rounded-br-[4rem] rounded-bl-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25),0_8px_16px_-8px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),0_12px_24px_-10px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setActiveLabIndex(activeLabIndex === index ? null : index)}
                >
                  <img
                    src={lab.image}
                    alt={lab.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-[2] pointer-events-none">
                    <h3 className="text-xl font-semibold">{lab.name}</h3>
                    <div className="h-1 w-12 bg-amber-400 rounded mt-2" />
                  </div>

                  {/* Hover / active dialog — glass effect, same curve as card to avoid corner glitch */}
                  <div
                    className={`absolute inset-0 overflow-hidden rounded-tl-[4rem] rounded-tr-[2rem] rounded-br-[4rem] rounded-bl-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 p-5 flex flex-col z-10 transition-opacity duration-300 ${
                      activeLabIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">{lab.name}</h3>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setActiveLabIndex(null); }}
                        className="p-1 rounded-md text-white/80 hover:bg-white/10 hover:text-white md:hidden"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed flex-grow overflow-y-auto mb-4">{lab.description}</p>
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-2">Key Features</h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {lab.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/20 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-sm font-medium text-white">{lab.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lab Resources / Stats — theme gradient like Library collection */}
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
              {content.resources.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-white tracking-tight mb-8 leading-tight">
              {content.resources.title}
            </h2>
            <div className="h-px w-16 bg-white/40 mb-10" aria-hidden />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              {content.resources.stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Laboratory;
