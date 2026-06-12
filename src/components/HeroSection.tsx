import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Plus,
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
import { useState, useEffect, useRef, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { heroVideosAPI, departmentsAPI, explorePathVideoSettingsAPI } from '@/lib/api';
import { convertGoogleDriveLink, convertGoogleDriveToDownload, getGoogleDrivePreviewEmbedUrl, isGoogleDriveLink } from '@/lib/googleDriveUtils';
import NewsAnnouncementsSection from '@/components/NewsAnnouncementsSection';
import ScrollingTicker from '@/components/ScrollingTicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ADMISSIONS_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form';
const ECAP_URL = 'https://webprosindia.com/viet/Default.aspx?ReturnUrl=%2fviet';
const CAMU_STAFF_URL = 'https://camu.in/';
const CAMU_STUDENT_URL = 'https://www.mycamu.co.in/#/';

const HERO_QUICK_LINKS = [
  { id: 'programmes', label: 'Programmes', bg: '#F58220', icon: 'plus' as const },
  { id: 'admissions', label: 'Admissions', bg: '#4D545D', icon: 'plus' as const },
  { id: 'apply', label: 'Apply Now', bg: '#76B82A', icon: 'chevron' as const },
  { id: 'vibe', label: 'Vibe@VIET', bg: '#00AEEF', icon: 'plus' as const },
  { id: 'portal', label: 'Portal', bg: '#00969D', icon: 'plus' as const },
];

const heroQuickBoxClass =
  "group relative w-full flex items-center justify-between gap-2 px-4 py-3 lg:py-3.5 text-left text-white font-semibold text-[0.8125rem] lg:text-sm tracking-[0.02em] shadow-[0_3px_10px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out hover:brightness-110 hover:-translate-x-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.28)] active:brightness-95 active:translate-x-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-2px]";

function HeroQuickLinkIcon({ icon }: { icon: 'plus' | 'chevron' }) {
  if (icon === 'chevron') {
    return (
      <ChevronRight
        className="w-4 h-4 shrink-0 opacity-95 transition-transform duration-300 ease-out group-hover:translate-x-1"
        strokeWidth={2.5}
        aria-hidden
      />
    );
  }
  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
      <Plus
        className="h-4 w-4 opacity-95 transition-transform duration-300 ease-out group-hover:rotate-45"
        strokeWidth={2.5}
      />
    </span>
  );
}

function HeroQuickLinkBox({
  label,
  bg,
  icon,
  onClick,
}: {
  label: string;
  bg: string;
  icon: 'plus' | 'chevron';
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={heroQuickBoxClass} style={{ backgroundColor: bg }}>
      <span className="drop-shadow-sm">{label}</span>
      <HeroQuickLinkIcon icon={icon} />
    </button>
  );
}

