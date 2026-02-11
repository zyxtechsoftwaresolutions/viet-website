import { useState, useEffect } from 'react';
import { departmentPagesAPI } from '@/lib/api';
import { uploadToSupabase, uploadVideoToSupabase } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileText, Upload, Trash2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '') || 'http://localhost:3001';

const DEPARTMENT_SLUGS = [
  // Engineering UG (existing)
  { value: 'cse', label: 'ENGINEERING UG - Computer Science & Engineering (CSE)' },
  { value: 'cyber-security', label: 'ENGINEERING UG - CSE (Cyber Security)' },
  { value: 'data-science', label: 'ENGINEERING UG - CSE (Data Science)' },
  { value: 'aiml', label: 'ENGINEERING UG - CSE (AI & ML)' },
  { value: 'ece', label: 'ENGINEERING UG - Electronics & Communication (ECE)' },
  { value: 'eee', label: 'ENGINEERING UG - Electrical & Electronics (EEE)' },
  { value: 'civil', label: 'ENGINEERING UG - Civil Engineering' },
  { value: 'mechanical', label: 'ENGINEERING UG - Mechanical Engineering' },
  { value: 'automobile', label: 'ENGINEERING UG - Automobile Engineering (AME)' },
  { value: 'bsh', label: 'ENGINEERING UG - Basic Science & Humanities (BS&H)' },
  // Diploma
  { value: 'diploma-agriculture', label: 'DIPLOMA - Agriculture Engineering' },
  { value: 'diploma-civil', label: 'DIPLOMA - Civil Engineering' },
  { value: 'diploma-cse', label: 'DIPLOMA - Computer Science Engineering' },
  { value: 'diploma-ece', label: 'DIPLOMA - Electronics & Communications Engineering' },
  { value: 'diploma-eee', label: 'DIPLOMA - Electrical & Electronics Engineering' },
  { value: 'diploma-mechanical', label: 'DIPLOMA - Mechanical Engineering' },
  // Engineering PG
  { value: 'pg-cadcam', label: 'ENGINEERING PG - CAD/CAM' },
  { value: 'pg-cse', label: 'ENGINEERING PG - Computer Science & Engineering (CSE)' },
  { value: 'pg-power-systems', label: 'ENGINEERING PG - Power Systems' },
  { value: 'pg-structural', label: 'ENGINEERING PG - Structural Engineering' },
  { value: 'pg-thermal', label: 'ENGINEERING PG - Thermal Engineering' },
  { value: 'pg-vlsi', label: 'ENGINEERING PG - VLSI & Embedded Systems' },
  // Management
  { value: 'management-bba', label: 'MANAGEMENT UG - BBA' },
  { value: 'management-bca', label: 'MANAGEMENT UG - BCA' },
  { value: 'management-mba', label: 'MANAGEMENT PG - MBA' },
  { value: 'management-mca', label: 'MANAGEMENT PG - MCA' },
];

type ProgramCard = { name: string; seats: string; fee: string };
type ProgramCategory = { id: string; name: string; programs: ProgramCard[] };
type FeeCard = { programName: string; fee: string };
type FacilityCard = { id: string; icon: string; name: string; href?: string };
type WhyVietCard = { id: string; icon: string; title: string; subtitle: string };
type ProjectStat = { label: string; value: string };
type ProjectCard = { id: string; badge: string; title: string; overview: string };
type PlacementStat = { label: string; value: string };
type PlacementCard = { id: string; image: string; name: string; company: string; role: string; package: string };
type RDStat = { label: string; value: string };
type RDProjectCard = { id: string; name: string; duration: string; funding: string };
type IdeaCellStat = { label: string; value: string };
type IdeaCellPillar = { id: string; icon: string; title: string; items: string[] };
type ClubCard = { id: string; category: string; title: string; subtitle: string };

const defaultSections = () => ({
  hero: { image: '', video: '', badge: '', title: '', subtitle: '', buttonText: 'Apply Now', buttonLink: '' },
  overview: { title: '', content: '', whyChoose: '' },
  visionMission: { vision: '', mission: '' },
  hod: { message: '' },
  courses: { categories: [] as ProgramCategory[] },
  curriculum: { introText: 'Select a program and regulation to download the syllabus.' },
  admission: { title: '', content: '', link: '' },
  fee: { title: 'Fee at a glance', items: [] as FeeCard[] },
  programOverview: { peos: '', psos: '', posText: '', posBadges: [] as string[] },
  facilities: { cards: [] as FacilityCard[] },
  whyViet: { cards: [] as WhyVietCard[] },
  faculty: { content: '' },
  projects: { stats: [{ label: 'Completed', value: '50+' }, { label: 'Industry', value: '25+' }, { label: 'Research', value: '15+' }, { label: 'Award winning', value: '10+' }] as ProjectStat[], cards: [] as ProjectCard[] },
  placements: { stats: [{ label: 'Placement rate', value: '95%' }, { label: 'Companies', value: '50+' }, { label: 'Highest package', value: '₹8.5L' }, { label: 'Average package', value: '₹4.2L' }] as PlacementStat[], recruiterImages: [] as string[], cards: [] as PlacementCard[] },
  rd: { title: 'R&D Lab', stats: [{ label: 'Papers', value: '25+' }, { label: 'Ph.D Faculty', value: '8' }, { label: 'Ongoing', value: '5' }, { label: 'Patents', value: '3' }] as RDStat[], researchAreas: [] as string[], cards: [] as RDProjectCard[] },
  ideaCell: { title: 'Innovation & entrepreneurship hub', subtitle: 'Fostering innovation through mentorship, resources, and opportunities to turn ideas into reality.', stats: [{ label: 'Ideas submitted', value: '50+' }, { label: 'Startups launched', value: '15+' }, { label: 'Mentors', value: '25+' }, { label: 'Awards won', value: '5' }] as IdeaCellStat[], pillars: [] as IdeaCellPillar[] },
  clubActivities: { title: 'Club Activities', subtitle: 'Join vibrant student communities that ignite passions, build skills, and create lasting connections.', cards: [] as ClubCard[] },
  gallery: { content: '' },
  alumni: { content: '' },
});

