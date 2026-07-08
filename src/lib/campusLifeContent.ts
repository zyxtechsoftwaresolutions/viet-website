/** Shared Campus Life CMS shape — used by public page + admin editor. */

export type CampusHighlight = {
  id: string;
  image: string;
  title: string;
  description?: string;
  alt?: string;
  /** large | medium | tall — magazine grid layout */
  size: 'large' | 'medium' | 'wide' | 'full';
};

export type CampusStat = { number: string; label: string };
export type CampusFeature = { title: string; description: string };
export type CampusFacility = { icon: string; title: string; desc: string };
export type CampusEvent = { title: string; subtitle: string; description: string; gradient: string };
export type CampusTestimonial = { quote: string; name: string; role: string };

export type CampusLifeContent = {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  intro: {
    label: string;
    title: string;
    titleAccent: string;
    paragraphs: string[];
  };
  highlightsLabel: string;
  highlightsTitle: string;
  highlights: CampusHighlight[];
  statsLabel: string;
  statsTitle: string;
  statsTitleAccent: string;
  stats: CampusStat[];
  featuresLabel: string;
  featuresTitle: string;
  featuresTitleAccent: string;
  features: CampusFeature[];
  testimonial: CampusTestimonial;
  facilitiesLabel: string;
  facilitiesTitle: string;
  facilitiesTitleAccent: string;
  facilities: CampusFacility[];
  eventsLabel: string;
  eventsTitle: string;
  eventsSubtitle: string;
  events: CampusEvent[];
  cta: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
};