function HeroQuickLinks({
  onProgrammes,
  onVibeAtViet,
}: {
  onProgrammes: () => void;
  onVibeAtViet: () => void;
}) {
  const openAdmissions = () => window.open(ADMISSIONS_FORM_URL, '_blank', 'noopener,noreferrer');

  const actions: Record<string, () => void> = {
    programmes: onProgrammes,
    admissions: openAdmissions,
    apply: openAdmissions,
    vibe: onVibeAtViet,
  };

  const portalLink = HERO_QUICK_LINKS.find((l) => l.id === 'portal')!;

  return (
    <>
      {/* Desktop — REVA-style vertical stack, sharp edges, visible gaps */}
      <nav
        className="hidden md:flex absolute right-0 top-[6.25rem] lg:top-[6.5rem] z-20 flex-col gap-[3px] w-[168px] lg:w-[182px]"
        aria-label="Quick links"
      >
        {HERO_QUICK_LINKS.filter((l) => l.id !== 'portal').map((link) => (
          <HeroQuickLinkBox
            key={link.id}
            label={link.label}
            bg={link.bg}
            icon={link.icon}
            onClick={actions[link.id]}
          />
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={heroQuickBoxClass}
              style={{ backgroundColor: portalLink.bg }}
            >
              <span className="drop-shadow-sm">{portalLink.label}</span>
              <HeroQuickLinkIcon icon="plus" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="left"
            sideOffset={8}
            className="w-56 p-2 z-[30] rounded-sm border-slate-200 shadow-xl"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] px-2 py-2">
              Portal login
            </p>
            <a
              href={CAMU_STUDENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-sm"
            >
              Student Login
            </a>
            <a
              href={CAMU_STAFF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-sm"
            >
              Staff Login
            </a>
            <a
              href={ECAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-sm"
            >
              ECAP Login
            </a>
          </PopoverContent>
        </Popover>
      </nav>

      {/* Mobile — Same vertical stack on the right side, smaller size */}
      <nav
        className="md:hidden absolute right-0 top-[4.5rem] z-20 flex flex-col gap-[2px] w-[110px] sm:w-[130px]"
        aria-label="Quick links"
      >
        {HERO_QUICK_LINKS.filter((l) => l.id !== 'portal').map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={actions[link.id]}
            className="group relative w-full flex items-center justify-between gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5 text-left text-white font-semibold text-[10px] sm:text-[11px] tracking-[0.02em] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-[0.97] active:brightness-95 touch-manipulation"
            style={{ backgroundColor: link.bg }}
          >
            <span className="drop-shadow-sm">{link.label}</span>
            {link.icon === 'chevron' ? (
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90" strokeWidth={2.5} aria-hidden />
            ) : (
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90" strokeWidth={2.5} aria-hidden />
            )}
          </button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group relative w-full flex items-center justify-between gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5 text-left text-white font-semibold text-[10px] sm:text-[11px] tracking-[0.02em] shadow-[0_2px_8px_rgba(0,0,0,0.2)] touch-manipulation"
              style={{ backgroundColor: portalLink.bg }}
            >
              <span className="drop-shadow-sm">{portalLink.label}</span>
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90" strokeWidth={2.5} aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" side="left" sideOffset={4} className="w-48 p-2 z-[30] rounded-sm">
            <a
              href={CAMU_STUDENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-2 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Student Login
            </a>
            <a
              href={CAMU_STAFF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-2 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Staff Login
            </a>
            <a
              href={ECAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-2 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              ECAP Login
            </a>
          </PopoverContent>
        </Popover>
      </nav>
    </>
  );
}

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

type HeroVideoRecord = {
  src?: string | null;
  poster?: string | null;
  mobileSrc?: string | null;
  mobilePoster?: string | null;
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
};

type HeroSlide = {
  type: 'video' | 'image';
  src: string;
  embedUrl?: string;
  poster?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonAction: () => void;
};

function buildHeroSlide(
  videoRaw: string | undefined,
  photoRaw: string | undefined,
  meta: Omit<HeroVideoRecord, 'src' | 'poster' | 'mobileSrc' | 'mobilePoster' | 'order'>
): HeroSlide | null {
  const hasVideo = Boolean(videoRaw?.trim());
  const photoUrl = photoRaw?.trim() ? convertGoogleDriveLink(photoRaw) : undefined;
  const title = meta.title?.trim() || undefined;
  const subtitle = meta.subtitle?.trim() || undefined;
  const buttonText = meta.buttonText?.trim() || undefined;
  const buttonAction = meta.buttonLink?.trim()
    ? () => window.open(
        meta.buttonLink!,
        meta.buttonLink!.startsWith('http') ? '_blank' : '_self'
      )
    : () => {};

  if (!hasVideo && photoUrl) {
    return {
      type: 'image',
      src: photoUrl,
      poster: photoUrl,
      badge: meta.badge || undefined,
      title,
      subtitle,
      buttonText,
      buttonAction,
    };
  }

  if (!hasVideo) return null;

  const isDrive = isGoogleDriveLink(videoRaw!);
  return {
    type: 'video',
    src: convertGoogleDriveToDownload(videoRaw!),
    embedUrl: isDrive ? getGoogleDrivePreviewEmbedUrl(videoRaw!) : undefined,
    poster: photoUrl,
    badge: meta.badge || undefined,
    title,
    subtitle,
    buttonText,
    buttonAction,
  };
}

function buildHeroSlidesForViewport(videos: HeroVideoRecord[], isMobile: boolean): HeroSlide[] {
  const sorted = videos.slice().sort((a, b) => (Number(a.order) ?? 0) - (Number(b.order) ?? 0));
  return sorted
    .map((video) =>
      buildHeroSlide(
        isMobile ? video.mobileSrc?.trim() : video.src?.trim(),
        isMobile ? video.mobilePoster?.trim() : video.poster?.trim(),
        video
      )
    )
    .filter((slide): slide is HeroSlide => slide !== null);
}

const EXPLORE_PATH_VIDEO_FALLBACK =
  import.meta.env.VITE_BGVIDEOEXP_URL || `${import.meta.env.BASE_URL}bgvideoexp.mp4`.replace(/\/{2,}/g, '/');

function ExplorePathVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState(EXPLORE_PATH_VIDEO_FALLBACK);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    explorePathVideoSettingsAPI
      .get()
      .then((settings: { video_url?: string | null }) => {
        if (!cancelled && settings?.video_url) {
          setVideoSrc(settings.video_url);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => v.play().catch(() => {});
    v.addEventListener('loadeddata', play);
    v.addEventListener('canplay', play);
    v.load();
    return () => {
      v.removeEventListener('loadeddata', play);
      v.removeEventListener('canplay', play);
    };
  }, [videoSrc]);

  if (useFallback) return null;

  return (
    <video
      key={videoSrc}
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover z-0"
      aria-hidden
      src={videoSrc}
      onError={() => {
        if (videoSrc !== EXPLORE_PATH_VIDEO_FALLBACK) {
          setVideoSrc(EXPLORE_PATH_VIDEO_FALLBACK);
          return;
        }
        setUseFallback(true);
      }}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}

type ExploreProgram = { name: string; icon: keyof typeof ProgramIcons; href: string };
type ExploreProgramGroup = { label?: string; items: ExploreProgram[] };

function getExploreDensity(count: number) {
  if (count >= 11) {
    return {
      heading: 'text-sm md:text-base',
      sublabel: 'text-[9px]',
      item: 'text-[10px] leading-tight',
      gap: 'gap-0.5',
      iconBox: 'w-5 h-5',
      icon: 'w-2.5 h-2.5',
      itemPad: 'py-1 px-1.5',
    };
  }
  if (count >= 8) {
    return {
      heading: 'text-base md:text-lg',
      sublabel: 'text-[10px]',
      item: 'text-[11px] leading-snug',
      gap: 'gap-1',
      iconBox: 'w-6 h-6',
      icon: 'w-3 h-3',
      itemPad: 'py-1 px-2',
    };
  }
  if (count >= 5) {
    return {
      heading: 'text-lg md:text-xl',
      sublabel: 'text-[11px]',
      item: 'text-xs leading-snug',
      gap: 'gap-1.5',
      iconBox: 'w-7 h-7',
      icon: 'w-3.5 h-3.5',
      itemPad: 'py-1.5 px-2',
    };
  }
  return {
    heading: 'text-xl md:text-2xl',
    sublabel: 'text-xs',
    item: 'text-sm leading-snug',
    gap: 'gap-2',
    iconBox: 'w-8 h-8',
    icon: 'w-4 h-4',
    itemPad: 'py-2 px-2.5',
  };
}

const EXPLORE_COLUMN_BORDERS = [
  'border-b sm:border-b sm:border-r lg:border-b-0 lg:border-r border-white/20',
  'border-b sm:border-b lg:border-b-0 lg:border-r border-white/20',
  'border-b sm:border-r lg:border-b-0 lg:border-r border-white/20',
  '',
] as const;

function ExplorePathStreamColumn({
  title,
  groups,
  columnIndex,
  onSelect,
}: {
  title: string;
  groups: ExploreProgramGroup[];
  columnIndex: number;
  onSelect: (href: string) => void;
}) {
  const totalCount = groups.reduce((sum, group) => sum + group.items.length, 0);
  const density = getExploreDensity(totalCount);

  return (
    <div
      className={`flex flex-1 flex-col min-h-0 min-w-0 px-3 sm:px-4 lg:px-5 py-4 lg:py-3 ${EXPLORE_COLUMN_BORDERS[columnIndex] ?? ''}`}
    >
      <div className="text-center mb-3 shrink-0">
        <h3
          className={`${density.heading} font-bold text-white uppercase tracking-[0.12em]`}
          style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
        <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden />
      </div>

      <div className={`flex flex-col flex-1 min-h-0 ${density.gap}`}>
        {totalCount === 0 ? (
          <p className={`${density.item} text-white/40 text-center py-4`}>Coming soon</p>
        ) : (
          groups.map((group, groupIdx) => (
            <div key={group.label ?? groupIdx} className={groupIdx > 0 ? 'mt-1' : ''}>
              {group.label && (
                <p className={`${density.sublabel} font-medium text-white/45 uppercase tracking-wider mb-1 text-center`}>
                  {group.label}
                </p>
              )}
              <ul className={`flex flex-col ${density.gap}`}>
                {group.items.map((program) => {
                  const IconComponent = ProgramIcons[program.icon];
                  return (
                    <li key={program.name}>
                      <button
                        type="button"
                        onClick={() => onSelect(program.href)}
                        className={`group w-full flex items-center gap-2 rounded-lg ${density.itemPad} text-left bg-white/[0.04] border border-white/[0.08] hover:bg-white/10 hover:border-white/20 transition-all duration-200`}
                      >
                        <span
                          className={`shrink-0 ${density.iconBox} rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-white/80 group-hover:bg-white/20 group-hover:text-white transition-colors`}
                        >
                          <IconComponent className={density.icon} strokeWidth={2} />
                        </span>
                        <span className={`flex-1 min-w-0 ${density.item} font-medium text-white/90 group-hover:text-white line-clamp-2`}>
                          {program.name}
                        </span>
                        <ChevronRight className="w-3 h-3 shrink-0 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const HeroSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  /** Fallback image shown only when video is unsupported (e.g. format not playable). */
  const [unsupportedVideoSlides, setUnsupportedVideoSlides] = useState<Set<number>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [heroVideoRecords, setHeroVideoRecords] = useState<HeroVideoRecord[]>([]);
  const heroSlides = useMemo(
    () => buildHeroSlidesForViewport(heroVideoRecords, isMobile),
    [heroVideoRecords, isMobile]
  );
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
        setInterestCategories({ diploma: [], engineering: { ug: [], pg: [] }, management: { ug: [], pg: [] } });
      }
    };
    
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await heroVideosAPI.getAll();
        setHeroVideoRecords(Array.isArray(videos) ? videos : []);
      } catch (error) {
        console.error('Error fetching hero videos:', error);
        setHeroVideoRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
    setUnsupportedVideoSlides(new Set());
    videoRefs.current = [];
  }, [isMobile, heroVideoRecords]);

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

  // When slide changes: pause every other video, then play the current one. All videos have real src from mount.
  useEffect(() => {
    const onIntroComplete = () => {
      const video = videoRefs.current[currentSlide];
      if (video) video.play().catch(() => {});
    };

    const pauseOtherVideos = () => {
      videoRefs.current.forEach((el, i) => {
        if (el && i !== currentSlide) {
          el.pause();
          el.currentTime = 0;
        }
      });
    };

    pauseOtherVideos();
    const video = videoRefs.current[currentSlide];
    if (video) {
      const play = () => video.play().catch(() => {});
      if (video.readyState >= 2) {
        play();
      } else {
        video.addEventListener('canplay', play, { once: true });
        video.addEventListener('loadeddata', play, { once: true });
        video.addEventListener('error', () => {}, { once: true });
      }
    }

    window.addEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
    return () => window.removeEventListener(INTRO_COMPLETE_EVENT, onIntroComplete);
  }, [currentSlide, heroSlides.length]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
            <p className="text-xl">Add hero videos or photos through the admin panel</p>
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
                slide.embedUrl ? (
                  <iframe
                    src={slide.embedUrl}
                    title={slide.title}
                    className="absolute inset-0 w-full h-full object-cover border-0 pointer-events-none"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : unsupportedVideoSlides.has(index) && slide.poster ? (
                  <img
                    src={slide.poster}
                    alt={slide.title || 'Hero slide'}
                    className="w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                ) : unsupportedVideoSlides.has(index) ? null : (
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    className="w-full h-full object-cover bg-black"
                    autoPlay={index === currentSlide}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    width={1920}
                    height={1080}
                    onError={() =>
                      setUnsupportedVideoSlides((prev) => new Set(prev).add(index))
                    }
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                )
              ) : (
                <img
                  src={slide.src}
                  alt={slide.title || 'Hero slide'}
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                />
              )}
              
              {/* Gradient overlay – only when slide has text content */}
              {(slide.badge || slide.title || slide.subtitle || slide.buttonText) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              )}
              
              {/* Content Overlay - Left Bottom Corner */}
              {(slide.badge || slide.title || slide.subtitle || slide.buttonText) && (
              <div className={`absolute inset-0 flex items-end transition-opacity duration-300 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 pb-24 sm:pb-20 md:pb-28 lg:pb-28 md:pr-44 lg:pr-48">
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
                    {slide.title && (
                      <h1
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
                        style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}
                      >
                        {slide.title}
                      </h1>
                    )}
                    
                    {/* Subtitle */}
                    {slide.subtitle && (
                      <p
                        className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-xl"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {slide.subtitle}
                      </p>
                    )}
                    
                    {/* CTA Button */}
                    {slide.buttonText && (
                      <button
                        onClick={slide.buttonAction}
                        className="group relative px-8 py-3.5 bg-white text-[#0a192f] font-semibold text-base rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {slide.buttonText}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>
          ))}

          <HeroQuickLinks
            onProgrammes={() => scrollToSection('whats-your-interest')}
            onVibeAtViet={() => scrollToSection('vibe-at-viet')}
          />

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
          <div className="absolute bottom-6 md:bottom-8 right-6 md:right-48 lg:right-52 z-20 text-white/70 text-sm font-medium">
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

      {/* Explore Your Path – four streams visible at once */}
      <div id="whats-your-interest" className="relative overflow-hidden py-8 md:py-10 border-t border-slate-800 min-h-[560px] md:min-h-[540px] lg:h-[580px] bg-slate-900">
        <ExplorePathVideo />
        <div className="absolute inset-0 bg-black/40 z-[1]" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-[1]" aria-hidden />

        <div className="container mx-auto px-4 md:px-8 lg:px-10 relative z-10 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8 shrink-0"
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}
            >
              Explore Your Path
            </h2>
            <div className="mt-3 h-px w-20 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden />
          </motion.div>

          <div className="flex-1 min-h-0 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md shadow-2xl shadow-black/30 overflow-hidden">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row h-full min-h-0">
              {(() => {
                const managementGroups: ExploreProgramGroup[] = [];
                if (interestCategories.management.ug.length > 0) {
                  managementGroups.push({ label: 'Undergraduate', items: interestCategories.management.ug });
                }
                if (interestCategories.management.pg.length > 0) {
                  managementGroups.push({ label: 'Postgraduate', items: interestCategories.management.pg });
                }

                const streams = [
                  { id: 'diploma', title: 'Diploma', groups: [{ items: interestCategories.diploma }] },
                  { id: 'btech', title: 'B.Tech', groups: [{ items: interestCategories.engineering.ug }] },
                  { id: 'mtech', title: 'M.Tech', groups: [{ items: interestCategories.engineering.pg }] },
                  { id: 'management', title: 'Management', groups: managementGroups },
                ];

                const handleProgramSelect = (href: string) => {
                  window.scrollTo(0, 0);
                  navigate(href);
                };

                return streams.map((stream, index) => (
                  <ExplorePathStreamColumn
                    key={stream.id}
                    title={stream.title}
                    groups={stream.groups}
                    columnIndex={index}
                    onSelect={handleProgramSelect}
                  />
                ));
              })()}
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
                                <div className="shrink-0 w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
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
                                    <div className="shrink-0 w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
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
                                    <div className="shrink-0 w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
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
                                    <div className="shrink-0 w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
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
                                    <div className="shrink-0 w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500">
                                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
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