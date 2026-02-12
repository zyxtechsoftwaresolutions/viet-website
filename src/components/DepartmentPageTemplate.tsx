import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaderPageNavbar from '@/components/LeaderPageNavbar';
import Footer from '@/components/Footer';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import { facultyAPI, hodsAPI, galleryAPI, departmentPagesAPI } from '@/lib/api';
import { convertGoogleDriveLink, convertGoogleDriveToDownload } from '@/lib/googleDriveUtils';
import { getVideoEmbedUrl, isVideoUrl } from '@/lib/videoUtils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  ExternalLink,
  Target,
  Sparkles,
  FileText,
  Users,
  GraduationCap,
  Award,
  Building2,
  Cpu,
  Wifi,
  Library,
  FlaskConical,
  Lightbulb,
  Briefcase,
  Code,
  BookOpen,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '') || 'http://localhost:3001';
const DEFAULT_ADMISSIONS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfzvrY5qJTPfzBiW1UU1JZAvNAN8qcjv07v6lWSc1Xe0X-wvw/viewform?usp=send_form';
import { imgUrl } from '@/lib/imageUtils';

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'vision-mission', label: 'Vision & Mission' },
  { id: 'hod', label: 'Head of Department' },
  { id: 'courses', label: 'Programs Offered' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'fee', label: 'Fee Structure' },
  { id: 'program-overview', label: 'Program Overview' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'why-viet', label: 'Why VIET' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'projects', label: 'Projects' },
  { id: 'placements', label: 'Placements' },
  { id: 'rd', label: 'R&D' },
  { id: 'idea-cell', label: 'Idea Cell' },
  { id: 'club-activities', label: 'Club Activities' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'alumni', label: 'Alumni' },
] as const;

function SectionHead({ label, title, accent = 'blue' }: { label: string; title: string; accent?: 'blue' | 'emerald' | 'violet' | 'amber' }) {
  const accentStyles = {
    blue: { label: 'text-blue-600', line: 'bg-blue-400' },
    emerald: { label: 'text-emerald-600', line: 'bg-emerald-400' },
    violet: { label: 'text-violet-600', line: 'bg-violet-400' },
    amber: { label: 'text-amber-600', line: 'bg-amber-400' },
  };
  const s = accentStyles[accent];
  return (
    <>
      <p className={`text-[11px] md:text-xs font-semibold tracking-[0.25em] ${s.label} uppercase mb-2`}>{label}</p>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">{title}</h2>
      <div className={`h-px w-14 ${s.line} mt-6 mb-10`} />
    </>
  );
}

function renderContent(content: string | undefined) {
  if (!content || !content.trim()) return null;
  const trimmed = content.trim();
  if (trimmed.startsWith('<')) {
    return <div className="prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: trimmed }} />;
  }
  return <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{trimmed}</div>;
}

function commaList(text: string | undefined): string[] {
  if (!text || !text.trim()) return [];
  return text.split(',,,').map((s) => s.trim()).filter(Boolean);
}

// CSE-family: CSE, CSD, CSC, CSM — HODs are per-department; faculty are shared across all four.
const CSE_FAMILY_SLUGS = ['cse', 'data-science', 'cyber-security', 'aiml'] as const;

function isCSEOnly(department: string): boolean {
  const d = (department || '').toLowerCase();
  return (
    (d.includes('computer science and engineering (cse)') ||
      d === 'cse' ||
      (d.includes('computer science') && d.includes('(cse)') && !d.includes('cyber') && !d.includes('datascience') && !d.includes('machinelearning'))) &&
    !d.includes('(csc)') && !d.includes('(csd)') && !d.includes('(csm)')
  );
}

function isCSDOnly(department: string): boolean {
  const d = (department || '').toLowerCase();
  return (
    d.includes('cse datascience (csd)') ||
    d.includes('datascience (csd)') ||
    (d.includes('data science') && d.includes('(csd)')) ||
    d === 'csd'
  );
}

function isCSCOnly(department: string): boolean {
  const d = (department || '').toLowerCase();
  return (
    d.includes('cse cybersecurity (csc)') ||
    d.includes('cybersecurity (csc)') ||
    (d.includes('cyber') && d.includes('(csc)')) ||
    d === 'csc'
  );
}

function isCSMOnly(department: string): boolean {
  const d = (department || '').toLowerCase();
  return (
    d.includes('cse machinelearning (csm)') ||
    d.includes('machinelearning (csm)') ||
    (d.includes('machine learning') && d.includes('(csm)')) ||
    (d.includes('aiml') && d.includes('(csm)')) ||
    d === 'csm'
  );
}

/** True if department is one of CSE, CSD, CSC, CSM (shared faculty pool). */
function isCSEFamilyDepartment(department: string): boolean {
  return isCSEOnly(department) || isCSDOnly(department) || isCSCOnly(department) || isCSMOnly(department);
}

/** Returns a filter that matches only the HOD for the given CSE-family slug. */
function getHodFilterForSlug(slug: string): (department: string) => boolean {
  switch (slug) {
    case 'cse':
      return isCSEOnly;
    case 'data-science':
      return isCSDOnly;
    case 'cyber-security':
      return isCSCOnly;
    case 'aiml':
      return isCSMOnly;
    default:
      return () => false;
  }
}

// Adaptive grid layout based on number of images (1-10)
// Automatically adjusts photo sizes to create a balanced grid
function getAdaptiveGalleryLayout(count: number): { gridCols: string; items: Array<{ colSpan: string; rowSpan: string }> } {
  // Mobile: always 2 columns, Desktop: adaptive based on count
  const layouts: Record<number, { gridCols: string; items: Array<{ colSpan: string; rowSpan: string }> }> = {
    1: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' }
      ]
    },
    2: {
      gridCols: 'grid-cols-1 md:grid-cols-2',
      items: [
        { colSpan: 'col-span-1', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1 md:row-span-2' }
      ]
    },
    3: {
      gridCols: 'grid-cols-2 md:grid-cols-3',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    4: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      items: [
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    5: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    6: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    7: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    8: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    9: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    },
    10: {
      gridCols: 'grid-cols-2 md:grid-cols-5',
      items: [
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1 md:row-span-2' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' },
        { colSpan: 'col-span-1', rowSpan: 'row-span-1' }
      ]
    }
  };
  
  // Clamp count between 1 and 10
  const clampedCount = Math.min(Math.max(count, 1), 10);
  return layouts[clampedCount] || layouts[1];
}

type DeptPageData = {
  sections?: Record<string, any>;
  curriculum?: { programs: Array<{ name: string; regulations: Array<{ name: string; fileUrl: string; fileName?: string }> }> };
};

export type DepartmentPageTemplateProps = {
  slug: string;
  backHref?: string;
  galleryFilter?: (img: { department?: string }) => boolean;
  facultyFilter?: (department: string) => boolean;
};