function uid(prefix = 'hl') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const DEFAULT_CAMPUS_LIFE_CONTENT: CampusLifeContent = {
  hero: {
    badge: 'VIET Campus',
    title: 'Campus Life',
    description: 'Where innovation meets inspiration at Visakha Institute of Engineering and Technology',
  },
  intro: {
    label: 'About campus life',
    title: 'A Living, Breathing',
    titleAccent: 'Ecosystem',
    paragraphs: [
      "At Visakha Institute of Engineering and Technology, campus life transcends the traditional boundaries of education. We've created an environment where cutting-edge technology meets creative expression, where rigorous academics blend with vibrant cultural experiences.",
      'Our campus is a melting pot of ideas, innovations, and inspirations. From state-of-the-art laboratories to dynamic student-led initiatives, every corner of VIET pulses with energy and possibility. This is where future engineers are forged, leaders are born, and dreams take flight.',
    ],
  },
  highlightsLabel: 'Explore our campus',
  highlightsTitle: 'Campus Highlights',
  highlights: [
    {
      id: 'hl-1',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop',
      title: 'Academic Excellence',
      description:
        'State-of-the-art smart classrooms equipped with interactive technology, fostering collaborative learning and innovative thinking.',
      alt: 'Modern classroom at VIET',
      size: 'large',
    },
    {
      id: 'hl-2',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
      title: 'Campus Architecture',
      alt: 'VIET campus building',
      size: 'medium',
    },
    {
      id: 'hl-3',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
      title: 'Innovation Labs',
      alt: 'Innovation lab at VIET',
      size: 'medium',
    },
    {
      id: 'hl-4',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop',
      title: 'Cultural Celebrations',
      alt: 'Cultural activities at VIET',
      size: 'wide',
    },
    {
      id: 'hl-5',
      image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&h=400&fit=crop',
      title: 'Sports & Fitness',
      alt: 'Sports facilities at VIET',
      size: 'wide',
    },
    {
      id: 'hl-6',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=400&fit=crop',
      title: 'Knowledge Repository',
      description: 'Extensive digital and physical collections supporting research and learning',
      alt: 'VIET library',
      size: 'full',
    },
  ],
  statsLabel: 'At a glance',
  statsTitle: 'Campus',
  statsTitleAccent: 'Statistics',
  stats: [
    { number: '25+', label: 'Active Clubs' },
    { number: '1000+', label: 'Students' },
    { number: '50+', label: 'Events/Year' },
    { number: '100%', label: 'Placement Support' },
    { number: '200+', label: 'Industry Partners' },
    { number: '15+', label: 'Years of Excellence' },
  ],
  featuresLabel: 'What defines VIET',
  featuresTitle: 'What Defines',
  featuresTitleAccent: 'VIET Life',
  features: [
    {
      title: 'Student Innovation Hub',
      description:
        'Dedicated spaces for project development, hackathons, and collaborative innovation. Access to cutting-edge tools, mentorship from industry experts, and funding opportunities for breakthrough ideas.',
    },
    {
      title: 'Technical Societies',
      description:
        'Over 25 student-run clubs spanning robotics, AI/ML, web development, cyber security, and emerging technologies. Regular workshops, competitions, and peer-learning sessions drive skill development.',
    },
    {
      title: 'Cultural Extravaganza',
      description:
        'Annual cultural festivals, inter-college competitions, talent showcases, and creative expression platforms. From classical arts to contemporary performances, every talent finds its stage.',
    },
    {
      title: 'Sports Excellence',
      description:
        'Professional-grade facilities for cricket, basketball, volleyball, athletics, and indoor games. Regular tournaments, coaching programs, and fitness training for holistic development.',
    },
    {
      title: 'Industry Connect',
      description:
        'Regular guest lectures, industrial visits, internship programs, and placement training. Strong industry partnerships ensure students stay ahead of market demands and career opportunities.',
    },
    {
      title: 'Research Opportunities',
      description:
        'State-of-the-art laboratories, access to research publications, faculty mentorship for projects, and opportunities to present at national and international conferences.',
    },
  ],
  testimonial: {
    quote:
      "VIET isn't just an institution – it's a launchpad for dreams. The blend of rigorous academics, hands-on projects, and vibrant campus culture shaped me into who I am today.",
    name: 'VIET Alumni',
    role: 'Class of 2023',
  },
  facilitiesLabel: 'Infrastructure',
  facilitiesTitle: 'World-Class',
  facilitiesTitleAccent: 'Facilities',
  facilities: [
    { icon: '🔬', title: 'Advanced Labs', desc: 'Industry-standard equipment and technology' },
    { icon: '💻', title: 'Computer Centers', desc: 'Latest software with high-speed internet' },
    { icon: '📚', title: 'Digital Library', desc: 'Vast collection of books and e-resources' },
    { icon: '🏢', title: 'Smart Classrooms', desc: 'Interactive digital learning spaces' },
    { icon: '🏃', title: 'Sports Complex', desc: 'Multi-sport facilities and fitness center' },
    { icon: '🍽️', title: 'Modern Cafeteria', desc: 'Hygienic food with diverse cuisines' },
    { icon: '🏠', title: 'Comfortable Hostels', desc: 'Safe and secure residential facilities' },
    { icon: '🎭', title: 'Auditorium', desc: 'Premium venue for events and seminars' },
    { icon: '🏥', title: 'Health Center', desc: 'On-campus medical and wellness support' },
    { icon: '🚌', title: 'Transport', desc: 'Convenient bus services across routes' },
    { icon: '🏦', title: 'Banking', desc: 'ATM and banking facilities on campus' },
    { icon: '📡', title: 'Wi-Fi Campus', desc: 'High-speed connectivity throughout' },
  ],
  eventsLabel: 'Celebrations',
  eventsTitle: 'Major Events',
  eventsSubtitle: 'Celebrations that bring our campus alive',
  events: [
    {
      title: 'TechnoVista',
      subtitle: 'Technical Symposium',
      description:
        'Annual tech fest featuring hackathons, paper presentations, project exhibitions, and guest lectures from industry leaders.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Spectrum',
      subtitle: 'Cultural Festival',
      description:
        'A vibrant celebration of arts, music, dance, drama, and creative expression. Inter-college competitions and performances.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Athlexa',
      subtitle: 'Sports Championship',
      description:
        'Multi-sport tournament showcasing athletic talent. Team building, competitive spirit, and celebration of fitness.',
      gradient: 'from-orange-500 to-red-500',
    },
  ],
  cta: {
    titleLine1: 'Ready to Experience',
    titleLine2: 'VIET Campus Life?',
    description:
      'Join us in shaping the future. Be part of a community where innovation thrives, talents flourish, and futures are built.',
    buttonText: 'EXPLORE VIET',
    buttonHref: 'https://viet.edu.in',
  },
};

const SIZE_SET = new Set(['large', 'medium', 'wide', 'full']);

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function asStringArray(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  return v.map((x) => (typeof x === 'string' ? x : '')).filter(Boolean);
}

