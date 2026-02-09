import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Trophy, GraduationCap, Star, Building2 } from 'lucide-react';

const RANKED_ITEMS = [
  {
    id: 'nirf',
    icon: Trophy,
    logo: '/nirf-logo.png',
    title: 'NIRF',
    subtitle: 'National Institutional Ranking Framework',
    primaryStat: 'Ranked',
    secondaryStat: 'Among Top Engineering Colleges',
    description: 'VIET is consistently ranked among the top engineering institutions in India.',
    href: '/accreditations',
  },
  {
    id: 'naac',
    icon: Award,
    logo: '/naac-A-logo.png',
    title: 'NAAC',
    subtitle: 'National Assessment and Accreditation Council',
    primaryStat: 'A',
    secondaryStat: 'Grade Accreditation',
    description: 'Awarded NAAC A grade for excellence in technical education and institutional quality.',
    href: '/accreditations',
  },
  {
    id: 'ugc',
    icon: Building2,
    logo: '/UGC-logo.png',
    title: 'UGC',
    subtitle: 'University Grants Commission',
    primaryStat: 'Autonomous',
    secondaryStat: 'Category I Status',
    description: 'Conferred autonomous status by UGC for academic excellence and self-governance.',
    href: '/accreditations',
  },
  {
    id: 'aicte',
    icon: GraduationCap,
    logo: '/AICTE-Logo.png',
    title: 'AICTE',
    subtitle: 'All India Council for Technical Education',
    primaryStat: 'Approved',
    secondaryStat: '18+ Years',
    description: 'Continuously approved by AICTE since 2008, ensuring quality technical education.',
    href: '/accreditation',
  },
  {
    id: 'iso',
    icon: Star,
    logo: '/iso-logo.png',
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management',
    primaryStat: 'Certified',
    secondaryStat: 'Quality Systems',
    description: 'ISO certified for quality management systems and institutional processes.',
    href: '/accreditations',
  },
];

const RankedTopSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative py-12 md:py-16 overflow-hidden mb-0 -mt-px"
      style={{
        background: 'linear-gradient(to bottom, #251755 0%, #251755 12%, #1a1040 50%, #0a0a0a 100%)',
      }}
    >
      {/* Gloss overlay – starts below seam so Placement/Ranked Top meet at same #251755 */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            linear-gradient(180deg, transparent 0%, transparent 18%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.02) 40%, transparent 60%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)
          `,
        }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-10 lg:px-12">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}
          >
            Ranked Top
          </h2>
          <p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Recognized excellence in rankings, accreditations, and quality assurance
          </p>
        </motion.div>

        {/* Rankings grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {RANKED_ITEMS.map((item, index) => {
            const IconComponent = item.icon;
            const logoSrc = item.logo;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group"
              >
                <button
                  type="button"
                  onClick={() => navigate(item.href)}
                  className="w-full h-full text-left bg-white/5 rounded-xl border border-white/10 p-5 md:p-6 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/10 overflow-hidden p-1.5">
                      {logoSrc ? (
                        <img src={logoSrc} alt={item.title} className="w-full h-full object-contain" />
                      ) : (
                        <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 mb-2 line-clamp-1">
                      {item.subtitle}
                    </p>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">
                      {item.primaryStat}
                    </div>
                    <div className="text-sm text-white/70 font-medium">
                      {item.secondaryStat}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Know More link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8"
        >
          <button
            type="button"
            onClick={() => navigate('/accreditations')}
            className="text-white font-semibold text-sm md:text-base hover:underline underline-offset-4"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Know More →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default RankedTopSection;
