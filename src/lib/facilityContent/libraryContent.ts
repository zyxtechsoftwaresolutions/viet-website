import { asStatPairs, asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';

export type LibraryFeature = { icon: string; title: string; description: string };
export type LibraryTiming = { day: string; time: string };

export type LibraryContent = {
  hero: FacilityHero;
  about: { label: string; title: string; paragraphs: string[] };
  features: LibraryFeature[];
  collection: { label: string; title: string; stats: { value: string; label: string }[] };
  timings: LibraryTiming[];
  rules: string[];
};

export const DEFAULT_LIBRARY_CONTENT: LibraryContent = {
  hero: {
    badge: 'Facilities',
    title: 'Our Library',
    description: 'A place of knowledge, inspiration, and academic excellence.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About our library',
    title: 'About Our Library',
    paragraphs: [
      'The college library is the heart of our academic community. Established in 1985, our library has grown to house over 50,000 books, covering all major disciplines including Science, Arts, Commerce, Engineering, and Humanities.',
      'Our library provides a peaceful and conducive environment for learning, research, and intellectual growth. With modern facilities and dedicated staff, we are committed to supporting the academic success of every student.',
    ],
  },
  features: [
    {
      icon: 'book-open',
      title: 'Vast Collection',
      description: '50,000+ books, journals, magazines, and reference materials',
    },
    {
      icon: 'users',
      title: 'Spacious Reading Hall',
      description: 'Seating capacity for 500+ students with comfortable furniture',
    },
    {
      icon: 'wifi',
      title: 'Free Wi-Fi',
      description: 'High-speed internet access for research and online resources',
    },
    {
      icon: 'clock',
      title: 'Extended Hours',
      description: 'Open from 8 AM to 8 PM on weekdays, 9 AM to 5 PM on weekends',
    },
    {
      icon: 'coffee',
      title: 'Refreshment Zone',
      description: 'Cafeteria nearby for snacks and beverages',
    },
    {
      icon: 'map-pin',
      title: 'Central Location',
      description: 'Located in the main academic building, easily accessible',
    },
  ],
  collection: {
    label: 'At a glance',
    title: 'Our Collection',
    stats: [
      { value: '50,000+', label: 'Books' },
      { value: '200+', label: 'Journals' },
      { value: '500+', label: 'Magazines' },
      { value: '1,000+', label: 'E-Books' },
    ],
  },
  timings: [
    { day: 'Monday - Friday', time: '8:00 AM - 8:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', time: '10:00 AM - 4:00 PM' },
  ],
  rules: [
    'Maintain silence in the reading area',
    'Valid ID card required for entry',
    'Books can be borrowed for 14 days',
    'No food or drinks inside the library',
    'Handle books with care',
  ],
};

function normalizeLibraryFeatures(v: unknown, fallback: LibraryFeature[]): LibraryFeature[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    icon: asString(item?.icon, fallback[i]?.icon ?? ''),
    title: asString(item?.title, fallback[i]?.title ?? ''),
    description: asString(item?.description, fallback[i]?.description ?? ''),
  }));
}

function normalizeTimings(v: unknown, fallback: LibraryTiming[]): LibraryTiming[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    day: asString(item?.day, fallback[i]?.day ?? ''),
    time: asString(item?.time, fallback[i]?.time ?? ''),
  }));
}

export function normalizeLibraryContent(raw: unknown): LibraryContent {
  const d = DEFAULT_LIBRARY_CONTENT;
  const c = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const about = c.about && typeof c.about === 'object' ? (c.about as Record<string, unknown>) : {};
  const collection =
    c.collection && typeof c.collection === 'object' ? (c.collection as Record<string, unknown>) : {};

  return {
    hero: normalizeHero(c.hero, d.hero),
    about: {
      label: asString(about.label, d.about.label),
      title: asString(about.title, d.about.title),
      paragraphs: asStringArray(about.paragraphs, d.about.paragraphs),
    },
    features: normalizeLibraryFeatures(c.features, d.features),
    collection: {
      label: asString(collection.label, d.collection.label),
      title: asString(collection.title, d.collection.title),
      stats: asStatPairs(collection.stats, d.collection.stats),
    },
    timings: normalizeTimings(c.timings, d.timings),
    rules: asStringArray(c.rules, d.rules),
  };
}