/** Merge API /pages content with defaults so old rows still render. */
export function normalizeCampusLifeContent(raw: unknown): CampusLifeContent {
  const d = DEFAULT_CAMPUS_LIFE_CONTENT;
  const c = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const hero = c.hero && typeof c.hero === 'object' ? c.hero : {};
  const intro = c.intro && typeof c.intro === 'object' ? c.intro : {};
  const testimonial = c.testimonial && typeof c.testimonial === 'object' ? c.testimonial : {};
  const cta = c.cta && typeof c.cta === 'object' ? c.cta : {};

  const highlightsRaw = Array.isArray(c.highlights) ? c.highlights : null;
  const highlights: CampusHighlight[] = (highlightsRaw ?? d.highlights).map((h: any, i: number) => {
    const size = SIZE_SET.has(h?.size) ? h.size : i === 0 ? 'large' : i === 5 ? 'full' : i >= 3 ? 'wide' : 'medium';
    return {
      id: asString(h?.id, uid()),
      image: asString(h?.image || h?.url),
      title: asString(h?.title),
      description: asString(h?.description) || undefined,
      alt: asString(h?.alt) || undefined,
      size,
    };
  });

  return {
    hero: {
      badge: asString(hero.badge, d.hero.badge),
      title: asString(hero.title, d.hero.title),
      description: asString(hero.description, d.hero.description),
    },
    intro: {
      label: asString(intro.label, d.intro.label),
      title: asString(intro.title, d.intro.title),
      titleAccent: asString(intro.titleAccent, d.intro.titleAccent),
      paragraphs: asStringArray(intro.paragraphs, d.intro.paragraphs),
    },
    highlightsLabel: asString(c.highlightsLabel, d.highlightsLabel),
    highlightsTitle: asString(c.highlightsTitle, d.highlightsTitle),
    highlights,
    statsLabel: asString(c.statsLabel, d.statsLabel),
    statsTitle: asString(c.statsTitle, d.statsTitle),
    statsTitleAccent: asString(c.statsTitleAccent, d.statsTitleAccent),
    stats: Array.isArray(c.stats)
      ? c.stats.map((s: any) => ({ number: asString(s?.number || s?.value), label: asString(s?.label) }))
      : d.stats,
    featuresLabel: asString(c.featuresLabel, d.featuresLabel),
    featuresTitle: asString(c.featuresTitle, d.featuresTitle),
    featuresTitleAccent: asString(c.featuresTitleAccent, d.featuresTitleAccent),
    features: Array.isArray(c.features)
      ? c.features.map((f: any) => ({ title: asString(f?.title), description: asString(f?.description) }))
      : d.features,
    testimonial: {
      quote: asString(testimonial.quote, d.testimonial.quote),
      name: asString(testimonial.name, d.testimonial.name),
      role: asString(testimonial.role, d.testimonial.role),
    },
    facilitiesLabel: asString(c.facilitiesLabel, d.facilitiesLabel),
    facilitiesTitle: asString(c.facilitiesTitle, d.facilitiesTitle),
    facilitiesTitleAccent: asString(c.facilitiesTitleAccent, d.facilitiesTitleAccent),
    facilities: Array.isArray(c.facilities)
      ? c.facilities.map((f: any) => ({
          icon: asString(f?.icon, '📌'),
          title: asString(f?.title),
          desc: asString(f?.desc || f?.description),
        }))
      : d.facilities,
    eventsLabel: asString(c.eventsLabel, d.eventsLabel),
    eventsTitle: asString(c.eventsTitle, d.eventsTitle),
    eventsSubtitle: asString(c.eventsSubtitle, d.eventsSubtitle),
    events: Array.isArray(c.events)
      ? c.events.map((e: any) => ({
          title: asString(e?.title),
          subtitle: asString(e?.subtitle),
          description: asString(e?.description),
          gradient: asString(e?.gradient, 'from-amber-500 to-orange-500'),
        }))
      : d.events,
    cta: {
      titleLine1: asString(cta.titleLine1, d.cta.titleLine1),
      titleLine2: asString(cta.titleLine2, d.cta.titleLine2),
      description: asString(cta.description, d.cta.description),
      buttonText: asString(cta.buttonText, d.cta.buttonText),
      buttonHref: asString(cta.buttonHref, d.cta.buttonHref),
    },
  };
}

export function createEmptyHighlight(): CampusHighlight {
  return {
    id: uid(),
    image: '',
    title: '',
    description: '',
    alt: '',
    size: 'medium',
  };
}

export function highlightGridClass(size: CampusHighlight['size']): string {
  switch (size) {
    case 'large':
      return 'col-span-12 md:col-span-8 md:row-span-2';
    case 'wide':
      return 'col-span-12 md:col-span-6';
    case 'full':
      return 'col-span-12';
    case 'medium':
    default:
      return 'col-span-12 md:col-span-4';
  }
}
