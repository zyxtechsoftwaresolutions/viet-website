import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import FacilityWaveHero from '@/components/FacilityWaveHero';
import FacilityLeaderProfile from '@/components/FacilityLeaderProfile';
import { useFacilityCms } from '@/hooks/useFacilityCms';
import { imgUrl } from '@/lib/imageUtils';

const Scouts = () => {
  const { hero, content } = useFacilityCms('scouts');

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

      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-10 lg:px-12">
              <motion.div
                className="max-w-3xl text-left"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
                  {content.about.label}
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">
                  {content.about.title}
                </h2>
                <div className="h-px w-16 bg-primary mb-6" aria-hidden />
                {content.about.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-slate-600 text-[1.0625rem] md:text-lg leading-relaxed ${
                      index < content.about.paragraphs.length - 1 ? 'mb-6' : ''
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            </div>
      </section>

      <FacilityLeaderProfile profile={content.leader} />

      <section className="py-20 md:py-28 bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-10 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-left"
              >
                <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
                  {content.eventsSection.label}
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-2">
                  {content.eventsSection.title}
                </h2>
                <div className="h-px w-16 bg-primary mb-4" aria-hidden />
                <p className="text-slate-600 max-w-2xl">{content.eventsSection.description}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {content.events.map((event, index) => (
                  <motion.article
                    key={`${event.title}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.08, 0.35) }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-slate-200 aspect-[4/3] hover:shadow-xl transition-shadow"
                  >
                    {event.image && (
                      <img
                        src={imgUrl(event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white text-left">
                      <h3 className="text-base md:text-lg font-bold drop-shadow-md">{event.title}</h3>
                      {event.caption && <p className="text-white/90 text-sm mt-0.5">{event.caption}</p>}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
      </section>

      <section className="py-20 md:py-28 bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-10 lg:px-12">
              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase mb-2">
                What we do
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 tracking-tight mb-4">
                Scouts Activities
              </h2>
              <div className="h-px w-16 bg-primary mb-10" aria-hidden />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {content.activities.map((activity, index) => (
                  <motion.div
                    key={`${activity}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.06, 0.3) }}
                    className="flex items-start gap-3 p-5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-slate-700 leading-relaxed">{activity}</p>
                  </motion.div>
                ))}
              </div>
            </div>
      </section>

      <Footer />
    </div>
  );
};

export default Scouts;
