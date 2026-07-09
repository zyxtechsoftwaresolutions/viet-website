import { asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';

export type SportsGalleryItem = { image: string; title: string; caption: string };
export type SportsHallOfFameEntry = { name: string; achievement: string; sport: string; year: string };
export type SportsOffered = { name: string; category: string };
export type SportsFacility = { title: string; description: string; icon: string };

export type SportsContent = {
  hero: FacilityHero;
  about: { label: string; title: string; paragraphs: string[] };
  gallery: SportsGalleryItem[];
  hallOfFame: SportsHallOfFameEntry[];
  sportsOffered: SportsOffered[];
  facilities: SportsFacility[];
  contact: { label: string; title: string; description: string; ctaText: string; ctaHref: string };
};

export const DEFAULT_SPORTS_CONTENT: SportsContent = {
  hero: {
    badge: 'Facilities',
    title: 'Sports & Games',
    description:
      'A dedicated indoor sports room, expert PT staff, and a wide range of indoor and outdoor games for fitness and fun.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'Sports at VIET',
    paragraphs: [
      'Our college encourages students to stay active and build team spirit through a variety of sports and games. We offer volleyball, cricket, kho-kho, badminton, table tennis, chess, carroms, throw ball, and other indoor games.',
      'We have a dedicated indoor sports room for indoor games and expertised Physical Training (PT) staff to guide and train students in sports and fitness.',
    ],
  },
  gallery: [
    { image: '/GALLERY/section2.jpg', title: 'Sports achievements', caption: 'Our teams in action' },
    { image: '/GALLERY/section3.jpg', title: 'Tournaments & events', caption: 'Inter-college competitions' },
    { image: '/GALLERY/bg1.jpg', title: 'Indoor sports', caption: 'Dedicated sports room' },
    { image: '/GALLERY/bg2.jpg', title: 'PT & fitness', caption: 'Expert training and guidance' },
    { image: '/GALLERY/bg3.jpg', title: 'Campus sports', caption: 'Building team spirit' },
  ],
  hallOfFame: [
    {
      name: 'Student Achiever',
      achievement: 'Gold medal at Inter-College Cricket Tournament',
      sport: 'Cricket',
      year: '2024',
    },
    {
      name: 'Team Champions',
      achievement: 'Runners-up at Zonal Volleyball Championship',
      sport: 'Volleyball',
      year: '2024',
    },
    {
      name: 'Individual Excellence',
      achievement: 'Best player award at District Badminton Meet',
      sport: 'Badminton',
      year: '2023',
    },
    {
      name: 'Kho-Kho Squad',
      achievement: 'Winners at State Inter-College Kho-Kho',
      sport: 'Kho-Kho',
      year: '2023',
    },
  ],
  sportsOffered: [
    { name: 'Volleyball', category: 'Outdoor' },
    { name: 'Cricket', category: 'Outdoor' },
    { name: 'Kho-Kho', category: 'Outdoor' },
    { name: 'Badminton', category: 'Indoor' },
    { name: 'Table Tennis', category: 'Indoor' },
    { name: 'Chess', category: 'Indoor' },
    { name: 'Carroms', category: 'Indoor' },
    { name: 'Throw Ball', category: 'Outdoor' },
    { name: 'Other Indoor Games', category: 'Indoor' },
  ],
  facilities: [
    {
      title: 'Dedicated Indoor Sports Room',
      description:
        'A fully equipped indoor sports room for badminton, table tennis, chess, carroms, and other indoor games. Available for practice and inter-college events.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      title: 'Expertised Physical Training (PT)',
      description:
        'Our college has dedicated and experienced PT staff to train students in various sports, conduct fitness sessions, and prepare teams for tournaments.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ],
  contact: {
    label: 'Contact',
    title: 'Interested in sports?',
    description:
      'For sports activities, PT sessions, or representing the college in tournaments, get in touch with the sports cell or PT staff at the campus.',
    ctaText: 'Contact sports cell',
    ctaHref: 'mailto:admissions@viet.edu.in?subject=Sports enquiry',
  },
};

function normalizeGallery(v: unknown, fallback: SportsGalleryItem[]): SportsGalleryItem[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    image: asString(item?.image, fallback[i]?.image ?? ''),
    title: asString(item?.title, fallback[i]?.title ?? ''),
    caption: asString(item?.caption, fallback[i]?.caption ?? ''),
  }));
}

function normalizeHallOfFame(v: unknown, fallback: SportsHallOfFameEntry[]): SportsHallOfFameEntry[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    name: asString(item?.name, fallback[i]?.name ?? ''),
    achievement: asString(item?.achievement, fallback[i]?.achievement ?? ''),
    sport: asString(item?.sport, fallback[i]?.sport ?? ''),
    year: asString(item?.year, fallback[i]?.year ?? ''),
  }));
}

function normalizeSportsOffered(v: unknown, fallback: SportsOffered[]): SportsOffered[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    name: asString(item?.name, fallback[i]?.name ?? ''),
    category: asString(item?.category, fallback[i]?.category ?? ''),
  }));
}

function normalizeSportsFacilities(v: unknown, fallback: SportsFacility[]): SportsFacility[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    title: asString(item?.title, fallback[i]?.title ?? ''),
    description: asString(item?.description, fallback[i]?.description ?? ''),
    icon: asString(item?.icon, fallback[i]?.icon ?? ''),
  }));
}

export function normalizeSportsContent(raw: unknown): SportsContent {
  const d = DEFAULT_SPORTS_CONTENT;
  const c = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const about = c.about && typeof c.about === 'object' ? (c.about as Record<string, unknown>) : {};
  const contact = c.contact && typeof c.contact === 'object' ? (c.contact as Record<string, unknown>) : {};

  return {
    hero: normalizeHero(c.hero, d.hero),
    about: {
      label: asString(about.label, d.about.label),
      title: asString(about.title, d.about.title),
      paragraphs: asStringArray(about.paragraphs, d.about.paragraphs),
    },
    gallery: normalizeGallery(c.gallery, d.gallery),
    hallOfFame: normalizeHallOfFame(c.hallOfFame, d.hallOfFame),
    sportsOffered: normalizeSportsOffered(c.sportsOffered, d.sportsOffered),
    facilities: normalizeSportsFacilities(c.facilities, d.facilities),
    contact: {
      label: asString(contact.label, d.contact.label),
      title: asString(contact.title, d.contact.title),
      description: asString(contact.description, d.contact.description),
      ctaText: asString(contact.ctaText, d.contact.ctaText),
      ctaHref: asString(contact.ctaHref, d.contact.ctaHref),
    },
  };
}
