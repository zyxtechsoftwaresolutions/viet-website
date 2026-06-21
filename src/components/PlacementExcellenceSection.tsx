import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import { TrendingUp, BarChart3, Handshake, Building2 } from 'lucide-react';

import { recruitersAPI, placementSectionAPI, placementCarouselAPI } from '@/lib/api';
import AnimatedStat, { type AnimatedStatConfig } from '@/components/AnimatedStat';
import RankedTopSection from '@/components/RankedTopSection';



const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';



interface PlacementSectionConfig {

  title: string;

  subtitle: string;

  highestPackageLPA: number;

  averagePackageLPA: number;

  totalOffers: number;

  companiesVisited: number;

}



const DEFAULT_CONFIG: PlacementSectionConfig = {

  title: 'the Top recruiters who choose VIET talent',

  subtitle:

    'VIET offers strong placements with packages of up to ₹10 LPA, featuring recruiters like TCS, Tech Mahindra, HCL, and more, along with career-focused training.',

  highestPackageLPA: 10,

  averagePackageLPA: 4.5,

  totalOffers: 250,

  companiesVisited: 53,

};



const defaultRecruiters = [

  { name: 'Tech Mahindra', logo: '/RECRUITERS/Tech_Mahindra.png' },

  { name: 'TCS', logo: '/RECRUITERS/tcs.png' },

  { name: 'HCL', logo: '/RECRUITERS/hcl-img.png' },

  { name: "Byju's", logo: '/RECRUITERS/byjus-img.png' },

  { name: 'Novel Paints', logo: '/RECRUITERS/novel-img.png' },

  { name: 'Smart Brains', logo: '/RECRUITERS/smart-brains-img.png' },

];



function LogoMarqueeRow({

  logos,

  direction,

  logoSrc,

}: {

  logos: { name: string; logo: string }[];

  direction: 'left' | 'right';

  logoSrc: (logo: string) => string;

}) {

  const minCopies = logos.length < 4 ? 4 : 2;

  const items = [...Array(minCopies)].flatMap((_, copy) =>

    logos.map((r, i) => ({ ...r, key: `${copy}-${i}` }))

  );



  return (

    <div className="overflow-hidden py-3 md:py-4">

      <div

        className={`flex w-max gap-10 md:gap-16 px-4 ${

          direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'

        }`}

        style={{ animationDuration: `${Math.max(28, logos.length * 5)}s` }}

      >

        {items.map((r) => (

          <div

            key={r.key}

            className="shrink-0 flex items-center justify-center h-14 md:h-16 w-28 md:w-36 rounded-lg bg-white/95 border border-white/20 px-3 shadow-sm hover:shadow-md transition-shadow duration-300"

          >

            <img

              src={logoSrc(r.logo)}

              alt={r.name}

              className="max-h-10 md:max-h-12 w-auto max-w-[120px] object-contain"

              loading="lazy"

              decoding="async"

              onError={(e) => {

                (e.target as HTMLImageElement).style.display = 'none';

              }}

            />

          </div>

        ))}

      </div>

    </div>

  );

}



