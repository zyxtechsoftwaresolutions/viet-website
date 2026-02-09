import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { recruitersAPI, placementSectionAPI, placementCarouselAPI } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const UPLOADS_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/api\/?$/, '') || 'http://localhost:3001';

interface PlacementSectionConfig {
  title: string;
  subtitle: string;
  highestPackageLPA: number;
  averagePackageLPA: number;
  totalOffers: number;
  companiesVisited: number;
}

const DEFAULT_CONFIG: PlacementSectionConfig = {
  title: 'Placement Excellence at VIET',
  subtitle: "Our students are shaping the future at the world's leading technology companies.",
  highestPackageLPA: 10,
  averagePackageLPA: 4.5,
  totalOffers: 250,
  companiesVisited: 53,
};

const PlacementExcellenceSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [config, setConfig] = useState<PlacementSectionConfig>(DEFAULT_CONFIG);
  const [recruiters, setRecruiters] = useState<{ name: string; logo: string }[]>([]);
  const [studentCarousel, setStudentCarousel] = useState<{ id: number; src: string; title: string; subtitle: string }[]>([]);
  const [studentSlide, setStudentSlide] = useState(0);
  const [carouselAnimating, setCarouselAnimating] = useState(false);
  const [memberInfoOpacity, setMemberInfoOpacity] = useState(1);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);

  const defaultRecruiters = [
    { name: 'Tech Mahindra', logo: '/RECRUITERS/Tech_Mahindra.png' },
    { name: 'TCS', logo: '/RECRUITERS/tcs.png' },
    { name: 'HCL', logo: '/RECRUITERS/hcl-img.png' },
    { name: "Byju's", logo: '/RECRUITERS/byjus-img.png' },
    { name: 'Novel Paints', logo: '/RECRUITERS/novel-img.png' },
    { name: 'Smart Brains', logo: '/RECRUITERS/smart-brains-img.png' },
  ];

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
              logo: r.logo?.startsWith('/') ? `${API_BASE_URL}${r.logo}` : r.logo,
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
              src: item.src?.startsWith('/') ? `${UPLOADS_ORIGIN}${item.src}` : item.src,
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

  const goToSlide = useCallback((newIndex: number) => {
    if (carouselAnimating || studentCarousel.length === 0) return;
    setCarouselAnimating(true);
    setMemberInfoOpacity(0);
    const next = (newIndex + studentCarousel.length) % studentCarousel.length;
    setTimeout(() => {
      setStudentSlide(next);
      setMemberInfoOpacity(1);
    }, 300);
    setTimeout(() => setCarouselAnimating(false), 800);
  }, [carouselAnimating, studentCarousel.length]);

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

  // Vignan-style: smooth infinite horizontal scroll (images below stats). Pause on hover.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || logos.length === 0) return;

    let rafId: number;
    let position = 0;
    const speed = 1;

    const tick = () => {
      if (!hovered) {
        position += speed;
        const half = el.scrollWidth / 2;
        if (position >= half) position = 0;
        el.scrollLeft = position;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hovered, logos.length]);

  const duplicatedLogos = [...logos, ...logos];

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
    <section className="relative py-12 md:py-16 overflow-visible bg-gradient-to-b from-[#1e2270] via-[#252b8a] to-[#251755]">
      {/* Gloss overlay – light reflection from top */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 25%, transparent 50%)',
        }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-10 lg:px-12">
        {/* 1. Section title + subtitle */}
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
            {loadingConfig ? DEFAULT_CONFIG.title : config.title}
          </h2>
          <p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {loadingConfig ? DEFAULT_CONFIG.subtitle : config.subtitle}
          </p>
        </motion.div>

        {/* 2. Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-14"
        >
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-[#0a192f] mb-1">
              {config.highestPackageLPA} LPA
            </div>
            <div className="text-sm md:text-base text-slate-600 font-medium">Highest Package</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-[#0a192f] mb-1">
              {config.averagePackageLPA} LPA
            </div>
            <div className="text-sm md:text-base text-slate-600 font-medium">Average Package</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-[#0a192f] mb-1">
              {config.totalOffers}+
            </div>
            <div className="text-sm md:text-base text-slate-600 font-medium">Total Offers (2024-2025)</div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 md:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl md:text-3xl font-bold text-[#0a192f] mb-1">
              {config.companiesVisited}+
            </div>
            <div className="text-sm md:text-base text-slate-600 font-medium">Companies Visited</div>
          </div>
        </motion.div>

        {/* Student / placement carousel – 3D card stack, below stats, above Top Recruiters */}
        {studentCarousel.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="placement-carousel-wrapper mb-12 md:mb-14"
            onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].screenX; }}
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
                      fetchPriority="auto"
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

        {/* 3. Top Recruiters – logo strip BELOW stats, Vignan-style infinite scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3
            className="text-xl md:text-2xl font-bold text-white mb-6 text-center"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Top Recruiters
          </h3>

          <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-8 md:gap-12 overflow-hidden will-change-scroll"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {duplicatedLogos.map((r, i) => (
                <div
                  key={`${r.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center w-28 h-16 md:w-36 md:h-20 bg-white rounded-lg border border-slate-100 p-3"
                >
                  <img
                    src={logoSrc(r.logo)}
                    alt={r.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#1e2270] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#251755] to-transparent pointer-events-none z-10" />
          </div>

          {loadingRecruiters && logos.length === 0 ? null : (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate('/placements');
                }}
                className="text-white font-semibold text-sm md:text-base hover:underline underline-offset-4"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                View full placements →
              </button>
            </div>
          )}
        </motion.div>
      </div>
      <style>{`
        .will-change-scroll::-webkit-scrollbar { display: none; }

        /* Placement 3D carousel */
        .placement-carousel-wrapper { margin-top: 2rem; overflow: visible; }
        .placement-carousel-container {
          width: 100%;
          max-width: 1200px;
          height: 450px;
          position: relative;
          perspective: 1000px;
          margin: 0 auto;
          overflow: visible;
        }
        .placement-carousel-track {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          transform-style: preserve-3d;
          overflow: visible;
        }
        .placement-card {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 280px;
          height: 380px;
          margin-left: -140px;
          margin-top: -190px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
        }
        .placement-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .placement-card.center { z-index: 10; transform: scale(1.1) translateZ(0); }
        .placement-card.center img { filter: none; }
        .placement-card.left-2 {
          z-index: 1;
          transform: translateX(-400px) scale(0.8) translateZ(-300px);
          opacity: 0.7;
        }
        .placement-card.left-2 img { filter: grayscale(100%); }
        .placement-card.left-1 {
          z-index: 5;
          transform: translateX(-200px) scale(0.9) translateZ(-100px);
          opacity: 0.9;
        }
        .placement-card.left-1 img { filter: grayscale(100%); }
        .placement-card.right-1 {
          z-index: 5;
          transform: translateX(200px) scale(0.9) translateZ(-100px);
          opacity: 0.9;
        }
        .placement-card.right-1 img { filter: grayscale(100%); }
        .placement-card.right-2 {
          z-index: 1;
          transform: translateX(400px) scale(0.8) translateZ(-300px);
          opacity: 0.7;
        }
        .placement-card.right-2 img { filter: grayscale(100%); }
        .placement-card.hidden { opacity: 0; pointer-events: none; }
        .placement-member-info {
          text-align: center;
          margin-top: 40px;
          transition: opacity 0.5s ease-out;
        }
        .placement-member-name {
          color: #fff;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 10px;
          position: relative;
          display: inline-block;
          font-family: 'Cinzel', serif;
        }
        .placement-member-name::before,
        .placement-member-name::after {
          content: "";
          position: absolute;
          top: 100%;
          width: 100px;
          height: 2px;
          background: rgba(255,255,255,0.6);
        }
        .placement-member-name::before { left: -120px; }
        .placement-member-name::after { right: -120px; }
        .placement-member-role {
          color: rgba(255,255,255,0.85);
          font-size: 1.25rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 10px 0;
          margin-top: -15px;
        }
        .placement-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 40px;
        }
        .placement-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }
        .placement-dot.active {
          background: #fff;
          transform: scale(1.2);
        }
        .placement-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.25);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s ease;
          font-size: 1.5rem;
          border: none;
          padding-bottom: 4px;
        }
        .placement-nav-arrow:hover:not(:disabled) {
          background: rgba(255,255,255,0.5);
          transform: translateY(-50%) scale(1.1);
        }
        .placement-nav-arrow.left { left: 20px; padding-right: 3px; }
        .placement-nav-arrow.right { right: 20px; padding-left: 3px; }
        .placement-nav-arrow:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) {
          .placement-carousel-container { height: 380px; }
          .placement-card {
            width: 200px;
            height: 280px;
            margin-left: -100px;
            margin-top: -140px;
          }
          .placement-card.left-2 { transform: translateX(-250px) scale(0.8) translateZ(-300px); }
          .placement-card.left-1 { transform: translateX(-120px) scale(0.9) translateZ(-100px); }
          .placement-card.right-1 { transform: translateX(120px) scale(0.9) translateZ(-100px); }
          .placement-card.right-2 { transform: translateX(250px) scale(0.8) translateZ(-300px); }
          .placement-member-name { font-size: 1.5rem; }
          .placement-member-name::before, .placement-member-name::after { width: 50px; }
          .placement-member-name::before { left: -70px; }
          .placement-member-name::after { right: -70px; }
          .placement-member-role { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default PlacementExcellenceSection;
