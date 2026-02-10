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
import { heroVideosAPI, departmentsAPI } from '@/lib/api';
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
  const [interestCategories, setInterestCategories] = useState<{
    diploma: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
    engineering: {
      ug: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
      pg: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
    };
    management: {
      ug: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
      pg: { name: string; icon: keyof typeof ProgramIcons; href: string }[];
    };
  }>({
    diploma: [],
    engineering: { ug: [], pg: [] },
    management: { ug: [], pg: [] },
  });

  // Map department name to icon and href
  const getDepartmentMapping = (name: string, stream: string, level: string): { icon: keyof typeof ProgramIcons; href: string } => {
    const normalizedName = name.toLowerCase().replace(/^(diploma|engineering|management)\s*(ug|pg)?\s*-\s*/i, '').trim();
    
    // Icon mapping
    let icon: keyof typeof ProgramIcons = 'Computer';
    if (normalizedName.includes('agriculture')) icon = 'Agriculture';
    else if (normalizedName.includes('civil')) icon = 'Civil';
    else if (normalizedName.includes('computer') || normalizedName.includes('cse')) icon = 'Computer';
    else if (normalizedName.includes('ece') || normalizedName.includes('electronics and communication')) icon = 'Electronics';
    else if (normalizedName.includes('eee') || normalizedName.includes('electrical')) icon = 'Electrical';
    else if (normalizedName.includes('mechanical')) icon = 'Mechanical';
    else if (normalizedName.includes('data science') || normalizedName.includes('datascience') || normalizedName.includes('csd')) icon = 'DataScience';
    else if (normalizedName.includes('cyber') || normalizedName.includes('csc')) icon = 'CyberSecurity';
    else if (normalizedName.includes('machine learning') || normalizedName.includes('ai') || normalizedName.includes('csm')) icon = 'AI';
    else if (normalizedName.includes('automobile') || normalizedName.includes('ame')) icon = 'Automobile';
    else if (normalizedName.includes('basic science') || normalizedName.includes('bs&h')) icon = 'Science';
    else if (normalizedName.includes('cad') || normalizedName.includes('cam')) icon = 'Mechanical';
    else if (normalizedName.includes('power')) icon = 'Electrical';
    else if (normalizedName.includes('structural')) icon = 'Civil';
    else if (normalizedName.includes('thermal')) icon = 'Mechanical';
    else if (normalizedName.includes('vlsi') || normalizedName.includes('embedded')) icon = 'Electronics';
    else if (normalizedName.includes('bba')) icon = 'Business';
    else if (normalizedName.includes('bca')) icon = 'Computing';
    else if (normalizedName.includes('mba')) icon = 'Management';
    else if (normalizedName.includes('mca')) icon = 'Applications';
    
    // Href mapping - try to match existing routes
    let href = '#';
    if (normalizedName.includes('agriculture')) href = '/agricultural-engineering';
    else if (normalizedName.includes('civil') && level.toLowerCase() === 'diploma') href = '/civil-engineering';
    else if (normalizedName.includes('civil') && level.toLowerCase() === 'ug') href = '/civil-engineering-ug';
    else if ((normalizedName.includes('computer') || normalizedName.includes('cse')) && level.toLowerCase() === 'diploma') href = '/computer-engineering';
    else if ((normalizedName.includes('computer') || normalizedName.includes('cse')) && level.toLowerCase() === 'ug') href = '/programs/engineering/ug/cse';
    else if (normalizedName.includes('datascience') || normalizedName.includes('csd')) href = '/programs/engineering/ug/data-science';
    else if (normalizedName.includes('cyber') || normalizedName.includes('csc')) href = '/programs/engineering/ug/cyber-security';
    else if (normalizedName.includes('machine learning') || normalizedName.includes('csm')) href = '/programs/engineering/ug/aiml';
    else if (normalizedName.includes('ece') && level.toLowerCase() === 'diploma') href = '/electronics-communications-engineering';
    else if (normalizedName.includes('ece') && level.toLowerCase() === 'ug') href = '/electronics-communications-engineering-ug';
    else if (normalizedName.includes('eee') && level.toLowerCase() === 'diploma') href = '/electrical-electronics-engineering';
    else if (normalizedName.includes('eee') && level.toLowerCase() === 'ug') href = '/electrical-electronics-engineering-ug';
    else if (normalizedName.includes('mechanical') && level.toLowerCase() === 'diploma') href = '/mechanical-engineering';
    else if (normalizedName.includes('mechanical') && level.toLowerCase() === 'ug') href = '/mechanical-engineering-ug';
    else if (normalizedName.includes('automobile') || normalizedName.includes('ame')) href = '/automobile-engineering';
    else if (normalizedName.includes('basic science') || normalizedName.includes('bs&h')) href = '/bs-h';
    else if (normalizedName.includes('bba')) href = '/bba';
    else if (normalizedName.includes('bca')) href = '/bca';
    else if (normalizedName.includes('mba')) href = '/mba';
    else if (normalizedName.includes('mca')) href = '/mca';
    
    return { icon, href };
  };

  // Fetch departments and build interestCategories
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await departmentsAPI.getAll();
        // Remove duplicates
        const seen = new Set<string>();
        const unique = departments.filter((dept) => {
          const key = `${dept.name.toLowerCase().trim()}|${dept.stream}|${dept.level}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        
        // Group by stream and level
        const diploma: { name: string; icon: keyof typeof ProgramIcons; href: string }[] = [];
        const engineeringUG: { name: string; icon: keyof typeof ProgramIcons; href: string }[] = [];
        const engineeringPG: { name: string; icon: keyof typeof ProgramIcons; href: string }[] = [];
        const managementUG: { name: string; icon: keyof typeof ProgramIcons; href: string }[] = [];
        const managementPG: { name: string; icon: keyof typeof ProgramIcons; href: string }[] = [];
        
        unique.forEach((dept) => {
          // Clean department name (remove prefix like "DIPLOMA - " or "ENGINEERING UG - ")
          const cleanName = dept.name.replace(/^(DIPLOMA|ENGINEERING|MANAGEMENT)\s*(UG|PG)?\s*-\s*/i, '').trim();
          const mapping = getDepartmentMapping(dept.name, dept.stream, dept.level);
          
          const item = {
            name: cleanName,
            icon: mapping.icon,
            href: mapping.href,
          };
          
          if (dept.stream === 'DIPLOMA') {
            diploma.push(item);
          } else if (dept.stream === 'ENGINEERING') {
            if (dept.level === 'UG') {
              engineeringUG.push(item);
            } else if (dept.level === 'PG') {
              engineeringPG.push(item);
            }
          } else if (dept.stream === 'MANAGEMENT') {
            if (dept.level === 'UG') {
              managementUG.push(item);
            } else if (dept.level === 'PG') {
              managementPG.push(item);
            }
          }
        });
        
        // Sort each category alphabetically by name
        diploma.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        engineeringUG.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        engineeringPG.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        managementUG.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        managementPG.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
        
        setInterestCategories({ 
          diploma, 
          engineering: { ug: engineeringUG, pg: engineeringPG },
          management: { ug: managementUG, pg: managementPG }
        });
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback to empty arrays
        setInterestCategories({ diploma: [], engineering: [], management: [] });
      }
    };
    
    fetchDepartments();
  }, []);

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

      {/* Explore Your Path – Dark theme with black gloss finish */}
      <div id="whats-your-interest" className="relative bg-black py-20 md:py-28 border-t border-slate-800">
        {/* Glossy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-slate-950 opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          {/* Section Header - Centered */}
          <div className="text-center mb-16 md:mb-20">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight uppercase"
              style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '0.05em' }}
            >
              EXPLORE YOUR PATH
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Explore our diverse range of programs designed to shape your future
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setProgramFinderOpen(true)}
                className="group px-6 py-3 rounded-full border-2 border-slate-700 text-slate-300 font-semibold text-sm overflow-hidden transition-all duration-300 hover:border-red-600 hover:text-red-400 hover:bg-red-900/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Programs
                </span>
              </button>
              <button
                onClick={handleAdmissionsClick}
                className="group px-8 py-3 rounded-full bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-700/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

          {/* Split Layout: Stream Names Left, Courses Right */}
          <div className="space-y-20">
            {/* DIPLOMA */}
            {interestCategories.diploma.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Stream Name */}
                <div className="flex items-center lg:items-start lg:sticky lg:top-24">
                  <h3 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase tracking-tight leading-none">
                    DIPLOMA
                  </h3>
                </div>
                
                {/* Right: Courses */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                  {interestCategories.diploma.map((category, idx) => {
                    const IconComponent = ProgramIcons[category.icon];
                    return (
                      <motion.button
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                        onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                        className="group relative h-36 rounded-2xl bg-gradient-to-br from-red-950/90 via-red-900/80 to-red-950 border border-red-800/50 overflow-hidden transition-all duration-500 hover:border-red-700/70 hover:shadow-2xl hover:shadow-red-900/50 hover:-translate-y-2 hover:scale-[1.02]"
                      >
                        {/* Animated gradient background - Maroon/Red */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Glossy shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center p-5 text-center z-10">
                          <div className="mb-3 w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border-2 border-white/30 flex items-center justify-center text-white group-hover:from-white/30 group-hover:via-white/20 group-hover:to-white/10 group-hover:scale-110 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/30 transition-all duration-500">
                            <IconComponent className="w-7 h-7" strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                            {category.name}
                          </span>
                        </div>

                        {/* Hover Arrow with glow */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/30 blur-md rounded-full" />
                              <ArrowRight className="w-5 h-5 text-white relative z-10" />
                            </div>
                        </div>

                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-700/40 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ENGINEERING */}
            {(interestCategories.engineering.ug.length > 0 || interestCategories.engineering.pg.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Stream Name */}
                <div className="flex items-center lg:items-start lg:sticky lg:top-24">
                  <h3 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase tracking-tight leading-none">
                    ENGINEERING
                  </h3>
                </div>
                
                {/* Right: Courses */}
                <div className="space-y-8">
                  {/* UG Courses with B.TECH */}
                  {interestCategories.engineering.ug.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">B.TECH</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                        {interestCategories.engineering.ug.map((category, idx) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <motion.button
                              key={category.name}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: idx * 0.03 }}
                              onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                              className="group relative h-36 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-black border border-slate-700/50 overflow-hidden transition-all duration-500 hover:border-red-700/60 hover:shadow-2xl hover:shadow-red-900/30 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                              {/* Animated gradient background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Glossy shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Content */}
                              <div className="relative h-full flex flex-col items-center justify-center p-5 text-center z-10">
                                <div className="mb-3 w-14 h-14 rounded-xl bg-gradient-to-br from-red-800/30 via-red-700/20 to-red-800/10 border-2 border-red-700/40 flex items-center justify-center text-red-700 group-hover:from-red-700/50 group-hover:via-red-600/40 group-hover:to-red-800/20 group-hover:scale-110 group-hover:border-red-600/60 group-hover:shadow-lg group-hover:shadow-red-700/50 transition-all duration-500">
                                  <IconComponent className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                                  {category.name}
                                </span>
                              </div>

                              {/* Hover Arrow with glow */}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-red-700/30 blur-md rounded-full" />
                                  <ArrowRight className="w-5 h-5 text-red-700 relative z-10" />
                                </div>
                              </div>

                              {/* Corner accent */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-700/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PG Courses with M.TECH */}
                  {interestCategories.engineering.pg.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">M.TECH</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                        {interestCategories.engineering.pg.map((category, idx) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <motion.button
                              key={category.name}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: idx * 0.03 }}
                              onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                              className="group relative h-36 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-black border border-slate-700/50 overflow-hidden transition-all duration-500 hover:border-red-700/60 hover:shadow-2xl hover:shadow-red-900/30 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                              {/* Animated gradient background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Glossy shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Content */}
                              <div className="relative h-full flex flex-col items-center justify-center p-5 text-center z-10">
                                <div className="mb-3 w-14 h-14 rounded-xl bg-gradient-to-br from-red-800/30 via-red-700/20 to-red-800/10 border-2 border-red-700/40 flex items-center justify-center text-red-700 group-hover:from-red-700/50 group-hover:via-red-600/40 group-hover:to-red-800/20 group-hover:scale-110 group-hover:border-red-600/60 group-hover:shadow-lg group-hover:shadow-red-700/50 transition-all duration-500">
                                  <IconComponent className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                                  {category.name}
                                </span>
                              </div>

                              {/* Hover Arrow with glow */}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-red-700/30 blur-md rounded-full" />
                                  <ArrowRight className="w-5 h-5 text-red-700 relative z-10" />
                                </div>
                              </div>

                              {/* Corner accent */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-700/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MANAGEMENT */}
            {(interestCategories.management.ug.length > 0 || interestCategories.management.pg.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Stream Name */}
                <div className="flex items-center lg:items-start lg:sticky lg:top-24">
                  <h3 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase tracking-tight leading-none">
                    MANAGEMENT
                  </h3>
                </div>
                
                {/* Right: Courses */}
                <div className="space-y-8">
                  {/* UG Courses */}
                  {interestCategories.management.ug.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">UNDERGRADUATE</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                        {interestCategories.management.ug.map((category, idx) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <motion.button
                              key={category.name}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: idx * 0.03 }}
                              onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                              className="group relative h-36 rounded-2xl bg-gradient-to-br from-red-950/90 via-red-900/80 to-red-950 border border-red-800/50 overflow-hidden transition-all duration-500 hover:border-red-700/70 hover:shadow-2xl hover:shadow-red-900/50 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                              {/* Animated gradient background - Maroon/Red */}
                              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Glossy shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Content */}
                              <div className="relative h-full flex flex-col items-center justify-center p-5 text-center z-10">
                                <div className="mb-3 w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border-2 border-white/30 flex items-center justify-center text-white group-hover:from-white/30 group-hover:via-white/20 group-hover:to-white/10 group-hover:scale-110 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/30 transition-all duration-500">
                                  <IconComponent className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                                  {category.name}
                                </span>
                              </div>

                              {/* Hover Arrow with glow */}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-white/30 blur-md rounded-full" />
                                  <ArrowRight className="w-5 h-5 text-white relative z-10" />
                                </div>
                              </div>

                              {/* Corner accent */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-700/40 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PG Courses */}
                  {interestCategories.management.pg.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">POSTGRADUATE</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4">
                        {interestCategories.management.pg.map((category, idx) => {
                          const IconComponent = ProgramIcons[category.icon];
                          return (
                            <motion.button
                              key={category.name}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: idx * 0.03 }}
                              onClick={() => { window.scrollTo(0, 0); navigate(category.href); }}
                              className="group relative h-36 rounded-2xl bg-gradient-to-br from-red-950/90 via-red-900/80 to-red-950 border border-red-800/50 overflow-hidden transition-all duration-500 hover:border-red-700/70 hover:shadow-2xl hover:shadow-red-900/50 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                              {/* Animated gradient background - Maroon/Red */}
                              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Glossy shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Content */}
                              <div className="relative h-full flex flex-col items-center justify-center p-5 text-center z-10">
                                <div className="mb-3 w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border-2 border-white/30 flex items-center justify-center text-white group-hover:from-white/30 group-hover:via-white/20 group-hover:to-white/10 group-hover:scale-110 group-hover:border-white/50 group-hover:shadow-lg group-hover:shadow-white/30 transition-all duration-500">
                                  <IconComponent className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                                  {category.name}
                                </span>
                              </div>

                              {/* Hover Arrow with glow */}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-white/30 blur-md rounded-full" />
                                  <ArrowRight className="w-5 h-5 text-white relative z-10" />
                                </div>
                              </div>

                              {/* Corner accent */}
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-700/40 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
              const engineeringUG = filter(interestCategories.engineering.ug);
              const engineeringPG = filter(interestCategories.engineering.pg);
              const managementUG = filter(interestCategories.management.ug);
              const managementPG = filter(interestCategories.management.pg);
              const hasAny = diploma.length > 0 || engineeringUG.length > 0 || engineeringPG.length > 0 || managementUG.length > 0 || managementPG.length > 0;
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
                  {(engineeringUG.length > 0 || engineeringPG.length > 0) && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Engineering</h4>
                      {engineeringUG.length > 0 && (
                        <>
                          <h5 className="text-xs font-medium text-slate-400 mb-2 ml-1">B.TECH</h5>
                          <ul className="space-y-1.5 mb-4">
                            {engineeringUG.map((category) => {
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
                        </>
                      )}
                      {engineeringPG.length > 0 && (
                        <>
                          <h5 className="text-xs font-medium text-slate-400 mb-2 ml-1">M.TECH</h5>
                          <ul className="space-y-1.5">
                            {engineeringPG.map((category) => {
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
                        </>
                      )}
                    </div>
                  )}
                  {(managementUG.length > 0 || managementPG.length > 0) && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Management</h4>
                      {managementUG.length > 0 && (
                        <>
                          <h5 className="text-xs font-medium text-slate-400 mb-2 ml-1">Undergraduate</h5>
                          <ul className="space-y-1.5 mb-4">
                            {managementUG.map((category) => {
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
                        </>
                      )}
                      {managementPG.length > 0 && (
                        <>
                          <h5 className="text-xs font-medium text-slate-400 mb-2 ml-1">Postgraduate</h5>
                          <ul className="space-y-1.5">
                            {managementPG.map((category) => {
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
                        </>
                      )}
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