const DepartmentPageTemplate: React.FC<DepartmentPageTemplateProps> = ({
  slug,
  backHref = '/btech',
  galleryFilter,
  facultyFilter,
}) => {
  const navigate = useNavigate();
  const [activeNavId, setActiveNavId] = useState<string>('overview');
  const [galleryImages, setGalleryImages] = useState<Array<{ src: string; alt: string }>>([]);
  const [allGalleryImages, setAllGalleryImages] = useState<Array<{ src: string; alt: string }>>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [hods, setHods] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syllabusProgram, setSyllabusProgram] = useState<string>('');
  const [deptPage, setDeptPage] = useState<DeptPageData | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await departmentPagesAPI.getBySlug(slug);
        setDeptPage(data);
        const programs = data?.curriculum?.programs ?? [];
        if (programs.length > 0) setSyllabusProgram(programs[0].name);
        else setSyllabusProgram('');
      } catch (_) {
        setSyllabusProgram('');
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const all = await galleryAPI.getAll();
        const filter = galleryFilter ?? (() => true);
        const filtered = all.filter((img: any) => filter(img));
        if (filtered.length) {
          const mappedImages = filtered.map((img: any) => {
            const raw = (img.src || '').trim();
            const src = raw.startsWith('http') ? convertGoogleDriveLink(raw) : (raw.startsWith('/') ? `${API_BASE}${raw}` : `${API_BASE}/${raw}`);
            return { src, alt: img.alt || 'Gallery' };
          });
          setAllGalleryImages(mappedImages);
          // Show only first 10 images in the preview
          setGalleryImages(mappedImages.slice(0, 10));
        }
      } catch (_) {}
    };
    const loadFaculty = async () => {
      try {
        const [f, h] = await Promise.all([facultyAPI.getAll(), hodsAPI.getAll()]);
        const isCSEFamily = CSE_FAMILY_SLUGS.includes(slug as any);
        if (isCSEFamily) {
          // HODs: only this page's department (CSE / CSD / CSC / CSM)
          const hodFilter = getHodFilterForSlug(slug);
          setHods(h.filter((x: any) => hodFilter(x.department || '')));
          // Faculty: shared across CSE, CSD, CSC, CSM — show anyone in any of these four
          setFaculty(f.filter((x: any) => isCSEFamilyDepartment(x.department || '')));
        } else {
          const deptFilter = facultyFilter ?? (() => true);
          setFaculty(f.filter((x: any) => deptFilter(x.department || '')));
          setHods(h.filter((x: any) => deptFilter(x.department || '')));
        }
      } catch (_) {}
    };
    loadGallery();
    loadFaculty();
  }, [slug, galleryFilter, facultyFilter]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveNavId(e.target.id);
            break;
          }
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 }
    );
    const t = setTimeout(() => {
      NAV_SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 150);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveNavId(id);
  };

  const openImageModal = (src: string) => {
    const i = galleryImages.findIndex((img) => img.src === src);
    setCurrentImageIndex(i >= 0 ? i : 0);
    setSelectedImage(src);
    setIsModalOpen(true);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  const goPrev = () => {
    const p = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    setCurrentImageIndex(p);
    setSelectedImage(galleryImages[p]?.src || null);
  };
  const goNext = () => {
    const n = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(n);
    setSelectedImage(galleryImages[n]?.src || null);
  };

  const s = deptPage?.sections ?? {};
  const hero = s.hero ?? {};
  const heroImage = hero.image;
  const heroImageUrl = heroImage ? (heroImage.startsWith('http') ? convertGoogleDriveLink(heroImage) : `${API_BASE}${heroImage}`) : null;
  const heroVideoRaw = (hero as { video?: string }).video?.trim() || '';
  const heroVideoInfo = heroVideoRaw && isVideoUrl(heroVideoRaw) ? getVideoEmbedUrl(heroVideoRaw) : null;
  const heroVideoIsEmbed = heroVideoInfo && ['youtube', 'instagram', 'vimeo', 'googledrive'].includes(heroVideoInfo.platform);
  const heroVideoEmbedUrl = heroVideoIsEmbed ? heroVideoInfo!.embedUrl : null;
  const heroVideoDirectUrl = (() => {
    if (!heroVideoRaw) return null;
    if (heroVideoInfo && heroVideoIsEmbed) return null;
    if (isVideoUrl(heroVideoRaw)) {
      return heroVideoRaw.includes('drive.google.com') ? convertGoogleDriveToDownload(heroVideoRaw) : heroVideoRaw;
    }
    return heroVideoRaw.startsWith('/') ? `${API_BASE}${heroVideoRaw}` : `${API_BASE}/${heroVideoRaw}`;
  })();
  const admissionLink = s.admission?.link || DEFAULT_ADMISSIONS_URL;

  const curriculumPrograms = deptPage?.curriculum?.programs ?? [];
  const curriculumFromApi = curriculumPrograms.length > 0;
  const apiProgramNames = curriculumPrograms.map((p) => p.name);
  const selectedApiProgram = curriculumPrograms.find((p) => p.name === syllabusProgram);
  const apiRegulations = selectedApiProgram?.regulations ?? [];

  const coursesCategories = Array.isArray(s.courses?.categories) ? s.courses.categories : [];
  const feeItems = Array.isArray(s.fee?.items) ? s.fee.items : [];
  const peosList = commaList(s.programOverview?.peos);
  const psosList = commaList(s.programOverview?.psos);
  const posBadges = Array.isArray(s.programOverview?.posBadges) ? s.programOverview.posBadges : [];
  const whyChooseList = commaList(s.overview?.whyChoose);
  const missionList = commaList(s.visionMission?.mission);

  // Faculty list includes HODs first, then faculty; dedupe by name so same person appears once
  const facultyWithHods = useMemo(() => {
    const seen = new Set<string>();
    const result: any[] = [];
    for (const h of hods) {
      const key = (h.name || '').trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push({ ...h, _listKey: `hod-${h.id}` });
    }
    for (const f of faculty) {
      const key = (f.name || '').trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push({ ...f, _listKey: `faculty-${f.id}` });
    }
    return result;
  }, [hods, faculty]);

  return (
    <div className="min-h-screen bg-slate-50">
      <LeaderPageNavbar backHref={backHref} />

      {/* Hero */}
      <section
        className="relative min-h-[65vh] md:min-h-[72vh] pt-28 md:pt-32 pb-14 md:pb-18 flex items-end text-white overflow-hidden"
        style={
          !heroVideoEmbedUrl && !heroVideoDirectUrl && heroImageUrl
            ? { background: `linear-gradient(160deg, rgba(15,23,42,0.85) 0%, rgba(30,58,95,0.8) 45%, rgba(15,23,42,0.85) 100%), url(${heroImageUrl}) center/cover` }
            : !heroVideoEmbedUrl && !heroVideoDirectUrl
            ? { background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #0f172a 100%)' }
            : undefined
        }
      >
        {heroVideoEmbedUrl && (
          <div className="absolute inset-0 z-0">
            <iframe
              src={heroVideoEmbedUrl}
              title="Department hero video"
              className="absolute top-1/2 left-1/2 w-[100vmax] h-[56.25vmax] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        )}
        {heroVideoDirectUrl && !heroVideoEmbedUrl && (
          <div className="absolute inset-0 z-0">
            <video
              src={heroVideoDirectUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={heroImageUrl || undefined}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent z-[1]" aria-hidden />
        <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
          {(hero.badge || hero.title || hero.subtitle) && (
            <>
              {hero.badge && (
                <motion.p
                  className="inline-block px-3 py-1 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white/80 border border-white/25 rounded-full mb-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {hero.badge}
                </motion.p>
              )}
              {hero.title && (
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  {hero.title}
                </motion.h1>
              )}
              {hero.subtitle && (
                <motion.p
                  className="text-base md:text-lg text-white/90 max-w-2xl mb-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {hero.subtitle}
                </motion.p>
              )}
              {(hero.buttonText || hero.buttonLink) && (
                <motion.a
                  href={hero.buttonLink || admissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white bg-primary hover:bg-primary/90 transition-colors text-sm"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  {hero.buttonText || 'Apply Now'}
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </>
          )}
          {!hero.badge && !hero.title && !hero.subtitle && (
            <motion.p
              className="text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Content for this department can be edited in the Admin → Department Pages.
            </motion.p>
          )}
        </div>
      </section>

      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex gap-0 overflow-x-auto py-2.5 scrollbar-hide md:justify-between">
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex-shrink-0 px-2 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap md:flex-1 ${
                  activeNavId === id ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Overview */}
      <section id="overview" ref={(el) => { sectionRefs.current['overview'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Overview" title={s.overview?.title || 'Overview'} accent="blue" />
          {renderContent(s.overview?.content)}
          {whyChooseList.length > 0 && (
            <div className="mt-10 p-6 md:p-8 rounded-2xl border border-blue-200 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Why choose us?</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-slate-600 text-sm">
                {whyChooseList.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!s.overview?.title && !s.overview?.content && whyChooseList.length === 0 && (
            <p className="text-slate-500 text-sm">Overview content can be edited in the Admin panel.</p>
          )}
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" ref={(el) => { sectionRefs.current['vision-mission'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Vision & Mission" title="Vision & Mission" accent="emerald" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 md:p-8 rounded-2xl border border-blue-200 bg-blue-50/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Vision</h3>
              </div>
              {s.visionMission?.vision ? (
                <p className="text-slate-600 italic leading-relaxed">{s.visionMission.vision}</p>
              ) : (
                <p className="text-slate-500 text-sm">Vision can be edited in the Admin panel.</p>
              )}
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Mission</h3>
              </div>
              {missionList.length > 0 ? (
                <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                  {missionList.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600 shrink-0">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              ) : s.visionMission?.mission ? (
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{s.visionMission.mission}</p>
              ) : (
                <p className="text-slate-500 text-sm">Mission can be edited in the Admin panel.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Head of Department */}
      <section id="hod" ref={(el) => { sectionRefs.current['hod'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Head of Department" title="Head of Department" accent="violet" />
          {hods.length > 0 ? (
            <div className="space-y-12">
              {hods.map((hod: any, index: number) => (
                <div key={hod.id} className={`grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start ${index === 0 && s.hod?.message ? '' : 'md:grid-cols-1'}`}>
                  {/* Left: HOD Image and Details */}
                  <div className="flex flex-col items-center md:items-start">
                    {/* Large HOD Image */}
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg mb-6 overflow-hidden bg-slate-100 shadow-lg">
                      {hod.image ? (
                        <img
                          src={imgUrl(hod.image)}
                          alt={hod.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.placeholder-icon')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'placeholder-icon w-full h-full flex items-center justify-center text-slate-400';
                              placeholder.innerHTML = '<svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Users className="w-24 h-24" />
                        </div>
                      )}
                    </div>
                    
                    {/* HOD Details */}
                    <div className="text-center md:text-left space-y-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{hod.name}</h3>
                      {hod.designation && (
                        <p className="text-lg md:text-xl font-semibold text-slate-700">{hod.designation}</p>
                      )}
                      {hod.qualification && (
                        <p className="text-base md:text-lg text-slate-600">{hod.qualification}</p>
                      )}
                      {hod.email && (
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span>{hod.email}</span>
                        </div>
                      )}
                      {hod.phone && (
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{hod.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: HOD Message - Only show with first HOD */}
                  {index === 0 && s.hod?.message && (
                    <div className="mt-8 md:mt-0">
                      <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85] text-justify [&_p]:indent-8 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:text-slate-800 [&_strong]:font-semibold">
                        <div
                          dangerouslySetInnerHTML={{ __html: s.hod.message }}
                          className="message-content indent-8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-500 text-sm">Heads of Department will appear here once added through the Admin → HODs panel.</p>
              {s.hod?.message && (
                <div className="mt-8 text-left max-w-3xl mx-auto">
                  <div className="text-slate-600 font-poppins text-[1.0625rem] md:text-lg leading-[1.85] text-justify [&_p]:indent-8 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_strong]:text-slate-800 [&_strong]:font-semibold">
                    <div
                      dangerouslySetInnerHTML={{ __html: s.hod.message }}
                      className="message-content indent-8"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Programs Offered */}
      <section id="courses" ref={(el) => { sectionRefs.current['courses'] = el; }} className="scroll-mt-24 py-12 md:py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Programs Offered" title="Programs Offered" accent="violet" />
          {coursesCategories.length > 0 ? (
            <div className="space-y-5">
              {coursesCategories.map((cat: any) => (
                <div key={cat.id || cat.name}>
                  {cat.name && (
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{cat.name}</h3>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(cat.programs || []).map((p: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-sm">
                        <p className="font-semibold text-slate-900 text-sm">{p.name || '—'}</p>
                        {p.seats && <p className="text-xs text-slate-500 mt-0.5">{p.seats} seats</p>}
                        {p.fee && <p className="text-xs font-medium text-slate-700 mt-1.5">{p.fee}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Programs can be added in the Admin → Department Pages → Programs Offered.</p>
          )}
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" ref={(el) => { sectionRefs.current['curriculum'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-amber-50/30 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Curriculum" title="Year-wise curriculum & syllabus" accent="amber" />
          <div className="p-6 md:p-8 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm">
            <p className="text-slate-600 text-sm mb-6">
              {s.curriculum?.introText || 'Select a program and regulation to download the syllabus.'}
            </p>
            {curriculumFromApi && apiProgramNames.length > 0 && (
              <>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-sm font-medium text-slate-700">Program:</span>
                  <select
                    value={syllabusProgram}
                    onChange={(e) => setSyllabusProgram(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    {apiProgramNames.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {apiRegulations.length > 0 ? (
                    apiRegulations.map((reg) => (
                      <a
                        key={reg.name}
                        href={`${API_BASE}${reg.fileUrl.startsWith('/') ? reg.fileUrl : `/${reg.fileUrl}`}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={reg.fileName || undefined}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        {reg.name}
                      </a>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No regulations uploaded yet. Add syllabus PDFs in the Admin panel.</p>
                  )}
                </div>
              </>
            )}
            {!curriculumFromApi && (
              <p className="text-slate-500 text-sm">Upload syllabus PDFs in the Admin → Department Pages → Curriculum.</p>
            )}
          </div>
        </div>
      </section>

      {/* Fee */}
      <section id="fee" ref={(el) => { sectionRefs.current['fee'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Fee Structure" title={s.fee?.title || 'Fee at a glance'} accent="emerald" />
          {feeItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {feeItems.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-emerald-200 bg-white shadow-sm text-left">
                  <p className="text-slate-600 text-sm">{item.programName || '—'}</p>
                  <p className="text-2xl font-bold mt-2 text-emerald-700">{item.fee || '—'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Fee cards can be added in the Admin → Department Pages → Fee At Glance.</p>
          )}
        </div>
      </section>

      {/* Program Overview */}
      <section id="program-overview" ref={(el) => { sectionRefs.current['program-overview'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Program Overview" title="Program educational objectives & outcomes" accent="violet" />
          <div className="space-y-10">
            <div className="p-6 md:p-8 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Program Educational Objectives (PEOs)</h3>
              {peosList.length > 0 ? (
                <ul className="space-y-4 text-slate-600 text-sm">
                  {peosList.map((point, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                        {i + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm">PEOs can be added in the Admin panel (use 3 commas (,,,) to separate).</p>
              )}
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Program Specific Outcomes (PSOs)</h3>
              {psosList.length > 0 ? (
                <ul className="space-y-3 text-slate-600 text-sm">
                  {psosList.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm">PSOs can be added in the Admin panel (use 3 commas (,,,) to separate).</p>
              )}
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-violet-200 bg-violet-50/40 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Program Outcomes (POs)</h3>
              {(s.programOverview?.posText || posBadges.length > 0) ? (
                <>
                  {s.programOverview?.posText && (
                    <p className="text-slate-600 text-sm mb-4">{s.programOverview.posText}</p>
                  )}
                  {posBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {posBadges.filter(Boolean).map((badge: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-violet-100 text-violet-800 text-xs font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-500 text-sm">POs text and badges can be added in the Admin panel.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" ref={(el) => { sectionRefs.current['facilities'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-sky-50/60 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Facilities" title="Facilities" accent="amber" />
          {Array.isArray(s.facilities?.cards) && s.facilities.cards.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {s.facilities.cards.map((card: any, i: number) => {
                const iconUrl = card.icon ? (card.icon.startsWith('http') ? card.icon : `${API_BASE}${card.icon}`) : null;
                const accentColors = ['blue', 'emerald', 'violet', 'amber'];
                const accent = accentColors[i % accentColors.length];
                return (
                  <li key={card.id || i} className={`flex items-center gap-3 p-4 rounded-xl border bg-white shadow-sm ${accent === 'blue' ? 'border-blue-200' : accent === 'emerald' ? 'border-emerald-200' : accent === 'violet' ? 'border-violet-200' : 'border-amber-200'}`}>
                    {iconUrl && (
                      <div className={`w-5 h-5 shrink-0 flex items-center justify-center ${accent === 'blue' ? 'text-blue-600' : accent === 'emerald' ? 'text-emerald-600' : accent === 'violet' ? 'text-violet-600' : 'text-amber-600'}`}>
                        <img src={iconUrl} alt={card.name} className="w-full h-full object-contain" />
                      </div>
                    )}
                    {card.href ? (
                      <Link to={card.href} className="font-medium text-slate-800 text-sm hover:text-blue-600 transition-colors">{card.name || '—'}</Link>
                    ) : (
                      <span className="font-medium text-slate-800 text-sm">{card.name || '—'}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : s.facilities?.content ? (
            renderContent(s.facilities.content)
          ) : slug === 'cse' ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Central Library', icon: Library, accent: 'blue', href: '/facilities/library' },
                { name: 'Computer & Networking Labs', icon: Cpu, accent: 'emerald', href: undefined },
                { name: 'AI & ML Lab', icon: Cpu, accent: 'violet', href: undefined },
                { name: 'Hostel', icon: Building2, accent: 'amber', href: '/facilities/hostel' },
                { name: 'Sports', icon: Building2, accent: 'blue', href: '/facilities/sports' },
                { name: 'Transport', icon: Building2, accent: 'emerald', href: '/facilities/transport' },
                { name: 'Medical', icon: Building2, accent: 'violet', href: undefined },
                { name: 'Canteen', icon: Building2, accent: 'amber', href: undefined },
                { name: 'Wi-Fi Campus', icon: Wifi, accent: 'blue', href: undefined },
              ].map(({ name, icon: Icon, accent, href }, i) => (
                <li key={i} className={`flex items-center gap-3 p-4 rounded-xl border bg-white shadow-sm ${accent === 'blue' ? 'border-blue-200' : accent === 'emerald' ? 'border-emerald-200' : accent === 'violet' ? 'border-violet-200' : 'border-amber-200'}`}>
                  <Icon className={`w-5 h-5 shrink-0 ${accent === 'blue' ? 'text-blue-600' : accent === 'emerald' ? 'text-emerald-600' : accent === 'violet' ? 'text-violet-600' : 'text-amber-600'}`} />
                  {href ? (
                    <Link to={href} className="font-medium text-slate-800 text-sm hover:text-blue-600 transition-colors">{name}</Link>
                  ) : (
                    <span className="font-medium text-slate-800 text-sm">{name}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">Add facility cards in Admin → Department Pages → Facilities.</p>
          )}
        </div>
      </section>

      {/* Why VIET */}
      <section id="why-viet" ref={(el) => { sectionRefs.current['why-viet'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-amber-50/50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Why VIET" title="Why VIET" accent="blue" />
          {Array.isArray(s.whyViet?.cards) && s.whyViet.cards.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {s.whyViet.cards.map((card: any, i: number) => {
                const iconUrl = card.icon ? (card.icon.startsWith('http') ? card.icon : `${API_BASE}${card.icon}`) : null;
                const accentColors = ['blue', 'emerald', 'violet'];
                const accent = accentColors[i % accentColors.length];
                return (
                  <div key={card.id || i} className={`p-6 rounded-2xl border bg-white shadow-sm text-left ${accent === 'blue' ? 'border-blue-200' : accent === 'emerald' ? 'border-emerald-200' : 'border-violet-200'}`}>
                    {iconUrl && (
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${accent === 'blue' ? 'bg-blue-100' : accent === 'emerald' ? 'bg-emerald-100' : 'bg-violet-100'}`}>
                        <img src={iconUrl} alt={card.title} className="w-6 h-6 object-contain" />
                      </div>
                    )}
                    <h3 className="font-semibold text-slate-900">{card.title || '—'}</h3>
                    <p className="text-slate-600 text-sm mt-2">{card.subtitle || '—'}</p>
                  </div>
                );
              })}
            </div>
          ) : s.whyViet?.content ? (
            renderContent(s.whyViet.content)
          ) : slug === 'cse' ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Award, title: "NAAC 'A' Grade", desc: 'Accredited institution committed to quality education.', accent: 'blue' },
                { icon: Building2, title: 'Industry connect', desc: 'Placements, internships and industry-aligned curriculum.', accent: 'emerald' },
                { icon: Sparkles, title: 'Research & innovation', desc: 'Projects, labs and opportunities for research and startups.', accent: 'violet' },
              ].map(({ icon: Icon, title, desc, accent }, i) => (
                <div key={i} className={`p-6 rounded-2xl border bg-white shadow-sm text-left ${accent === 'blue' ? 'border-blue-200' : accent === 'emerald' ? 'border-emerald-200' : 'border-violet-200'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${accent === 'blue' ? 'bg-blue-100' : accent === 'emerald' ? 'bg-emerald-100' : 'bg-violet-100'}`}>
                    <Icon className={`w-6 h-6 ${accent === 'blue' ? 'text-blue-700' : accent === 'emerald' ? 'text-emerald-700' : 'text-violet-700'}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="text-slate-600 text-sm mt-2">{desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Add Why VIET cards in Admin → Department Pages → Why VIET.</p>
          )}
        </div>
      </section>

      {/* Faculty */}
      <section id="faculty" ref={(el) => { sectionRefs.current['faculty'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Faculty" title="Faculty" accent="emerald" />
          {facultyWithHods.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {facultyWithHods.map((f: any) => (
                <div key={f._listKey ?? f.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm text-left">
                  <div className="w-16 h-16 rounded-full mb-3 overflow-hidden border border-slate-200 bg-slate-100">
                    {f.image ? (
                      <img
                        src={imgUrl(f.image)}
                        alt={f.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.placeholder-icon')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'placeholder-icon w-full h-full flex items-center justify-center text-slate-400';
                            placeholder.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-slate-900 text-sm">{f.name}</p>
                  <p className="text-xs text-slate-600">{f.designation}</p>
                  {f.qualification && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate" title={f.qualification}>
                      {f.qualification}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {renderContent(s.faculty?.content)}
              {!s.faculty?.content && <p className="text-slate-500 text-sm">Faculty information is managed in the Admin → Faculty / HODs. Add content here or assign department to faculty.</p>}
            </>
          )}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" ref={(el) => { sectionRefs.current['projects'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          {(Array.isArray(s.projects?.stats) && s.projects.stats.length > 0) || (Array.isArray(s.projects?.cards) && s.projects.cards.length > 0) ? (
            <>
              <div className="mb-12 md:mb-16">
                <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-amber-500 uppercase mb-3">Showcase</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Projects</h2>
                <div className="mt-4 w-24 h-1 bg-amber-500" />
              </div>
              {Array.isArray(s.projects?.stats) && s.projects.stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                  {s.projects.stats.map((stat: any, i: number) => (
                    <div key={i} className="p-5 md:p-6 bg-white border-2 border-slate-200 rounded-xl">
                      <p className="text-2xl md:text-3xl font-black text-amber-600 tabular-nums">{stat.value || '—'}</p>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.label || '—'}</p>
                    </div>
                  ))}
                </div>
              )}
              {Array.isArray(s.projects?.cards) && s.projects.cards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                  {s.projects.cards.map((card: any, i: number) => {
                    const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];
                    const span = spans[i % spans.length] || 'md:col-span-6';
                    return (
                      <div key={card.id || i} className={`${span} p-6 md:p-8 bg-white border-2 border-slate-200 rounded-xl hover:border-amber-300 transition-colors`}>
                        {card.badge && (
                          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 bg-amber-100 text-amber-800 rounded">{card.badge}</span>
                        )}
                        <h3 className="text-lg md:text-xl font-bold text-slate-900">{card.title || '—'}</h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{card.overview || '—'}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : s.projects?.content ? (
            <>
              <SectionHead label="Projects" title="Projects" accent="violet" />
              {renderContent(s.projects.content)}
            </>
          ) : slug === 'cse' ? (
            <>
              <div className="mb-12 md:mb-16">
                <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-amber-400 uppercase mb-3">Showcase</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Projects</h2>
                <div className="mt-4 w-24 h-1 bg-amber-500" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                {[
                  { value: '50+', label: 'Completed' },
                  { value: '25+', label: 'Industry' },
                  { value: '15+', label: 'Research' },
                  { value: '10+', label: 'Award winning' },
                ].map((stat, i) => (
                  <div key={i} className="p-5 md:p-6 bg-white border-2 border-slate-200 rounded-xl">
                    <p className="text-2xl md:text-3xl font-black text-amber-600 tabular-nums">{stat.value}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                {[
                  { title: 'Smart Campus Management', tag: 'IoT', desc: 'IoT-based campus automation and student services.', span: 'md:col-span-7' },
                  { title: 'AI Healthcare Assistant', tag: 'AI/ML', desc: 'Machine learning for medical diagnosis support.', span: 'md:col-span-5' },
                  { title: 'Blockchain Voting System', tag: 'Blockchain', desc: 'Secure, transparent voting platform.', span: 'md:col-span-5' },
                  { title: 'Cybersecurity Monitoring', tag: 'Security', desc: 'Real-time threat detection and alerts.', span: 'md:col-span-7' },
                ].map((p, i) => (
                  <div key={i} className={`${p.span} p-6 md:p-8 bg-white border-2 border-slate-200 rounded-xl hover:border-amber-300 transition-colors`}>
                    <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-4 bg-amber-100 text-amber-800 rounded">{p.tag}</span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">{p.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionHead label="Projects" title="Projects" accent="violet" />
              <p className="text-slate-500 text-sm">Add project stats and cards in Admin → Department Pages → Projects.</p>
            </>
          )}
        </div>
      </section>

      {/* Placements */}
      <section id="placements" ref={(el) => { sectionRefs.current['placements'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-blue-50/40 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Placements" title="Placements" accent="blue" />
          {(Array.isArray(s.placements?.stats) && s.placements.stats.length > 0) || (Array.isArray(s.placements?.recruiterImages) && s.placements.recruiterImages.length > 0) || (Array.isArray(s.placements?.cards) && s.placements.cards.length > 0) ? (
            <>
              {Array.isArray(s.placements?.stats) && s.placements.stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {s.placements.stats.map((stat: any, i: number) => {
                    const accentColors = ['emerald', 'blue', 'violet', 'amber'];
                    const accent = accentColors[i % accentColors.length];
                    return (
                      <div key={i} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm text-left ${accent === 'emerald' ? 'border-l-emerald-500 border border-emerald-100' : accent === 'blue' ? 'border-l-blue-500 border border-blue-100' : accent === 'violet' ? 'border-l-violet-500 border border-violet-100' : 'border-l-amber-500 border border-amber-100'}`}>
                        <p className={`text-xl font-bold ${accent === 'emerald' ? 'text-emerald-700' : accent === 'blue' ? 'text-blue-700' : accent === 'violet' ? 'text-violet-700' : 'text-amber-700'}`}>{stat.value || '—'}</p>
                        <p className="text-xs text-slate-500 mt-1">{stat.label || '—'}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {Array.isArray(s.placements?.recruiterImages) && s.placements.recruiterImages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Top recruiters</h3>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white py-6">
                    <div className="flex animate-marquee w-max gap-12 px-4">
                      {(() => {
                        const images = s.placements.recruiterImages;
                        const minCopies = images.length < 3 ? 3 : 2;
                        return [...Array(minCopies)].flatMap((_, copy) =>
                          images.map((img: string, i: number) => {
                            const imgUrl = img.startsWith('http') ? img : `${API_BASE}${img}`;
                            return (
                              <div key={`${copy}-${i}`} className="shrink-0 w-24 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                                <img src={imgUrl} alt={`Recruiter ${i + 1}`} className="max-h-10 w-auto max-w-[80px] object-contain" />
                              </div>
                            );
                          })
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
              {Array.isArray(s.placements?.cards) && s.placements.cards.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent placements</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {s.placements.cards.map((card: any) => {
                      const imgUrl = card.image ? (card.image.startsWith('http') ? card.image : `${API_BASE}${card.image}`) : null;
                      return (
                        <div key={card.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                          {imgUrl && (
                            <div className="w-16 h-16 rounded-full mb-3 overflow-hidden border bg-slate-100">
                              <img src={imgUrl} alt={card.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <p className="font-semibold text-slate-900">{card.name || '—'}</p>
                          <p className="text-sm text-slate-600">{card.company || '—'} {card.role ? `· ${card.role}` : ''}</p>
                          {card.package && <p className="text-sm font-medium text-blue-600 mt-1">{card.package}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : s.placements?.content ? (
            renderContent(s.placements.content)
          ) : slug === 'cse' ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: '95%', label: 'Placement rate', accent: 'emerald' },
                  { value: '50+', label: 'Companies', accent: 'blue' },
                  { value: '₹8.5L', label: 'Highest package', accent: 'violet' },
                  { value: '₹4.2L', label: 'Average package', accent: 'amber' },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm text-left ${stat.accent === 'emerald' ? 'border-l-emerald-500 border border-emerald-100' : stat.accent === 'blue' ? 'border-l-blue-500 border border-blue-100' : stat.accent === 'violet' ? 'border-l-violet-500 border border-violet-100' : 'border-l-amber-500 border border-amber-100'}`}>
                    <p className={`text-xl font-bold ${stat.accent === 'emerald' ? 'text-emerald-700' : stat.accent === 'blue' ? 'text-blue-700' : stat.accent === 'violet' ? 'text-violet-700' : 'text-amber-700'}`}>{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Top recruiters</h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white py-6">
                  <div className="flex animate-marquee w-max gap-12 px-4">
                    {[...Array(2)].flatMap((_, copy) =>
                      ['/RECRUITERS/tcs.png', '/RECRUITERS/hcl-img.png', '/RECRUITERS/Tech_Mahindra.png', '/RECRUITERS/byjus-img.png', '/RECRUITERS/novel-img.png', '/RECRUITERS/smart-brains-img.png'].map((logo, i) => (
                        <div key={`${copy}-${i}`} className="shrink-0 w-24 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                          <img src={logo} alt="" className="max-h-10 w-auto max-w-[80px] object-contain" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent placements</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'G Manoj', company: 'NETFLIX', pkg: '50 LPA', role: 'Frontend Developer' },
                    { name: 'G Puneeth Reddy', company: 'Microsoft', pkg: '30 LPA', role: 'Backend Developer' },
                    { name: 'E Santhosh', company: 'IRCTC', pkg: '25 LPA', role: 'UI/UX Developer' },
                    { name: 'B Sravani', company: 'Opera', pkg: '21 LPA', role: 'Database Engineer' },
                    { name: 'G Ganesh', company: 'Meta', pkg: '30 LPA', role: 'Automation Engineer' },
                    { name: 'B Satish', company: 'Zohocorp', pkg: '25 LPA', role: 'Full Stack Developer' },
                  ].map((pl, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                      <p className="font-semibold text-slate-900">{pl.name}</p>
                      <p className="text-sm text-slate-600">{pl.company} · {pl.role}</p>
                      <p className="text-sm font-medium text-blue-600 mt-1">{pl.pkg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Add placement stats, recruiter images, and placement cards in Admin → Department Pages → Placements.</p>
          )}
        </div>
      </section>

      {/* R&D */}
      <section
        id="rd"
        ref={(el) => { sectionRefs.current['rd'] = el; }}
        className={`scroll-mt-24 py-20 md:py-28 relative border-t border-slate-200 overflow-hidden ${(slug === 'cse' && !s.rd?.title && !s.rd?.stats && !s.rd?.cards) || (s.rd?.title || s.rd?.stats || s.rd?.cards) ? '' : 'bg-slate-100'}`}
        style={(slug === 'cse' && !s.rd?.title && !s.rd?.stats && !s.rd?.cards) || (s.rd?.title || s.rd?.stats || s.rd?.cards) ? { background: 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 50%, #0e7490 100%)' } : undefined}
      >
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          {(s.rd?.title || (Array.isArray(s.rd?.stats) && s.rd.stats.length > 0) || (Array.isArray(s.rd?.researchAreas) && s.rd.researchAreas.length > 0) || (Array.isArray(s.rd?.cards) && s.rd.cards.length > 0)) ? (
            <>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-cyan-300/90 uppercase mb-2">Research</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{s.rd.title || 'R&D Lab'}</h2>
                </div>
                {Array.isArray(s.rd?.stats) && s.rd.stats.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {s.rd.stats.map((stat: any, i: number) => (
                      <div key={i} className="px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
                        <span className="text-lg font-bold text-cyan-300">{stat.value || '—'}</span>
                        <span className="text-xs text-white/60 ml-2">{stat.label || '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {Array.isArray(s.rd?.researchAreas) && s.rd.researchAreas.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-4">Research Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {s.rd.researchAreas.map((area: string, i: number) => (
                      <span key={i} className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-cyan-100/90 text-sm font-medium">
                        {area || '—'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(s.rd?.cards) && s.rd.cards.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {s.rd.cards.map((card: any) => (
                    <div key={card.id} className="p-6 md:p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                          <FlaskConical className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{card.name || '—'}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-cyan-200/80">
                            {card.duration && <span>Duration: {card.duration}</span>}
                            {card.funding && <span>Funding: {card.funding}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : s.rd?.content ? (
            <>
              <SectionHead label="R&D" title="R&D" accent="emerald" />
              {renderContent(s.rd.content)}
            </>
          ) : slug === 'cse' ? (
            <>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-cyan-300/90 uppercase mb-2">Research</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">R&D Lab</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: '25+', label: 'Papers' },
                    { value: '8', label: 'Ph.D Faculty' },
                    { value: '5', label: 'Ongoing' },
                    { value: '3', label: 'Patents' },
                  ].map((stat, i) => (
                    <div key={i} className="px-5 py-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
                      <span className="text-lg font-bold text-cyan-300">{stat.value}</span>
                      <span className="text-xs text-white/60 ml-2">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-10">
                <p className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider mb-4">Research Areas</p>
                <div className="flex flex-wrap gap-2">
                  {['AI & ML', 'Cybersecurity', 'Data Science', 'IoT', 'Computer Vision', 'NLP', 'Blockchain'].map((area, i) => (
                    <span key={i} className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-cyan-100/90 text-sm font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'AI-Powered Smart Agriculture', duration: '2023–2025', funding: '₹5,00,000' },
                  { title: 'Blockchain Healthcare Data', duration: '2024–2026', funding: '₹7,50,000' },
                ].map((proj, i) => (
                  <div key={i} className="p-6 md:p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <FlaskConical className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{proj.title}</h4>
                        <p className="text-sm text-cyan-200/70 mt-2">Duration: {proj.duration}</p>
                        <p className="text-sm text-cyan-300 font-medium mt-1">Funding: {proj.funding}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionHead label="R&D" title="R&D" accent="emerald" />
              <p className="text-slate-500 text-sm">R&D content can be edited in the Admin panel.</p>
            </>
          )}
        </div>
      </section>

      {/* Idea Cell */}
      <section
        id="idea-cell"
        ref={(el) => { sectionRefs.current['idea-cell'] = el; }}
        className={`scroll-mt-24 py-20 md:py-28 relative overflow-hidden border-t border-slate-200 ${(slug === 'cse' && !s.ideaCell?.title && !s.ideaCell?.stats && !s.ideaCell?.pillars) || (s.ideaCell?.title || s.ideaCell?.stats || s.ideaCell?.pillars) ? '' : 'bg-amber-50/50'}`}
        style={(slug === 'cse' && !s.ideaCell?.title && !s.ideaCell?.stats && !s.ideaCell?.pillars) || (s.ideaCell?.title || s.ideaCell?.stats || s.ideaCell?.pillars) ? { background: 'linear-gradient(180deg, #fef3c7 0%, #fce7f3 35%, #e0e7ff 70%, #f0fdf4 100%)' } : undefined}
      >
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          {(s.ideaCell?.title || s.ideaCell?.subtitle || (Array.isArray(s.ideaCell?.stats) && s.ideaCell.stats.length > 0) || (Array.isArray(s.ideaCell?.pillars) && s.ideaCell.pillars.length > 0)) ? (
            <>
              <div className="text-center mb-12 md:mb-16">
                <p className="inline-block px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-700 text-xs font-bold tracking-widest uppercase mb-4">Idea Cell</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{s.ideaCell.title || 'Innovation & entrepreneurship hub'}</h2>
                {s.ideaCell.subtitle && (
                  <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
                    {s.ideaCell.subtitle}
                  </p>
                )}
                {Array.isArray(s.ideaCell?.stats) && s.ideaCell.stats.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
                    {s.ideaCell.stats.map((stat: any, i: number) => (
                      <div key={i} className="px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg">
                        <p className="text-xl md:text-2xl font-black text-fuchsia-600">{stat.value || '—'}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label || '—'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {Array.isArray(s.ideaCell?.pillars) && s.ideaCell.pillars.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {s.ideaCell.pillars.map((pillar: any, i: number) => {
                    const iconUrl = pillar.icon ? (pillar.icon.startsWith('http') ? pillar.icon : `${API_BASE}${pillar.icon}`) : null;
                    const colors = ['amber', 'fuchsia', 'indigo', 'emerald'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={pillar.id || i} className={`p-6 rounded-3xl bg-white/90 backdrop-blur-md border-2 shadow-xl ${color === 'amber' ? 'border-amber-200' : color === 'fuchsia' ? 'border-fuchsia-200' : color === 'indigo' ? 'border-indigo-200' : 'border-emerald-200'}`}>
                        {iconUrl && (
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color === 'amber' ? 'bg-amber-100' : color === 'fuchsia' ? 'bg-fuchsia-100' : color === 'indigo' ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
                            <img src={iconUrl} alt={pillar.title} className="w-6 h-6 object-contain" />
                          </div>
                        )}
                        <h4 className="font-bold text-slate-900 text-base">{pillar.title || '—'}</h4>
                        {Array.isArray(pillar.items) && pillar.items.length > 0 && (
                          <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                            {pillar.items.map((item: string, j: number) => (
                              <li key={j} className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color === 'amber' ? 'bg-amber-500' : color === 'fuchsia' ? 'bg-fuchsia-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                {item || '—'}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : s.ideaCell?.content ? (
            <>
              <SectionHead label="Idea Cell" title="Idea Cell" accent="violet" />
              {renderContent(s.ideaCell.content)}
            </>
          ) : slug === 'cse' ? (
            <>
              <div className="text-center mb-12 md:mb-16">
                <p className="inline-block px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-700 text-xs font-bold tracking-widest uppercase mb-4">Idea Cell</p>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Innovation & entrepreneurship hub</h2>
                <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
                  Fostering innovation through mentorship, resources, and opportunities to turn ideas into reality.
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
                  {[
                    { value: '50+', label: 'Ideas submitted' },
                    { value: '15+', label: 'Startups launched' },
                    { value: '25+', label: 'Mentors' },
                    { value: '5', label: 'Awards won' },
                  ].map((stat, i) => (
                    <div key={i} className="px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg">
                      <p className="text-xl md:text-2xl font-black text-fuchsia-600">{stat.value}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Lightbulb, title: 'Idea incubation', items: ['Idea evaluation', 'Feasibility analysis', 'Prototype development'], color: 'amber' },
                  { icon: Users, title: 'Mentorship', items: ['Industry experts', 'Alumni support', 'Skill workshops'], color: 'fuchsia' },
                  { icon: Award, title: 'Competitions', items: ['Hackathons', 'Pitch events', 'Tech exhibitions'], color: 'indigo' },
                  { icon: Briefcase, title: 'Startup support', items: ['Funding', 'Legal & IP', 'Networking'], color: 'emerald' },
                ].map(({ icon: Icon, title, items, color }, i) => (
                  <div key={i} className={`p-6 rounded-3xl bg-white/90 backdrop-blur-md border-2 shadow-xl ${color === 'amber' ? 'border-amber-200' : color === 'fuchsia' ? 'border-fuchsia-200' : color === 'indigo' ? 'border-indigo-200' : 'border-emerald-200'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color === 'amber' ? 'bg-amber-100' : color === 'fuchsia' ? 'bg-fuchsia-100' : color === 'indigo' ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
                      <Icon className={`w-6 h-6 ${color === 'amber' ? 'text-amber-600' : color === 'fuchsia' ? 'text-fuchsia-600' : color === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{title}</h4>
                    <ul className="mt-3 space-y-2 text-slate-600 text-sm">
                      {items.map((x, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color === 'amber' ? 'bg-amber-500' : color === 'fuchsia' ? 'bg-fuchsia-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionHead label="Idea Cell" title="Idea Cell" accent="violet" />
              <p className="text-slate-500 text-sm">Add Idea Cell content in Admin → Department Pages → Idea Cell.</p>
            </>
          )}
        </div>
      </section>

      {/* Club Activities */}
      <section
        id="club-activities"
        ref={(el) => { sectionRefs.current['club-activities'] = el; }}
        className={`scroll-mt-24 py-20 md:py-28 relative overflow-hidden border-t border-slate-200 ${(slug === 'cse' && !s.clubActivities?.title && !s.clubActivities?.cards) || (s.clubActivities?.title || s.clubActivities?.cards) ? '' : 'bg-slate-50'}`}
        style={(slug === 'cse' && !s.clubActivities?.title && !s.clubActivities?.cards) || (s.clubActivities?.title || s.clubActivities?.cards) ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' } : undefined}
      >
        <div className="container mx-auto px-4 md:px-10 lg:px-12 relative z-10">
          {(s.clubActivities?.title || s.clubActivities?.subtitle || (Array.isArray(s.clubActivities?.cards) && s.clubActivities.cards.length > 0)) ? (
            <>
              <div className="mb-12 md:mb-16">
                <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/80 uppercase mb-3">Student Life</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">{s.clubActivities.title || 'Club Activities'}</h2>
                <div className="h-px w-20 bg-white/50 mb-6" />
                {s.clubActivities.subtitle && (
                  <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
                    {s.clubActivities.subtitle}
                  </p>
                )}
              </div>
              {Array.isArray(s.clubActivities?.cards) && s.clubActivities.cards.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {s.clubActivities.cards.map((card: any, i: number) => {
                    const iconMap: Record<string, any> = { Programming: Code, 'Quiz Club': BookOpen, 'Sports & Fitness': Award, 'Cultural Events': Palette };
                    const Icon = iconMap[card.category] || Code;
                    return (
                      <article key={card.id || i} className="h-full p-6 md:p-8 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-600">
                            <Icon className="w-5 h-5" strokeWidth={1.75} />
                          </div>
                          <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">{card.category || '—'}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-3">{card.title || '—'}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{card.subtitle || '—'}</p>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          ) : s.clubActivities?.content ? (
            <>
              <SectionHead label="Club Activities" title="Club Activities" accent="amber" />
              <div className="text-white [&_p]:text-white/90">{renderContent(s.clubActivities.content)}</div>
            </>
          ) : slug === 'cse' ? (
            <>
              <div className="mb-12 md:mb-16">
                <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/80 uppercase mb-3">Student Life</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">Club Activities</h2>
                <div className="h-px w-20 bg-white/50 mb-6" />
                <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
                  Join vibrant student communities that ignite passions, build skills, and create lasting connections.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { name: 'Code Crafters', tag: 'Programming', desc: 'Hackathons, open source contributions, and collaborative coding projects.', icon: Code },
                  { name: 'ThinkTank Trivia', tag: 'Quiz Club', desc: 'Competitive quizzes, knowledge sessions, and intellectual challenges.', icon: BookOpen },
                  { name: 'Binary Sports', tag: 'Sports & Fitness', desc: 'Inter-college tournaments, fitness training, and team sports.', icon: Award },
                  { name: 'Fusion Fantasia', tag: 'Cultural Events', desc: 'Music, dance, arts, drama, and creative expression festivals.', icon: Palette },
                ].map((club, i) => (
                  <article key={i} className="h-full p-6 md:p-8 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-600">
                        <club.icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">{club.tag}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-3">{club.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{club.desc}</p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionHead label="Club Activities" title="Club Activities" accent="amber" />
              <p className="text-slate-500 text-sm">Add club cards in Admin → Department Pages → Club Activities.</p>
            </>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" ref={(el) => { sectionRefs.current['gallery'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-amber-50/40 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Gallery" title={slug === 'cse' ? 'Gallery & media' : 'Gallery'} accent="emerald" />
          {galleryImages.length > 0 ? (
            <>
              {/* Adaptive Grid Layout - adjusts based on number of images */}
              {(() => {
                const layout = getAdaptiveGalleryLayout(galleryImages.length);
                return (
                  <div className={`grid ${layout.gridCols} gap-2 md:gap-3 lg:gap-4`}>
                    {galleryImages.map((img, i) => {
                      const itemLayout = layout.items[i] || layout.items[0];
                      return (
                        <div
                          key={i}
                          className={`vibe-gallery-item relative group cursor-pointer ${itemLayout.colSpan} ${itemLayout.rowSpan} min-h-[150px] md:min-h-[200px]`}
                          onClick={() => openImageModal(img.src)}
                        >
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchpriority={i < 4 ? "high" : "low"}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* View More / View Gallery - open full department gallery (all photos). Show when any images; "View More" if >10 */}
              {allGalleryImages.length > 0 && (
                <div className="flex justify-start mt-4 md:mt-6">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(`/department/${slug}/gallery`);
                    }}
                    className="group inline-flex items-center gap-3 text-[#0a192f] font-medium text-base hover:gap-4 transition-all duration-300"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors duration-300">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </span>
                    <span className="group-hover:underline underline-offset-4">
                      {allGalleryImages.length > 10 ? 'View More' : 'View Gallery'}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {renderContent(s.gallery?.content)}
              {!s.gallery?.content && slug === 'cse' && (
                <p className="text-slate-600 text-sm">Gallery images will appear here when added in the Admin → Gallery and assigned to this department.</p>
              )}
              {!s.gallery?.content && slug !== 'cse' && (
                <p className="text-slate-500 text-sm">Gallery images are managed in the Admin → Gallery (assign department). You can also add section content in Department Pages.</p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Alumni */}
      <section id="alumni" ref={(el) => { sectionRefs.current['alumni'] = el; }} className="scroll-mt-24 py-20 md:py-28 bg-emerald-50/40 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-10 lg:px-12">
          <SectionHead label="Alumni" title="Alumni" accent="emerald" />
          {s.alumni?.content ? (
            renderContent(s.alumni.content)
          ) : slug === 'cse' ? (
            <div className="p-8 rounded-2xl border border-emerald-200 bg-white shadow-sm text-left">
              <GraduationCap className="w-12 h-12 text-emerald-500 mb-4" />
              <p className="text-slate-600 text-sm mb-6">Stay connected with the CSE alumni network.</p>
              <Button variant="outline" className="rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50" asChild>
                <a href="#contact">Alumni portal / Contact</a>
              </Button>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-emerald-200 bg-white shadow-sm text-left">
              <GraduationCap className="w-12 h-12 text-emerald-500 mb-4" />
              <p className="text-slate-600 text-sm mb-6">Alumni content can be edited in the Admin → Department Pages.</p>
              <Button variant="outline" className="rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50" asChild>
                <a href="#contact">Contact</a>
              </Button>
            </div>
          )}
        </div>
      </section>


      <Dialog open={isModalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 border-0 bg-transparent">
          <DialogTitle className="sr-only">Gallery image</DialogTitle>
          <DialogDescription className="sr-only">
            Image {currentImageIndex + 1} of {galleryImages.length}
          </DialogDescription>
          <div className="relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={closeImageModal}>
              <X className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={goPrev}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full" onClick={goNext}>
              <ChevronRight className="w-6 h-6" />
            </Button>
            {selectedImage && (
              <div className="flex justify-center bg-black/80 rounded-lg">
                <img src={selectedImage} alt={galleryImages[currentImageIndex]?.alt || 'Gallery'} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <ScrollProgressIndicator />
    </div>
  );
};

export default DepartmentPageTemplate;
