import { getVibeSlotImageSpec } from '@/lib/vibeAtVietLayout';

export type ImageUploadSpec = {
  dimensions: string;
  aspectRatio?: string;
  hint?: string;
};

export const IMAGE_SPECS = {
  facultyHeroBackground: {
    dimensions: '1920 × 1080 px',
    aspectRatio: '16:9',
    hint: 'Full-width hero background (cover crop)',
  },
  facultyPortrait: {
    dimensions: '800 × 800 px',
    aspectRatio: '1:1',
    hint: 'Square faculty card photo',
  },
  hodPortrait: {
    dimensions: '600 × 800 px',
    aspectRatio: '3:4',
    hint: 'HOD profile card',
  },
  departmentHero: {
    dimensions: '1920 × 1080 px',
    aspectRatio: '16:9',
    hint: 'Department page hero banner',
  },
  departmentHodPhoto: {
    dimensions: '600 × 800 px',
    aspectRatio: '3:4',
    hint: 'HOD section portrait',
  },
  departmentGallery: {
    dimensions: '1200 × 900 px',
    aspectRatio: '4:3',
    hint: 'Department gallery image',
  },
  departmentFacilityIcon: {
    dimensions: '128 × 128 px',
    aspectRatio: '1:1',
    hint: 'SVG or square PNG icon',
  },
  departmentRecruiterLogo: {
    dimensions: '240 × 120 px',
    aspectRatio: '2:1',
    hint: 'Recruiter / company logo',
  },
  departmentPlacementCard: {
    dimensions: '800 × 1000 px',
    aspectRatio: '4:5',
    hint: 'Placement highlight card image',
  },
  leaderHero: {
    dimensions: '1200 × 1500 px',
    aspectRatio: '4:5',
    hint: 'Chairman / Principal hero portrait',
  },
  aboutHero: {
    dimensions: '1920 × 1080 px',
    aspectRatio: '16:9',
    hint: 'About page hero background',
  },
  aboutProfile: {
    dimensions: '800 × 1000 px',
    aspectRatio: '4:5',
    hint: 'Leadership profile image',
  },
  aboutGallery: {
    dimensions: '1200 × 900 px',
    aspectRatio: '4:3',
    hint: 'About page gallery photo',
  },
  facilityHero: {
    dimensions: '1920 × 1080 px',
    aspectRatio: '16:9',
    hint: 'Facility page hero banner',
  },
  facilityGallery: {
    dimensions: '1200 × 900 px',
    aspectRatio: '4:3',
    hint: 'Facility gallery image',
  },
  homeGallery: {
    dimensions: '800 × 800 px',
    aspectRatio: '1:1',
    hint: 'Home gallery grid tile',
  },
  carouselSlide: {
    dimensions: '1920 × 1080 px',
    aspectRatio: '16:9',
    hint: 'Homepage carousel slide',
  },
  heroVideoPoster: {
    dimensions: '1920 × 1080 px',
    aspectRatio: '16:9',
    hint: 'Hero video poster / thumbnail',
  },
  heroVideoMobilePoster: {
    dimensions: '1080 × 1920 px',
    aspectRatio: '9:16',
    hint: 'Mobile hero poster (portrait)',
  },
  happeningsEvent: {
    dimensions: '800 × 500 px',
    aspectRatio: '16:10',
    hint: 'Event / Happenings card image',
  },
  newsCard: {
    dimensions: '800 × 500 px',
    aspectRatio: '16:10',
    hint: 'News or announcement card',
  },
  galleryPhoto: {
    dimensions: '1600 × 1200 px',
    aspectRatio: '4:3',
    hint: 'Main gallery photo',
  },
  recruiterLogo: {
    dimensions: '240 × 120 px',
    aspectRatio: '2:1',
    hint: 'Company logo (transparent PNG preferred)',
  },
  placementCarousel: {
    dimensions: '560 × 760 px',
    aspectRatio: '7:9.5',
    hint: 'Placement student carousel card',
  },
  transportCard: {
    dimensions: '800 × 600 px',
    aspectRatio: '4:3',
    hint: 'Transport route hover image',
  },
  departmentLogo: {
    dimensions: '400 × 400 px',
    aspectRatio: '1:1',
    hint: 'Department icon / logo',
  },
  admissionPopup: {
    dimensions: '1200 × 800 px',
    aspectRatio: '3:2',
    hint: 'Admission popup slide image',
  },
  campusLifeHighlight: {
    dimensions: '1600 × 1200 px',
    aspectRatio: '4:3',
    hint: 'Campus Life magazine grid photo — large originals are auto-compressed on upload',
  },
  vibeAtViet: (slot: number): ImageUploadSpec => {
    const spec = getVibeSlotImageSpec(slot);
    return {
      dimensions: spec.dimensions,
      aspectRatio: spec.aspectRatio,
      hint: `Vibe@Viet grid position ${slot}`,
    };
  },
} as const;