const PlacementExcellenceSection = () => {

  const navigate = useNavigate();

  const [config, setConfig] = useState<PlacementSectionConfig>(DEFAULT_CONFIG);

  const [recruiters, setRecruiters] = useState<{ name: string; logo: string }[]>([]);

  const [studentCarousel, setStudentCarousel] = useState<

    { id: number; src: string; title: string; subtitle: string }[]

  >([]);

  const [studentSlide, setStudentSlide] = useState(0);

  const [carouselAnimating, setCarouselAnimating] = useState(false);

  const [memberInfoOpacity, setMemberInfoOpacity] = useState(1);

  const [loadingConfig, setLoadingConfig] = useState(true);

  const [loadingRecruiters, setLoadingRecruiters] = useState(true);



  useEffect(() => {

    placementSectionAPI

      .get()

      .then((data: PlacementSectionConfig) => setConfig({ ...DEFAULT_CONFIG, ...data }))

      .catch(() => setConfig(DEFAULT_CONFIG))

      .finally(() => setLoadingConfig(false));

  }, []);



  useEffect(() => {

    recruitersAPI

      .getAll()

      .then((data: any[]) => {

        if (data?.length) {

          setRecruiters(

            data.map((r: any) => ({

              name: r.name,

              logo: r.logo || '',

            }))

          );

        } else {

          setRecruiters(defaultRecruiters);

        }

      })

      .catch(() => setRecruiters(defaultRecruiters))

      .finally(() => setLoadingRecruiters(false));

  }, []);



  useEffect(() => {

    placementCarouselAPI

      .getAll()

      .then((data: any[]) => {

        if (Array.isArray(data) && data.length > 0) {

          setStudentCarousel(

            data.map((item: any) => ({

              id: item.id,

              src: item.src || '',

              title: item.title || '',

              subtitle: item.subtitle || '',

            }))

          );

        }

      })

      .catch(() => setStudentCarousel([]));

  }, []);



  const currentSlideRef = useRef(0);

  currentSlideRef.current = studentSlide;



  const goToSlide = useCallback(

    (newIndex: number) => {

      if (carouselAnimating || studentCarousel.length === 0) return;

      setCarouselAnimating(true);

      setMemberInfoOpacity(0);

      const next = (newIndex + studentCarousel.length) % studentCarousel.length;

      setTimeout(() => {

        setStudentSlide(next);

        setMemberInfoOpacity(1);

      }, 300);

      setTimeout(() => setCarouselAnimating(false), 800);

    },

    [carouselAnimating, studentCarousel.length]

  );



  useEffect(() => {

    if (studentCarousel.length <= 1) return;

    const t = setInterval(() => {

      const next = (currentSlideRef.current + 1) % studentCarousel.length;

      goToSlide(next);

    }, 5000);

    return () => clearInterval(t);

  }, [studentCarousel.length, goToSlide]);



  const getCardPositionClass = (index: number): string => {

    const n = studentCarousel.length;

    if (n === 0) return 'hidden';

    const offset = (index - studentSlide + n) % n;

    if (offset === 0) return 'center';

    if (offset === n - 1) return 'left-1';

    if (offset === 1) return 'right-1';

    if (offset === n - 2) return 'left-2';

    if (offset === 2) return 'right-2';

    return 'hidden';

  };



  const logos = recruiters.length ? recruiters : defaultRecruiters;

  const logoSrc = (logo: string) =>

    logo.startsWith('http') || logo.startsWith('/') ? logo : `${API_BASE_URL}${logo}`;



  const rowOneLogos = logos;

  const rowTwoLogos = useMemo(() => [...logos].reverse(), [logos]);



  const placementStats = useMemo((): AnimatedStatConfig[] => {

    const c = loadingConfig ? DEFAULT_CONFIG : config;

    return [

      {

        label: 'Highest Package',

        icon: TrendingUp,

        targetValue: c.highestPackageLPA,

        prefix: '₹',

        suffix: ' LPA',

        decimals: Number.isInteger(c.highestPackageLPA) ? 0 : 1,

      },

      {

        label: 'Average Package',

        icon: BarChart3,

        targetValue: c.averagePackageLPA,

        prefix: '₹',

        suffix: ' LPA',

        decimals: 1,

      },

      {

        label: 'Total Offers (2024-2025)',

        icon: Handshake,

        targetValue: c.totalOffers,

        suffix: '+',

      },

      {

        label: 'Companies Visited',

        icon: Building2,

        targetValue: c.companiesVisited,

        suffix: '+',

      },

    ];

  }, [config, loadingConfig]);



  const headline = loadingConfig ? DEFAULT_CONFIG.title : config.title;

  const description = loadingConfig ? DEFAULT_CONFIG.subtitle : config.subtitle;



  const touchStartX = useRef(0);

  const touchEndX = useRef(0);



  useEffect(() => {

    const onKeyDown = (e: KeyboardEvent) => {

      if (studentCarousel.length <= 1) return;

      if (e.key === 'ArrowLeft') {

        e.preventDefault();

        goToSlide(studentSlide - 1);

      } else if (e.key === 'ArrowRight') {

        e.preventDefault();

        goToSlide(studentSlide + 1);

      }

    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);

  }, [studentCarousel.length, studentSlide, goToSlide]);



  return (
    <>
      <section className="relative overflow-hidden font-notice">
        <div className="placement-hero-stats-bg pt-16 md:pt-24 pb-14 md:pb-16">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          {/* LPU-style two-column header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-12 md:mb-16 items-start"
          >
            <div className="lg:col-span-3">
              <h2 className="home-section-title uppercase">Placements</h2>
              <div className="mt-3 h-1.5 w-20 rounded-full bg-primary" aria-hidden />
            </div>
            <div className="lg:col-span-9">
              <p
                className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold text-[#0a192f] leading-[1.1] tracking-tight"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Explore
              </p>
              <p
                className="mt-1 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-normal text-[#0a192f] leading-snug tracking-tight"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {headline}
              </p>
              <p
                className="mt-4 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {description}
              </p>
            </div>
          </motion.div>

          {/* LPU-style circular rollup stats */}
          <div className="placement-hero-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {placementStats.map((stat, index) => (
              <AnimatedStat key={stat.label} stat={stat} index={index} variant="placement-lpu" />
            ))}
          </div>
        </div>
      </div>
      </section>

      <div className="placement-ranked-continuum">
        <div className="placement-section-body">
          <div className="container mx-auto px-4 md:px-10 lg:px-12 pb-10 md:pb-14 pt-10 md:pt-12">
        {/* Student placement photos — 3D carousel */}

        {studentCarousel.length > 0 && (

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            transition={{ delay: 0.1 }}

            className="placement-carousel-wrapper mb-14 md:mb-16"

            onTouchStart={(e) => {

              touchStartX.current = e.changedTouches[0].screenX;

            }}

            onTouchEnd={(e) => {

              touchEndX.current = e.changedTouches[0].screenX;

              const diff = touchStartX.current - touchEndX.current;

              if (studentCarousel.length > 1 && Math.abs(diff) > 50) {

                if (diff > 0) goToSlide(studentSlide + 1);

                else goToSlide(studentSlide - 1);

              }

            }}

          >

            <div className="placement-carousel-container">

              {studentCarousel.length > 1 && (

                <>

                  <button

                    type="button"

                    className="placement-nav-arrow left"

                    onClick={() => goToSlide(studentSlide - 1)}

                    disabled={carouselAnimating}

                    aria-label="Previous"

                  >

                    ‹

                  </button>

                  <button

                    type="button"

                    className="placement-nav-arrow right"

                    onClick={() => goToSlide(studentSlide + 1)}

                    disabled={carouselAnimating}

                    aria-label="Next"

                  >

                    ›

                  </button>

                </>

              )}

              <div className="placement-carousel-track">

                {studentCarousel.map((slide, i) => (

                  <div

                    key={slide.id}

                    role="button"

                    tabIndex={0}

                    data-index={i}

                    className={`placement-card ${getCardPositionClass(i)}`}

                    onClick={() => studentCarousel.length > 1 && goToSlide(i)}

                    onKeyDown={(e) => {

                      if (e.key === 'Enter' || e.key === ' ') {

                        e.preventDefault();

                        studentCarousel.length > 1 && goToSlide(i);

                      }

                    }}

                  >

                    <img

                      src={slide.src}

                      alt={slide.title || 'Placement'}

                      width={300}

                      height={300}

                      loading="lazy"

                      decoding="async"

                    />

                  </div>

                ))}

              </div>

            </div>

            <div className="placement-member-info" style={{ opacity: memberInfoOpacity }}>

              <h3 className="placement-member-name">

                {studentCarousel[studentSlide]?.title || '—'}

              </h3>

              <p className="placement-member-role">

                {studentCarousel[studentSlide]?.subtitle || '—'}

              </p>

            </div>

            {studentCarousel.length > 1 && (

              <div className="placement-dots">

                {studentCarousel.map((_, i) => (

                  <button

                    key={i}

                    type="button"

                    className={`placement-dot ${i === studentSlide ? 'active' : ''}`}

                    onClick={() => goToSlide(i)}

                    aria-label={`Slide ${i + 1}`}

                  />

                ))}

              </div>

            )}

          </motion.div>

        )}



        {/* Dual-direction recruiter logo marquees */}

        {!loadingRecruiters && logos.length > 0 && (

          <motion.div

            initial={{ opacity: 0, y: 24 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            transition={{ delay: 0.15 }}

            className="-mx-4 md:-mx-6"

          >

            <LogoMarqueeRow logos={rowOneLogos} direction="left" logoSrc={logoSrc} />

            <LogoMarqueeRow logos={rowTwoLogos} direction="right" logoSrc={logoSrc} />

          </motion.div>

        )}



        <motion.div

          initial={{ opacity: 0 }}

          whileInView={{ opacity: 1 }}

          viewport={{ once: true }}

          className="mt-10 md:mt-12"

        >

          <button

            type="button"

            onClick={() => {

              window.scrollTo(0, 0);

              navigate('/placements');

            }}

            className="inline-flex items-center gap-2 text-sm md:text-base font-semibold placement-link transition-colors group"

            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}

          >

            View full placements

            <span className="group-hover:translate-x-1 transition-transform" aria-hidden>

              →

            </span>

          </button>

        </motion.div>

        </div>
        </div>
        <RankedTopSection />
      </div>
    </>
  );

};



export default PlacementExcellenceSection;