function migrateSections(raw: any): typeof defaultSections extends () => infer R ? R : never {
  const def = defaultSections();
  if (!raw || typeof raw !== 'object') return def;
  const out = { ...def };

  if (raw.hero) {
    out.hero = { ...def.hero, ...raw.hero };
    if (typeof out.hero === 'object' && !('buttonText' in out.hero)) (out.hero as any).buttonText = 'Apply Now';
    if (typeof out.hero === 'object' && !('buttonLink' in out.hero)) (out.hero as any).buttonLink = '';
    if (typeof out.hero === 'object' && !('image' in out.hero)) (out.hero as any).image = '';
    if (typeof out.hero === 'object' && !('video' in out.hero)) (out.hero as any).video = '';
  }
  if (raw.overview) out.overview = { ...def.overview, ...raw.overview };
  if (raw.visionMission) out.visionMission = { ...def.visionMission, ...raw.visionMission };
  if (raw.hod) out.hod = { ...def.hod, ...raw.hod };
  if (raw.curriculum) out.curriculum = { ...def.curriculum, ...raw.curriculum };
  if (raw.admission) out.admission = { ...def.admission, ...raw.admission };

  if (raw.courses) {
    if (Array.isArray((raw.courses as any).categories)) {
      out.courses = { categories: (raw.courses as any).categories };
    } else if (typeof (raw.courses as any).content === 'string') {
      out.courses = { categories: [] };
    }
  }

  if (raw.fee) {
    if (Array.isArray((raw.fee as any).items)) {
      out.fee = { title: (raw.fee as any).title || def.fee.title, items: (raw.fee as any).items };
    } else if (typeof (raw.fee as any).items === 'string') {
      try {
        const parsed = JSON.parse((raw.fee as any).items);
        if (Array.isArray(parsed)) {
          out.fee.items = parsed.map((x: any) =>
            typeof x === 'object' && (x.programName !== undefined || x.level)
              ? { programName: x.programName ?? x.level ?? '', fee: x.fee ?? x.amount ?? '' }
              : { programName: '', fee: '' }
          ).filter((x: FeeCard) => x.programName || x.fee);
        }
      } catch {
        out.fee.items = [];
      }
    }
  }

  if (raw.programOverview) {
    const po = raw.programOverview;
    out.programOverview = {
      peos: po.peos ?? '',
      psos: po.psos ?? '',
      posText: po.posText ?? po.pos ?? '',
      posBadges: Array.isArray(po.posBadges) ? po.posBadges : [],
    };
  }

  if (raw.facilities) {
    if (Array.isArray(raw.facilities.cards)) {
      out.facilities = { cards: raw.facilities.cards };
    } else if (raw.facilities.content !== undefined) {
      out.facilities = { cards: [] };
    }
  }
  if (raw.whyViet) {
    if (Array.isArray(raw.whyViet.cards)) {
      out.whyViet = { cards: raw.whyViet.cards };
    } else if (raw.whyViet.content !== undefined) {
      out.whyViet = { cards: [] };
    }
  }
  if (raw.projects) {
    if (raw.projects.stats && raw.projects.cards) {
      out.projects = { stats: raw.projects.stats || def.projects.stats, cards: raw.projects.cards || [] };
    } else if (raw.projects.content !== undefined) {
      out.projects = def.projects;
    }
  }
  if (raw.placements) {
    if (raw.placements.stats || raw.placements.recruiterImages || raw.placements.cards) {
      out.placements = {
        stats: raw.placements.stats || def.placements.stats,
        recruiterImages: Array.isArray(raw.placements.recruiterImages) ? raw.placements.recruiterImages : [],
        cards: raw.placements.cards || [],
      };
    } else if (raw.placements.content !== undefined) {
      out.placements = def.placements;
    }
  }
  if (raw.rd) {
    if (raw.rd.title || raw.rd.stats || raw.rd.researchAreas || raw.rd.cards) {
      out.rd = {
        title: raw.rd.title || def.rd.title,
        stats: raw.rd.stats || def.rd.stats,
        researchAreas: Array.isArray(raw.rd.researchAreas) ? raw.rd.researchAreas : [],
        cards: raw.rd.cards || [],
      };
    } else if (raw.rd.content !== undefined) {
      out.rd = def.rd;
    }
  }
  if (raw.ideaCell) {
    if (raw.ideaCell.title || raw.ideaCell.subtitle || raw.ideaCell.stats || raw.ideaCell.pillars) {
      out.ideaCell = {
        title: raw.ideaCell.title || def.ideaCell.title,
        subtitle: raw.ideaCell.subtitle || def.ideaCell.subtitle,
        stats: raw.ideaCell.stats || def.ideaCell.stats,
        pillars: raw.ideaCell.pillars || [],
      };
    } else if (raw.ideaCell.content !== undefined) {
      out.ideaCell = def.ideaCell;
    }
  }
  if (raw.clubActivities) {
    if (raw.clubActivities.title || raw.clubActivities.subtitle || raw.clubActivities.cards) {
      out.clubActivities = {
        title: raw.clubActivities.title || def.clubActivities.title,
        subtitle: raw.clubActivities.subtitle || def.clubActivities.subtitle,
        cards: raw.clubActivities.cards || [],
      };
    } else if (raw.clubActivities.content !== undefined) {
      out.clubActivities = def.clubActivities;
    }
  }

  ['faculty', 'gallery', 'alumni'].forEach((k) => {
    if (raw[k]?.content !== undefined) (out as any)[k] = { content: raw[k].content };
  });

  return out;
}

type PageData = {
  slug: string;
  sections?: Record<string, any>;
  curriculum?: {
    programs: Array<{ name: string; regulations: Array<{ name: string; fileUrl: string; fileName?: string }> }>;
  };
};

