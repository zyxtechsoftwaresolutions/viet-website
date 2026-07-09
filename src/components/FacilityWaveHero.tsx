import { motion } from 'framer-motion';
import HeroMediaBackground from '@/components/HeroMediaBackground';
import { resolveHeroMedia, heroHasVideo } from '@/lib/heroMedia';

const WAVE_PATH =
  'M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z';

export type FacilityWaveHeroProps = {
  badge?: string;
  title: string;
  description?: string;
  heroImage?: string;
  video?: string;
  gradient?: string;
  waveFill?: string;
  showDotPattern?: boolean;
  align?: 'center' | 'end';
};

const FacilityWaveHero = ({
  badge,
  title,
  description,
  heroImage,
  video,
  gradient = 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
  waveFill = 'rgb(248 250 252)',
  showDotPattern = false,
  align = 'end',
}: FacilityWaveHeroProps) => {
  const media = resolveHeroMedia({ heroImage, video });
  const hasBackgroundMedia = heroHasVideo(media) || Boolean(media.imageUrl);
  const alignClass = align === 'end' ? 'items-end' : 'items-center';

  return (
    <section
      className={`relative min-h-[65vh] md:min-h-[72vh] pt-24 md:pt-28 pb-12 md:pb-16 flex ${alignClass} text-white overflow-hidden`}
      style={!hasBackgroundMedia ? { background: gradient } : undefined}
    >
      <HeroMediaBackground
        media={media}
        fallbackGradient={gradient}
        imageOpacityClass="opacity-100"
      />
      {hasBackgroundMedia && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-black/50 from-0% via-black/20 via-[30%] to-transparent to-[55%]"
          aria-hidden
        />
      )}
      {showDotPattern && (
        <div
          className="absolute inset-0 opacity-10 z-[1]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden
        />
      )}
      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
        <motion.div
          className="max-w-2xl text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {badge && (
            <p className="inline-block px-4 py-1.5 text-sm md:text-base font-bold tracking-[0.2em] text-white uppercase bg-white/20 backdrop-blur-sm border border-white/40 rounded-full mb-5">
              {badge}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6">{description}</p>
          )}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2]">
        <svg viewBox="0 0 1440 120" className="w-full h-auto" aria-hidden>
          <path fill={waveFill} d={WAVE_PATH} />
        </svg>
      </div>
    </section>
  );
};

export default FacilityWaveHero;
