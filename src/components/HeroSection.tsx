import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Sprout,
  Building2,
  Cpu,
  Radio,
  Zap,
  Cog,
  BarChart3,
  ShieldCheck,
  Brain,
  Car,
  FlaskConical,
  Briefcase,
  Code2,
  LineChart,
  LayoutGrid,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroVideosAPI } from '@/lib/api';
import NewsAnnouncementsSection from '@/components/NewsAnnouncementsSection';
import ScrollingTicker from '@/components/ScrollingTicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Professional Lucide icon mapping – clean outline style
const ProgramIcons = {
  Agriculture: Sprout,
  Civil: Building2,
  Computer: Cpu,
  Electronics: Radio,
  Electrical: Zap,
  Mechanical: Cog,
  DataScience: BarChart3,
  CyberSecurity: ShieldCheck,
  AI: Brain,
  Automobile: Car,
  Science: FlaskConical,
  Business: Briefcase,
  Computing: Code2,
  Management: LineChart,
  Applications: LayoutGrid,
} as const;

const INTRO_COMPLETE_EVENT = 'introComplete';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  /** Fallback image shown only when video is unsupported (e.g. format not playable). */
  const [unsupportedVideoSlides, setUnsupportedVideoSlides] = useState<Set<number>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [heroSlides, setHeroSlides] = useState<Array<{
    type: 'video';
    src: string;
    poster?: string;
    badge?: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonAction: () => void;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [programFinderOpen, setProgramFinderOpen] = useState(false);
  const [programSearchQuery, setProgramSearchQuery] = useState('');

  // Video/poster URLs from API are full Supabase Storage URLs; use as-is.
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await heroVideosAPI.getAll();
        if (Array.isArray(videos) && videos.length > 0) {
          const slides = videos.map((video) => ({
            type: 'video' as const,
            src: video.src,
            poster: video.poster || undefined,
            badge: video.badge || undefined,
            title: video.title || '',
            subtitle: video.subtitle || '',
            buttonText: video.buttonText || 'Apply Now',
            buttonAction: video.buttonLink
              ? () => window.open(video.buttonLink!, video.buttonLink!.startsWith('http') ? '_blank' : '_self')
              : () => {},
          }));
          setHeroSlides(slides);
        } else {
          // Fallback to empty array if no videos
          setHeroSlides([]);
        }
      } catch (error) {
        console.error('Error fetching hero videos:', error);
        setHeroSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % heroSlides.length;
        // Preload next video when slide changes (deferred)
        setTimeout(() => {
          const nextVideo = videoRefs.current[next];
          if (nextVideo) {
            const deferredSource = nextVideo.querySelector('source[data-src]');
            if (deferredSource) {
              deferredSource.setAttribute('src', deferredSource.getAttribute('data-src') || '');
              deferredSource.removeAttribute('data-src');
              nextVideo.preload = 'metadata';
              nextVideo.load();
            }
          }
        }, 1000); // Delay preload to avoid blocking
        return next;
      });
    }, 8000); // 8 seconds per slide
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Play current hero video immediately when intro ends (avoids black gap)
  // Load deferred video sources when slide becomes active
  useEffect(() => {
    const onIntroComplete = () => {
      const video = videoRefs.current[currentSlide];
      if (video) {
        // Load deferred video source if present
        const deferredSource = video.querySelector('source[data-src]');
        if (deferredSource) {
          deferredSource.setAttribute('src', deferredSource.getAttribute('data-src') || '');
          deferredSource.removeAttribute('data-src');
          video.load();
        }
        video.play().catch(() => {});
      }
    };
    
    // Load deferred video source when slide becomes active
    const loadCurrentVideo = () => {
      const video = videoRefs.current[currentSlide];
      if (video) {
        const deferredSource = video.querySelector('source[data-src]');
        if (deferredSource) {
          deferredSource.setAttribute('src', deferredSource.getAttribute('data-src') || '');
          deferredSource.removeAttribute('data-src');
          video.load();
        }
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    };
    
    // Preload next video (one ahead) for smoother transitions
    const preloadNextVideo = () => {
      const nextIndex = (currentSlide + 1) % heroSlides.length;
      const nextVideo = videoRefs.current[nextIndex];
      if (nextVideo && nextIndex !== currentSlide) {
        const deferredSource = nextVideo.querySelector('source[data-src]');
        if (deferredSource) {
          // Only preload metadata, not full video
          deferredSource.setAttribute('src', deferredSource.getAttribute('data-src') || '');
          deferredSource.removeAttribute('data-src');
          nextVideo.preload = 'metadata';
          nextVideo.load();
        }
      }
    };
    
    window.addEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
    loadCurrentVideo();
    // Delay preload to avoid blocking initial load
    setTimeout(preloadNextVideo, 2000);
    
    return () => {
      window.removeEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
    };
  }, [currentSlide, heroSlides.length]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Explore Your Path – categories with professional icon keys
  const interestCategories: {
    diploma: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
    engineering: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
    management: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
  } = {
    diploma: [
      { name: 'Agriculture Engineering', icon: 'Agriculture', href: '/agricultural-engineering' },
      { name: 'Civil Engineering', icon: 'Civil', href: '/civil-engineering' },
      { name: 'Computer Engineering', icon: 'Computer', href: '/computer-engineering' },
      { name: 'ECE', icon: 'Electronics', href: '/electronics-communications-engineering' },
      { name: 'EEE', icon: 'Electrical', href: '/electrical-electronics-engineering' },
      { name: 'Mechanical Engineering', icon: 'Mechanical', href: '/mechanical-engineering' },
    ],
    engineering: [
      { name: 'Computer Science & Engineering', icon: 'Computer', href: '/programs/engineering/ug/cse' },
      { name: 'Data Science', icon: 'DataScience', href: '/programs/engineering/ug/data-science' },
      { name: 'Cyber Security', icon: 'CyberSecurity', href: '/programs/engineering/ug/cyber-security' },
      { name: 'AI & Machine Learning', icon: 'AI', href: '/programs/engineering/ug/aiml' },
      { name: 'Electronics & Communication', icon: 'Electronics', href: '/electronics-communications-engineering-ug' },
      { name: 'Electrical & Electronics', icon: 'Electrical', href: '/electrical-electronics-engineering-ug' },
      { name: 'Mechanical Engineering', icon: 'Mechanical', href: '/mechanical-engineering-ug' },
      { name: 'Civil Engineering', icon: 'Civil', href: '/civil-engineering-ug' },
      { name: 'Automobile Engineering', icon: 'Automobile', href: '/automobile-engineering' },
      { name: 'Basic Science & Humanities', icon: 'Science', href: '/bs-h' },
    ],
    management: [
      { name: 'BBA', icon: 'Business', href: '/bba' },
      { name: 'BCA', icon: 'Computing', href: '/bca' },
      { name: 'MBA', icon: 'Management', href: '/mba' },
      { name: 'MCA', icon: 'Applications', href: '/mca' },
    ],
  };

  const handleAdmissionsClick = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form', '_blank');
  };

  // Show loading or empty state
  if (loading) {
    return (
      <section id="home" className="relative min-h-screen overflow-hidden">
        <div className="relative h-screen bg-black flex items-center justify-center">
          <p className="text-white">Loading...</p>
        </div>
      </section>
    );
  }

  if (heroSlides.length === 0) {
    return (
      <section id="home" className="relative min-h-screen overflow-hidden">
        <div className="relative h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to VIET</h1>
            <p className="text-xl">Add hero videos through the admin panel</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Video Hero Section - Full Screen */}
      <div className="relative h-screen bg-black">
        {/* Main Video Container - Full Screen, No Border */}
        <div className="relative w-full h-full overflow-hidden bg-black">
          {/* All Media Stacked - No Fade, Instant Switch - Supports Video & GIF */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-100 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Video or GIF Background - Optimized for LCP */}
              {slide.type === 'video' ? (
                unsupportedVideoSlides.has(index) ? (
                  <img
                    src={slide.poster}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                ) : (
                  <video
                    ref={(el) => { 
                      videoRefs.current[index] = el;
                      // Load deferred video sources when video element is ready
                      if (el && index > 0) {
                        const deferredSource = el.querySelector('source[data-src]');
                        if (deferredSource && index === currentSlide) {
                          deferredSource.setAttribute('src', deferredSource.getAttribute('data-src') || '');
                          deferredSource.removeAttribute('data-src');
                          el.load();
                        }
                      }
                    }}
                    className="w-full h-full object-cover bg-black"
                    autoPlay={index === currentSlide}
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? "metadata" : "none"}
                    width={1920}
                    height={1080}
                    onError={() =>
                      setUnsupportedVideoSlides((prev) => new Set(prev).add(index))
                    }
                  >
                    {/* Only load first video source eagerly, defer others until slide becomes active */}
                    {index === 0 ? (
                      <>
                        <source src={slide.src} type="video/mp4" />
                        <source src={slide.src.replace('.mp4', '.webm')} type="video/webm" />
                      </>
                    ) : (
                      <source data-src={slide.src} type="video/mp4" data-deferred="true" />
                    )}
                  </video>
                )
              ) : (
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  onError={(e) => {
                    // Fallback to poster if GIF fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = slide.poster;
                  }}
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              
              {/* Content Overlay - Left Bottom Corner */}
              <div className={`absolute inset-0 flex items-end transition-opacity duration-300 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-full px-8 md:px-16 lg:px-24 pb-20 md:pb-24 lg:pb-28">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-block mb-4">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                          {slide.badge}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h1
                      className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
                      style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}
                    >
                      {slide.title}
                    </h1>
                    
                    {/* Subtitle */}
                    <p
                      className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-xl"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {slide.subtitle}
                    </p>
                    
                    {/* CTA Button */}
                    <button
                      onClick={slide.buttonAction}
                      className="group relative px-8 py-3.5 bg-white text-[#0a192f] font-semibold text-base rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.buttonText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          
          {/* Navigation Dots */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 h-2 bg-white rounded-full' 
                    : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
                }`}
              >
                {/* Progress indicator for current slide */}
                {index === currentSlide && isAutoPlaying && (
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 8, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Slide Counter */}
          <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 text-white/70 text-sm font-medium">
            <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="mx-1">/</span>
            <span>{String(heroSlides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Scrolling Ticker - Below Hero Carousel, Above News & Announcements */}
      <div id="ticker-section" className="relative">
        <ScrollingTicker />
      </div>

      {/* News & Announcements - below hero, above EXPLORE YOUR PATH */}
      <NewsAnnouncementsSection />

      {/* Explore Your Path – enhanced classic layout with professional icons */}
      <div id="whats-your-interest" className="relative bg-white py-16 md:py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 md:mb-16 gap-6">
            <div className="flex items-center gap-4">
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight"
                style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-0.02em' }}
              >
                EXPLORE YOUR PATH
              </h2>
              <img 
                src="/footprints-direction-sketch.png" 
                alt="" 
                className="h-10 md:h-12 lg:h-14 w-auto object-contain hidden sm:block"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                fetchpriority="auto"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setProgramFinderOpen(true)}
                className="group relative px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm overflow-hidden transition-all duration-300 hover:border-primary"
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                  Search For Programs
                </span>
                <span className="absolute inset-0 z-0 bg-primary transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
              </button>
              <button
                onClick={handleAdmissionsClick}
                className="group relative px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm overflow-hidden transition-all duration-300 hover:bg-primary/90"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* DIPLOMA */}
          <div className="mb-14">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
              Diploma
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {interestCategories.diploma.map((category) => {
                const IconComponent = ProgramIcons[category.icon];
                return (
                  <button
                    key={category.name}
                    onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                    className="group flex items-center gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#0a192f] group-hover:border-[#0a192f]/30 transition-colors">
                      <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#0a192f] leading-tight">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ENGINEERING */}
          <div className="mb-14">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
              Engineering
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {interestCategories.engineering.map((category) => {
                const IconComponent = ProgramIcons[category.icon];
                return (
                  <button
                    key={category.name}
                    onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                    className="group flex items-center gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#0a192f] group-hover:border-[#0a192f]/30 transition-colors">
                      <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#0a192f] leading-tight">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MANAGEMENT */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
              Management
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {interestCategories.management.map((category) => {
                const IconComponent = ProgramIcons[category.icon];
                return (
                  <button
                    key={category.name}
                    onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                    className="group flex items-center gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#0a192f] group-hover:border-[#0a192f]/30 transition-colors">
                      <IconComponent className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#0a192f] leading-tight">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Program Finder Dialog */}
      <Dialog open={programFinderOpen} onOpenChange={(open) => { setProgramFinderOpen(open); if (!open) setProgramSearchQuery(''); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Program Finder</DialogTitle>
            <DialogDescription>Search and select a program to view details.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Search programs..."
            value={programSearchQuery}
            onChange={(e) => setProgramSearchQuery(e.target.value)}
            className="w-full"
          />
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2">
            {(() => {
              const q = programSearchQuery.trim().toLowerCase();
              const filter = (list: { name: string; icon: keyof typeof ProgramIcons; href: string }[]) =>
                list.filter((p) => !q || p.name.toLowerCase().includes(q));
              const diploma = filter(interestCategories.diploma);
              const engineering = filter(interestCategories.engineering);
              const management = filter(interestCategories.management);
              const hasAny = diploma.length > 0 || engineering.length > 0 || management.length > 0;
              if (!hasAny) return <p className="text-slate-500 text-sm py-4">No programs match your search.</p>;
              return (
                <>
                  {diploma.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Diploma</h4>
                      <ul className="space-y-1.5">
                        {diploma.map((category) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <li key={category.name}>
                              <button
                                type="button"
                                onClick={() => { setProgramFinderOpen(false); setProgramSearchQuery(''); window.scrollTo(0, 0); navigate(category.href); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-100 transition-colors"
                              >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.75} />
                                </div>
                                <span className="font-medium text-slate-800">{category.name}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {engineering.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Engineering</h4>
                      <ul className="space-y-1.5">
                        {engineering.map((category) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <li key={category.name}>
                              <button
                                type="button"
                                onClick={() => { setProgramFinderOpen(false); setProgramSearchQuery(''); window.scrollTo(0, 0); navigate(category.href); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-100 transition-colors"
                              >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.75} />
                                </div>
                                <span className="font-medium text-slate-800">{category.name}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {management.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Management</h4>
                      <ul className="space-y-1.5">
                        {management.map((category) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <li key={category.name}>
                              <button
                                type="button"
                                onClick={() => { setProgramFinderOpen(false); setProgramSearchQuery(''); window.scrollTo(0, 0); navigate(category.href); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-100 transition-colors"
                              >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.75} />
                                </div>
                                <span className="font-medium text-slate-800">{category.name}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;