const DepartmentPages = () => {
  const [slug, setSlug] = useState<string>('cse');
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<ReturnType<typeof defaultSections>>(defaultSections());

  const [curriculumProgram, setCurriculumProgram] = useState('');
  const [curriculumRegulation, setCurriculumRegulation] = useState('');
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroVideoFile, setHeroVideoFile] = useState<File | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [regulationToDelete, setRegulationToDelete] = useState<{ program: string; regulation: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    setLoading(true);
    setHeroImageFile(null);
    try {
      const data = await departmentPagesAPI.getBySlug(slug);
      setPage(data);
      setSections(migrateSections(data.sections));
    } catch {
      setPage({ slug, sections: defaultSections(), curriculum: { programs: [] } });
      setSections(defaultSections());
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (sectionKey: string, field: string, value: any) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value,
      },
    }));
  };

  const prepareSectionsForSave = () => {
    const s = { ...sections };
    return s;
  };

  const handleSaveSections = async () => {
    let sectionsToSave = prepareSectionsForSave();
    if (heroImageFile) {
      setUploadingHero(true);
      try {
        toast.info('Uploading hero image…');
        const imageUrl = await uploadToSupabase(heroImageFile, 'department-hero', 'images');
        await departmentPagesAPI.uploadHeroImage(slug, imageUrl);
        sectionsToSave = {
          ...sectionsToSave,
          hero: { ...sectionsToSave.hero, image: imageUrl },
        };
        setHeroImageFile(null);
      } catch (e: any) {
        toast.error(e.message || 'Hero image upload failed');
        setUploadingHero(false);
        return;
      }
      setUploadingHero(false);
    }
    if (heroVideoFile) {
      setUploadingHero(true);
      try {
        toast.info('Uploading hero video…');
        const videoUrl = await uploadVideoToSupabase(heroVideoFile, 'department-hero');
        sectionsToSave = {
          ...sectionsToSave,
          hero: { ...sectionsToSave.hero, video: videoUrl },
        };
        setHeroVideoFile(null);
      } catch (e: any) {
        toast.error(e.message || 'Hero video upload failed');
        setUploadingHero(false);
        return;
      }
      setUploadingHero(false);
    }
    setSaving(true);
    try {
      await departmentPagesAPI.update(slug, { sections: sectionsToSave });
      toast.success('Sections saved successfully');
      loadPage();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSyllabus = async () => {
    if (!curriculumProgram.trim() || !curriculumRegulation.trim()) {
      toast.error('Program and regulation are required');
      return;
    }
    if (!curriculumFile) {
      toast.error('Please select a PDF file');
      return;
    }
    setUploading(true);
    try {
      toast.info('Uploading syllabus…');
      const fileUrl = await uploadToSupabase(curriculumFile, 'syllabus', 'images');
      await departmentPagesAPI.uploadSyllabus(slug, curriculumProgram.trim(), curriculumRegulation.trim(), fileUrl, curriculumFile.name);
      toast.success('Syllabus uploaded');
      setCurriculumRegulation('');
      setCurriculumFile(null);
      loadPage();
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const existingRegulations = (programName: string): string[] => {
    const p = page?.curriculum?.programs?.find((x) => x.name === programName);
    return p?.regulations?.map((r) => r.name) ?? [];
  };

  const allProgramNames = (page?.curriculum?.programs ?? []).map((p) => p.name);

  const handleDeleteRegulation = (program: string, regulation: string) => {
    setRegulationToDelete({ program, regulation });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRegulation = async () => {
    if (!regulationToDelete) return;
    setDeleting(true);
    try {
      await departmentPagesAPI.deleteRegulation(slug, regulationToDelete.program, regulationToDelete.regulation);
      toast.success('Regulation deleted');
      setDeleteDialogOpen(false);
      setRegulationToDelete(null);
      loadPage();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const courses = sections.courses?.categories ?? [];
  const feeItems = sections.fee?.items ?? [];
  const posBadges = sections.programOverview?.posBadges ?? [];
  const facilitiesCards = sections.facilities?.cards ?? [];
  const whyVietCards = sections.whyViet?.cards ?? [];
  const projectStats = sections.projects?.stats ?? [];
  const projectCards = sections.projects?.cards ?? [];
  const placementStats = sections.placements?.stats ?? [];
  const recruiterImages = sections.placements?.recruiterImages ?? [];
  const placementCards = sections.placements?.cards ?? [];
  const rdStats = sections.rd?.stats ?? [];
  const rdResearchAreas = sections.rd?.researchAreas ?? [];
  const rdCards = sections.rd?.cards ?? [];
  const ideaCellStats = sections.ideaCell?.stats ?? [];
  const ideaCellPillars = sections.ideaCell?.pillars ?? [];
  const clubCards = sections.clubActivities?.cards ?? [];

  const addCategory = () => {
    const id = 'cat-' + Date.now();
    updateSection('courses', 'categories', [...courses, { id, name: '', programs: [] }]);
  };

  const updateCategory = (id: string, field: 'name', value: string) => {
    updateSection(
      'courses',
      'categories',
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const deleteCategory = (id: string) => {
    updateSection('courses', 'categories', courses.filter((c) => c.id !== id));
  };

  const addProgram = (categoryId: string) => {
    updateSection(
      'courses',
      'categories',
      courses.map((c) =>
        c.id === categoryId ? { ...c, programs: [...c.programs, { name: '', seats: '', fee: '' }] } : c
      )
    );
  };

  const updateProgram = (categoryId: string, idx: number, field: keyof ProgramCard, value: string) => {
    updateSection(
      'courses',
      'categories',
      courses.map((c) => {
        if (c.id !== categoryId) return c;
        const p = [...c.programs];
        p[idx] = { ...p[idx], [field]: value };
        return { ...c, programs: p };
      })
    );
  };

  const deleteProgram = (categoryId: string, idx: number) => {
    updateSection(
      'courses',
      'categories',
      courses.map((c) =>
        c.id === categoryId ? { ...c, programs: c.programs.filter((_, i) => i !== idx) } : c
      )
    );
  };

  const addFeeCard = () => {
    updateSection('fee', 'items', [...feeItems, { programName: '', fee: '' }]);
  };

  const updateFeeCard = (idx: number, field: keyof FeeCard, value: string) => {
    const next = [...feeItems];
    next[idx] = { ...next[idx], [field]: value };
    updateSection('fee', 'items', next);
  };

  const deleteFeeCard = (idx: number) => {
    updateSection('fee', 'items', feeItems.filter((_, i) => i !== idx));
  };

  const addPosBadge = () => {
    updateSection('programOverview', 'posBadges', [...posBadges, '']);
  };

  const updatePosBadge = (idx: number, value: string) => {
    const next = [...posBadges];
    next[idx] = value;
    updateSection('programOverview', 'posBadges', next);
  };

  const deletePosBadge = (idx: number) => {
    updateSection('programOverview', 'posBadges', posBadges.filter((_, i) => i !== idx));
  };

  // Facilities CRUD
  const addFacilityCard = () => {
    updateSection('facilities', 'cards', [...facilitiesCards, { id: 'fac-' + Date.now(), icon: '', name: '', href: '' }]);
  };
  const updateFacilityCard = (id: string, field: keyof FacilityCard, value: string) => {
    updateSection('facilities', 'cards', facilitiesCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const deleteFacilityCard = (id: string) => {
    updateSection('facilities', 'cards', facilitiesCards.filter((c) => c.id !== id));
  };
  const handleFacilityIconUpload = async (id: string, file: File) => {
    try {
      const res = await departmentPagesAPI.uploadAsset(slug, file);
      updateFacilityCard(id, 'icon', (res as { url: string }).url);
      toast.success('Icon uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    }
  };

  // Why VIET CRUD
  const addWhyVietCard = () => {
    updateSection('whyViet', 'cards', [...whyVietCards, { id: 'wv-' + Date.now(), icon: '', title: '', subtitle: '' }]);
  };
  const updateWhyVietCard = (id: string, field: keyof WhyVietCard, value: string) => {
    updateSection('whyViet', 'cards', whyVietCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const deleteWhyVietCard = (id: string) => {
    updateSection('whyViet', 'cards', whyVietCards.filter((c) => c.id !== id));
  };
  const handleWhyVietIconUpload = async (id: string, file: File) => {
    try {
      toast.info('Uploading…');
      const url = await uploadToSupabase(file, 'department-assets', 'images');
      await departmentPagesAPI.uploadAsset(slug, url, file.name);
      updateWhyVietCard(id, 'icon', url);
      toast.success('Icon uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    }
  };

  // Projects CRUD
  const updateProjectStat = (idx: number, field: keyof ProjectStat, value: string) => {
    const next = [...projectStats];
    next[idx] = { ...next[idx], [field]: value };
    updateSection('projects', 'stats', next);
  };
  const addProjectCard = () => {
    updateSection('projects', 'cards', [...projectCards, { id: 'proj-' + Date.now(), badge: '', title: '', overview: '' }]);
  };
  const updateProjectCard = (id: string, field: keyof ProjectCard, value: string) => {
    updateSection('projects', 'cards', projectCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const deleteProjectCard = (id: string) => {
    updateSection('projects', 'cards', projectCards.filter((c) => c.id !== id));
  };

  // Placements CRUD
  const updatePlacementStat = (idx: number, field: keyof PlacementStat, value: string) => {
    const next = [...placementStats];
    next[idx] = { ...next[idx], [field]: value };
    updateSection('placements', 'stats', next);
  };
  const addRecruiterImage = async (file: File) => {
    try {
      toast.info('Uploading…');
      const url = await uploadToSupabase(file, 'department-assets', 'images');
      await departmentPagesAPI.uploadAsset(slug, url, file.name);
      updateSection('placements', 'recruiterImages', [...recruiterImages, url]);
      toast.success('Recruiter image added');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    }
  };
  const deleteRecruiterImage = (idx: number) => {
    updateSection('placements', 'recruiterImages', recruiterImages.filter((_, i) => i !== idx));
  };
  const addPlacementCard = () => {
    updateSection('placements', 'cards', [...placementCards, { id: 'plc-' + Date.now(), image: '', name: '', company: '', role: '', package: '' }]);
  };
  const updatePlacementCard = (id: string, field: keyof PlacementCard, value: string) => {
    updateSection('placements', 'cards', placementCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const deletePlacementCard = (id: string) => {
    updateSection('placements', 'cards', placementCards.filter((c) => c.id !== id));
  };
  const handlePlacementImageUpload = async (id: string, file: File) => {
    try {
      toast.info('Uploading…');
      const url = await uploadToSupabase(file, 'department-assets', 'images');
      await departmentPagesAPI.uploadAsset(slug, url, file.name);
      updatePlacementCard(id, 'image', url);
      toast.success('Image uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    }
  };

  // R&D CRUD
  const updateRDStat = (idx: number, field: keyof RDStat, value: string) => {
    const next = [...rdStats];
    next[idx] = { ...next[idx], [field]: value };
    updateSection('rd', 'stats', next);
  };
  const addRDResearchArea = () => {
    updateSection('rd', 'researchAreas', [...rdResearchAreas, '']);
  };
  const updateRDResearchArea = (idx: number, value: string) => {
    const next = [...rdResearchAreas];
    next[idx] = value;
    updateSection('rd', 'researchAreas', next);
  };
  const deleteRDResearchArea = (idx: number) => {
    updateSection('rd', 'researchAreas', rdResearchAreas.filter((_, i) => i !== idx));
  };
  const addRDCard = () => {
    updateSection('rd', 'cards', [...rdCards, { id: 'rd-' + Date.now(), name: '', duration: '', funding: '' }]);
  };
  const updateRDCard = (id: string, field: keyof RDProjectCard, value: string) => {
    updateSection('rd', 'cards', rdCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const deleteRDCard = (id: string) => {
    updateSection('rd', 'cards', rdCards.filter((c) => c.id !== id));
  };

  // Idea Cell CRUD
  const updateIdeaCellStat = (idx: number, field: keyof IdeaCellStat, value: string) => {
    const next = [...ideaCellStats];
    next[idx] = { ...next[idx], [field]: value };
    updateSection('ideaCell', 'stats', next);
  };
  const addIdeaCellPillar = () => {
    updateSection('ideaCell', 'pillars', [...ideaCellPillars, { id: 'icp-' + Date.now(), icon: '', title: '', items: [''] }]);
  };
  const updateIdeaCellPillar = (id: string, field: 'icon' | 'title', value: string) => {
    updateSection('ideaCell', 'pillars', ideaCellPillars.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };
  const updateIdeaCellPillarItem = (id: string, itemIdx: number, value: string) => {
    updateSection('ideaCell', 'pillars', ideaCellPillars.map((p) => {
      if (p.id !== id) return p;
      const items = [...p.items];
      items[itemIdx] = value;
      return { ...p, items };
    }));
  };
  const addIdeaCellPillarItem = (id: string) => {
    updateSection('ideaCell', 'pillars', ideaCellPillars.map((p) => (p.id === id ? { ...p, items: [...p.items, ''] } : p)));
  };
  const deleteIdeaCellPillarItem = (id: string, itemIdx: number) => {
    updateSection('ideaCell', 'pillars', ideaCellPillars.map((p) => (p.id === id ? { ...p, items: p.items.filter((_, i) => i !== itemIdx) } : p)));
  };
  const deleteIdeaCellPillar = (id: string) => {
    updateSection('ideaCell', 'pillars', ideaCellPillars.filter((p) => p.id !== id));
  };
  const handleIdeaCellIconUpload = async (id: string, file: File) => {
    try {
      toast.info('Uploading…');
      const url = await uploadToSupabase(file, 'department-assets', 'images');
      await departmentPagesAPI.uploadAsset(slug, url, file.name);
      updateIdeaCellPillar(id, 'icon', url);
      toast.success('Icon uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    }
  };

  // Club Activities CRUD
  const addClubCard = () => {
    updateSection('clubActivities', 'cards', [...clubCards, { id: 'club-' + Date.now(), category: '', title: '', subtitle: '' }]);
  };
  const updateClubCard = (id: string, field: keyof ClubCard, value: string) => {
    updateSection('clubActivities', 'cards', clubCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const deleteClubCard = (id: string) => {
    updateSection('clubActivities', 'cards', clubCards.filter((c) => c.id !== id));
  };

  const heroImage = sections.hero?.image;
  const heroImageUrl = heroImage ? (heroImage.startsWith('http') ? heroImage : `${API_BASE}${heroImage}`) : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Pages</h1>
        <p className="text-muted-foreground mt-2">
          Edit sections for each department. Select a department, update the sections below, then click Save.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Department</CardTitle>
          <CardDescription>Choose the department page to edit</CardDescription>
          <Select value={slug} onValueChange={setSlug}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENT_SLUGS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">1. Hero</TabsTrigger>
          <TabsTrigger value="overview">2. Overview</TabsTrigger>
          <TabsTrigger value="vision">3. Vision & Mission</TabsTrigger>
          <TabsTrigger value="hod">4. Message</TabsTrigger>
          <TabsTrigger value="courses">5. Programs Offered</TabsTrigger>
          <TabsTrigger value="curriculum">6. Curriculum</TabsTrigger>
          <TabsTrigger value="fee">7. Fee At Glance</TabsTrigger>
          <TabsTrigger value="programOverview">8. Program Overview</TabsTrigger>
          <TabsTrigger value="facilities">9. Facilities</TabsTrigger>
          <TabsTrigger value="whyViet">10. Why VIET</TabsTrigger>
          <TabsTrigger value="projects">11. Projects</TabsTrigger>
          <TabsTrigger value="placements">12. Placements</TabsTrigger>
          <TabsTrigger value="rd">13. R&D</TabsTrigger>
          <TabsTrigger value="ideaCell">14. Idea Cell</TabsTrigger>
          <TabsTrigger value="clubActivities">15. Club Activities</TabsTrigger>
          <TabsTrigger value="more">More Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Image, badge, title, subtitle, and CTA button for the department page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Image (background when no video)</Label>
                <div className="flex flex-wrap items-center gap-4">
                  {heroImageUrl && (
                    <div className="w-32 h-20 rounded-lg overflow-hidden border bg-muted">
                      <img src={heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHeroImageFile(e.target.files?.[0] ?? null)}
                      className="max-w-xs"
                    />
                    {heroImageFile && (
                      <span className="text-sm text-muted-foreground ml-2">{heroImageFile.name}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hero Video (optional — file or link from Drive, YouTube, Instagram, Vimeo)</Label>
                <p className="text-xs text-muted-foreground">Upload a video file or paste a link. Video takes priority over image when both are set.</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setHeroVideoFile(e.target.files?.[0] ?? null)}
                      className="max-w-xs"
                      placeholder="Upload video"
                    />
                    {heroVideoFile && (
                      <span className="text-sm text-muted-foreground ml-2">{heroVideoFile.name}</span>
                    )}
                  </div>
                  <span className="text-muted-foreground">or</span>
                  <Input
                    value={sections.hero?.video ?? ''}
                    onChange={(e) => updateSection('hero', 'video', e.target.value)}
                    placeholder="Paste link: Drive, YouTube, Instagram, Vimeo..."
                    className="max-w-md"
                  />
                  {(sections.hero?.video || heroVideoFile) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateSection('hero', 'video', '');
                        setHeroVideoFile(null);
                      }}
                    >
                      Clear video
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={sections.hero?.badge ?? ''}
                  onChange={(e) => updateSection('hero', 'badge', e.target.value)}
                  placeholder="e.g. B.Tech · Undergraduate"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={sections.hero?.title ?? ''}
                  onChange={(e) => updateSection('hero', 'title', e.target.value)}
                  placeholder="e.g. B. Tech. in Computer Science and Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={sections.hero?.subtitle ?? ''}
                  onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                  placeholder="Short description"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={sections.hero?.buttonText ?? 'Apply Now'}
                    onChange={(e) => updateSection('hero', 'buttonText', e.target.value)}
                    placeholder="Apply Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Link (URL)</Label>
                  <Input
                    value={sections.hero?.buttonLink ?? ''}
                    onChange={(e) => updateSection('hero', 'buttonLink', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview Section</CardTitle>
              <CardDescription>
                Title, content (text or HTML — spaces and paragraphs preserved), and Why Choose (use 3 commas (,,,) to separate points shown as bullets)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={sections.overview?.title ?? ''}
                  onChange={(e) => updateSection('overview', 'title', e.target.value)}
                  placeholder="e.g. Prepare for a career in B. Tech CSE"
                />
              </div>
              <div className="space-y-2">
                <Label>Content (plain text or HTML)</Label>
                <Textarea
                  value={sections.overview?.content ?? ''}
                  onChange={(e) => updateSection('overview', 'content', e.target.value)}
                  rows={6}
                  className="font-mono text-sm whitespace-pre-wrap"
                  placeholder="Paragraphs and line breaks will be preserved."
                />
              </div>
              <div className="space-y-2">
                <Label>Why Choose (use 3 commas (,,,) to separate points — each becomes a bullet)</Label>
                <Textarea
                  value={sections.overview?.whyChoose ?? ''}
                  onChange={(e) => updateSection('overview', 'whyChoose', e.target.value)}
                  rows={4}
                  placeholder="Point 1,,, Point 2,,, Point 3"
                />
                <p className="text-xs text-muted-foreground">Example: Industry-aligned syllabus,,, Specialized labs,,, Internships</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updateSection('overview', 'title', '')}>
                  Clear Title
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateSection('overview', 'content', '')}>
                  Clear Content
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateSection('overview', 'whyChoose', '')}>
                  Clear Why Choose
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vision & Mission</CardTitle>
              <CardDescription>
                Vision: plain text. Mission: use 3 commas (,,,) to separate points shown as bullets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Vision</Label>
                <Textarea
                  value={sections.visionMission?.vision ?? ''}
                  onChange={(e) => updateSection('visionMission', 'vision', e.target.value)}
                  rows={3}
                  placeholder="e.g. To become a pioneer in providing high-quality education..."
                />
              </div>
              <div className="space-y-2">
                <Label>Mission (use 3 commas (,,,) to separate points)</Label>
                <Textarea
                  value={sections.visionMission?.mission ?? ''}
                  onChange={(e) => updateSection('visionMission', 'mission', e.target.value)}
                  rows={4}
                  placeholder="Point 1,,, Point 2,,, Point 3"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updateSection('visionMission', 'vision', '')}>
                  Clear Vision
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateSection('visionMission', 'mission', '')}>
                  Clear Mission
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>
                Add a message that will appear in the Head of Department section. This message will be displayed above the HOD cards. HODs themselves are managed separately in the Admin → HODs panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={sections.hod?.message ?? ''}
                  onChange={(e) => updateSection('hod', 'message', e.target.value)}
                  rows={6}
                  placeholder="Enter the message for the Head of Department section..."
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags for formatting. The message will appear above the HOD cards.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updateSection('hod', 'message', '')}>
                  Clear Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programs Offered</CardTitle>
              <CardDescription>
                Create categories (e.g. B.Tech AP EAPCET, M.Tech & MCA), then add program cards under each with name, seats, and fee.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {courses.map((cat) => (
                <div key={cat.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={cat.name}
                      onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                      placeholder="Category name (e.g. B.Tech AP EAPCET)"
                      className="flex-1"
                    />
                    <Button variant="destructive" size="icon" onClick={() => deleteCategory(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="ml-4 space-y-2">
                    {cat.programs.map((prog, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2">
                        <Input
                          value={prog.name}
                          onChange={(e) => updateProgram(cat.id, i, 'name', e.target.value)}
                          placeholder="Program name"
                          className="w-48"
                        />
                        <Input
                          value={prog.seats}
                          onChange={(e) => updateProgram(cat.id, i, 'seats', e.target.value)}
                          placeholder="Seats"
                          className="w-24"
                        />
                        <Input
                          value={prog.fee}
                          onChange={(e) => updateProgram(cat.id, i, 'fee', e.target.value)}
                          placeholder="Fee"
                          className="w-28"
                        />
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteProgram(cat.id, i)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addProgram(cat.id)}>
                      <Plus className="h-4 w-4 mr-1" /> Add program
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-2" /> Add category
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum & Syllabus</CardTitle>
              <CardDescription>
                Upload syllabus PDFs by program and regulation. Existing regulation = update file; new regulation = add option.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(page?.curriculum?.programs?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <Label>Current programs & regulations</Label>
                  <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                    {page?.curriculum?.programs?.map((prog) => (
                      <div key={prog.name} className="space-y-2">
                        <div className="font-medium">{prog.name}</div>
                        {prog.regulations?.length ? (
                          <div className="flex flex-wrap gap-2 ml-4">
                            {prog.regulations.map((r) => (
                              <div key={r.name} className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md text-sm">
                                <span className="text-muted-foreground">{r.name}</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => handleDeleteRegulation(prog.name, r.name)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground ml-4">(no regulations)</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Program name</Label>
                  <Input value={curriculumProgram} onChange={(e) => setCurriculumProgram(e.target.value)} placeholder="B.Tech CSE" list="program-list" />
                  <datalist id="program-list">{allProgramNames.map((n) => <option key={n} value={n} />)}</datalist>
                </div>
                <div className="space-y-2">
                  <Label>Regulation</Label>
                  <Input value={curriculumRegulation} onChange={(e) => setCurriculumRegulation(e.target.value)} placeholder="e.g. R19, R20" list="regulation-list" />
                  <datalist id="regulation-list">{curriculumProgram && existingRegulations(curriculumProgram).map((n) => <option key={n} value={n} />)}</datalist>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Syllabus PDF</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".pdf" onChange={(e) => setCurriculumFile(e.target.files?.[0] ?? null)} className="max-w-sm" />
                  {curriculumFile && <span className="text-sm text-muted-foreground">{curriculumFile.name}</span>}
                </div>
              </div>
              <Button onClick={handleUploadSyllabus} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload syllabus'}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Curriculum intro text</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={sections.curriculum?.introText ?? ''}
                onChange={(e) => updateSection('curriculum', 'introText', e.target.value)}
                placeholder="Select a program and regulation to download the syllabus."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee At Glance</CardTitle>
              <CardDescription>Add cards with program name and fee. Each card shows program name and fee amount.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={sections.fee?.title ?? 'Fee at a glance'}
                  onChange={(e) => updateSection('fee', 'title', e.target.value)}
                  placeholder="Fee at a glance"
                />
              </div>
              <div className="space-y-2">
                <Label>Fee cards</Label>
                {feeItems.map((item, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <Input
                      value={item.programName}
                      onChange={(e) => updateFeeCard(i, 'programName', e.target.value)}
                      placeholder="Program name"
                      className="w-48"
                    />
                    <Input
                      value={item.fee}
                      onChange={(e) => updateFeeCard(i, 'fee', e.target.value)}
                      placeholder="Fee (e.g. ₹43,000)"
                      className="w-32"
                    />
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteFeeCard(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addFeeCard}>
                  <Plus className="h-4 w-4 mr-1" /> Add fee card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programOverview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
              <CardDescription>
                PEOs: use 3 commas (,,,) to separate → numbered list. PSOs: use 3 commas (,,,) to separate → bullets. POs: text + small badges (add/update/delete).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Program Educational Objectives (PEOs) — use 3 commas (,,,) to separate, shown as numbers</Label>
                <Textarea
                  value={sections.programOverview?.peos ?? ''}
                  onChange={(e) => updateSection('programOverview', 'peos', e.target.value)}
                  rows={3}
                  placeholder="Objective 1,,, Objective 2,,, Objective 3"
                />
              </div>
              <div className="space-y-2">
                <Label>Program Specific Outcomes (PSOs) — use 3 commas (,,,) to separate, shown as bullets</Label>
                <Textarea
                  value={sections.programOverview?.psos ?? ''}
                  onChange={(e) => updateSection('programOverview', 'psos', e.target.value)}
                  rows={3}
                  placeholder="Outcome 1,,, Outcome 2,,, Outcome 3"
                />
              </div>
              <div className="space-y-2">
                <Label>Program Outcomes (POs) — intro text</Label>
                <Textarea
                  value={sections.programOverview?.posText ?? ''}
                  onChange={(e) => updateSection('programOverview', 'posText', e.target.value)}
                  rows={2}
                  placeholder="e.g. Graduates will demonstrate: engineering knowledge, problem analysis..."
                />
              </div>
              <div className="space-y-2">
                <Label>PO badges (small tags — add, edit, delete)</Label>
                <div className="flex flex-wrap gap-2">
                  {posBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input
                        value={badge}
                        onChange={(e) => updatePosBadge(i, e.target.value)}
                        placeholder="Badge text"
                        className="w-36"
                      />
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deletePosBadge(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addPosBadge}>
                  <Plus className="h-4 w-4 mr-1" /> Add badge
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
              <CardDescription>Upload SVG icon and enter name for each facility card. Optional link URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {facilitiesCards.map((card) => (
                <div key={card.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {card.icon && (
                      <div className="w-12 h-12 flex items-center justify-center border rounded bg-muted">
                        <img src={card.icon.startsWith('http') ? card.icon : `${API_BASE}${card.icon}`} alt={card.name} className="w-8 h-8 object-contain" />
                      </div>
                    )}
                    <div className="flex-1 grid gap-2 md:grid-cols-2">
                      <Input value={card.name} onChange={(e) => updateFacilityCard(card.id, 'name', e.target.value)} placeholder="Facility name" />
                      <Input value={card.href || ''} onChange={(e) => updateFacilityCard(card.id, 'href', e.target.value)} placeholder="Link URL (optional)" />
                    </div>
                    <div className="flex gap-2">
                      <Input type="file" accept="image/svg+xml,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFacilityIconUpload(card.id, f); }} className="w-32" />
                      <Button variant="destructive" size="icon" onClick={() => deleteFacilityCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addFacilityCard}>
                <Plus className="h-4 w-4 mr-2" /> Add facility card
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whyViet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Why VIET</CardTitle>
              <CardDescription>Create cards with SVG icon, title, and subtitle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {whyVietCards.map((card) => (
                <div key={card.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {card.icon && (
                      <div className="w-12 h-12 flex items-center justify-center border rounded bg-muted">
                        <img src={card.icon.startsWith('http') ? card.icon : `${API_BASE}${card.icon}`} alt={card.title} className="w-8 h-8 object-contain" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input value={card.title} onChange={(e) => updateWhyVietCard(card.id, 'title', e.target.value)} placeholder="Card title" />
                      <Textarea value={card.subtitle} onChange={(e) => updateWhyVietCard(card.id, 'subtitle', e.target.value)} placeholder="Subtitle/description" rows={2} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Input type="file" accept="image/svg+xml,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleWhyVietIconUpload(card.id, f); }} className="w-32" />
                      <Button variant="destructive" size="icon" onClick={() => deleteWhyVietCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addWhyVietCard}>
                <Plus className="h-4 w-4 mr-2" /> Add card
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Edit 4 stat cards and create project cards with badge, title, and overview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Stat Cards</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {projectStats.map((stat, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={stat.label} onChange={(e) => updateProjectStat(i, 'label', e.target.value)} placeholder="Label" className="flex-1" />
                      <Input value={stat.value} onChange={(e) => updateProjectStat(i, 'value', e.target.value)} placeholder="Value" className="w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Project Cards</Label>
                {projectCards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 mb-3 space-y-2">
                    <div className="flex gap-2">
                      <Input value={card.badge} onChange={(e) => updateProjectCard(card.id, 'badge', e.target.value)} placeholder="Badge (e.g. IoT, AI/ML)" className="w-32" />
                      <Input value={card.title} onChange={(e) => updateProjectCard(card.id, 'title', e.target.value)} placeholder="Project title" className="flex-1" />
                      <Button variant="destructive" size="icon" onClick={() => deleteProjectCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea value={card.overview} onChange={(e) => updateProjectCard(card.id, 'overview', e.target.value)} placeholder="Project overview" rows={2} />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addProjectCard}>
                  <Plus className="h-4 w-4 mr-1" /> Add project card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Placements</CardTitle>
              <CardDescription>Edit 4 stat cards, add recruiter images (auto-duplicated for smooth scrolling), and create placement cards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Stat Cards</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {placementStats.map((stat, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={stat.label} onChange={(e) => updatePlacementStat(i, 'label', e.target.value)} placeholder="Label" className="flex-1" />
                      <Input value={stat.value} onChange={(e) => updatePlacementStat(i, 'value', e.target.value)} placeholder="Value" className="w-32" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Top Recruiters (images will auto-duplicate for scrolling)</Label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {recruiterImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img.startsWith('http') ? img : `${API_BASE}${img}`} alt={`Recruiter ${i + 1}`} className="w-24 h-12 object-contain border rounded bg-white p-1" />
                      <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-5 w-5" onClick={() => deleteRecruiterImage(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) addRecruiterImage(f); e.target.value = ''; }} className="max-w-xs" />
              </div>
              <div>
                <Label className="mb-3 block">Recent Placements</Label>
                {placementCards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 mb-3 space-y-3">
                    <div className="flex items-start gap-3">
                      {card.image && (
                        <div className="w-16 h-16 rounded overflow-hidden border bg-muted">
                          <img src={card.image.startsWith('http') ? card.image : `${API_BASE}${card.image}`} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 grid gap-2 md:grid-cols-2">
                        <Input value={card.name} onChange={(e) => updatePlacementCard(card.id, 'name', e.target.value)} placeholder="Student name" />
                        <Input value={card.company} onChange={(e) => updatePlacementCard(card.id, 'company', e.target.value)} placeholder="Company" />
                        <Input value={card.role} onChange={(e) => updatePlacementCard(card.id, 'role', e.target.value)} placeholder="Job role" />
                        <Input value={card.package} onChange={(e) => updatePlacementCard(card.id, 'package', e.target.value)} placeholder="Package" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePlacementImageUpload(card.id, f); }} className="w-32" />
                        <Button variant="destructive" size="icon" onClick={() => deletePlacementCard(card.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addPlacementCard}>
                  <Plus className="h-4 w-4 mr-1" /> Add placement card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rd" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>R&D</CardTitle>
              <CardDescription>Update section title, stat badges, research area badges, and project cards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input value={sections.rd?.title || 'R&D Lab'} onChange={(e) => updateSection('rd', 'title', e.target.value)} placeholder="R&D Lab" />
              </div>
              <div>
                <Label className="mb-3 block">Stat Badges</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {rdStats.map((stat, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={stat.label} onChange={(e) => updateRDStat(i, 'label', e.target.value)} placeholder="Label" className="flex-1" />
                      <Input value={stat.value} onChange={(e) => updateRDStat(i, 'value', e.target.value)} placeholder="Value" className="w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Research Areas (badges)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {rdResearchAreas.map((area, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input value={area} onChange={(e) => updateRDResearchArea(i, e.target.value)} placeholder="Area name" className="w-32" />
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deleteRDResearchArea(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addRDResearchArea}>
                  <Plus className="h-4 w-4 mr-1" /> Add research area
                </Button>
              </div>
              <div>
                <Label className="mb-3 block">Project Cards</Label>
                {rdCards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 mb-3 space-y-2">
                    <div className="flex gap-2">
                      <Input value={card.name} onChange={(e) => updateRDCard(card.id, 'name', e.target.value)} placeholder="Project name" className="flex-1" />
                      <Input value={card.duration} onChange={(e) => updateRDCard(card.id, 'duration', e.target.value)} placeholder="Duration (e.g. 2023–2025)" className="w-40" />
                      <Input value={card.funding} onChange={(e) => updateRDCard(card.id, 'funding', e.target.value)} placeholder="Funding" className="w-32" />
                      <Button variant="destructive" size="icon" onClick={() => deleteRDCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addRDCard}>
                  <Plus className="h-4 w-4 mr-1" /> Add project card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ideaCell" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Idea Cell</CardTitle>
              <CardDescription>Edit title, subtitle, stat cards (value + label), and pillar cards (icon, title, items).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={sections.ideaCell?.title || ''} onChange={(e) => updateSection('ideaCell', 'title', e.target.value)} placeholder="Innovation & entrepreneurship hub" />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea value={sections.ideaCell?.subtitle || ''} onChange={(e) => updateSection('ideaCell', 'subtitle', e.target.value)} placeholder="Subtitle text" rows={2} />
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Stat Cards</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {ideaCellStats.map((stat, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={stat.label} onChange={(e) => updateIdeaCellStat(i, 'label', e.target.value)} placeholder="Label" className="flex-1" />
                      <Input value={stat.value} onChange={(e) => updateIdeaCellStat(i, 'value', e.target.value)} placeholder="Value" className="w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Pillar Cards</Label>
                {ideaCellPillars.map((pillar) => (
                  <div key={pillar.id} className="border rounded-lg p-4 mb-3 space-y-3">
                    <div className="flex items-start gap-3">
                      {pillar.icon && (
                        <div className="w-12 h-12 flex items-center justify-center border rounded bg-muted">
                          <img src={pillar.icon.startsWith('http') ? pillar.icon : `${API_BASE}${pillar.icon}`} alt={pillar.title} className="w-8 h-8 object-contain" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <Input value={pillar.title} onChange={(e) => updateIdeaCellPillar(pillar.id, 'title', e.target.value)} placeholder="Pillar title" />
                        <div className="space-y-1">
                          {pillar.items.map((item, i) => (
                            <div key={i} className="flex gap-2">
                              <Input value={item} onChange={(e) => updateIdeaCellPillarItem(pillar.id, i, e.target.value)} placeholder={`Item ${i + 1}`} className="flex-1" />
                              <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deleteIdeaCellPillarItem(pillar.id, i)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addIdeaCellPillarItem(pillar.id)}>
                            <Plus className="h-3 w-3 mr-1" /> Add item
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input type="file" accept="image/svg+xml,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIdeaCellIconUpload(pillar.id, f); }} className="w-32" />
                        <Button variant="destructive" size="icon" onClick={() => deleteIdeaCellPillar(pillar.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addIdeaCellPillar}>
                  <Plus className="h-4 w-4 mr-1" /> Add pillar card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clubActivities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Club Activities</CardTitle>
              <CardDescription>Edit section title and subtitle, then create club cards with category, title, and subtitle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input value={sections.clubActivities?.title || ''} onChange={(e) => updateSection('clubActivities', 'title', e.target.value)} placeholder="Club Activities" />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea value={sections.clubActivities?.subtitle || ''} onChange={(e) => updateSection('clubActivities', 'subtitle', e.target.value)} placeholder="Subtitle text" rows={2} />
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Club Cards</Label>
                {clubCards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 mb-3 space-y-2">
                    <div className="flex gap-2">
                      <Input value={card.category} onChange={(e) => updateClubCard(card.id, 'category', e.target.value)} placeholder="Category (e.g. Programming)" className="w-40" />
                      <Input value={card.title} onChange={(e) => updateClubCard(card.id, 'title', e.target.value)} placeholder="Club title" className="flex-1" />
                      <Button variant="destructive" size="icon" onClick={() => deleteClubCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea value={card.subtitle} onChange={(e) => updateClubCard(card.id, 'subtitle', e.target.value)} placeholder="Subtitle/description" rows={2} />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addClubCard}>
                  <Plus className="h-4 w-4 mr-1" /> Add club card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="more" className="space-y-4">
          {['faculty', 'gallery', 'alumni'].map((key) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={(sections as any)[key]?.content ?? ''}
                  onChange={(e) => updateSection(key, 'content', e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSections} disabled={saving || uploadingHero}>
          {uploadingHero ? 'Uploading...' : saving ? 'Saving...' : 'Save all sections'}
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Regulation</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{regulationToDelete?.regulation}&quot; from &quot;{regulationToDelete?.program}&quot;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRegulation} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentPages;
