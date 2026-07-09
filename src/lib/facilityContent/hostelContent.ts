import { asStatPairs, asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';

export type HostelFacilityItem = { title: string; description: string; icon: string };
export type HostelRoom = { type: string; capacity: string; amenities: string };
export type HostelRule = { title: string; detail: string };
export type HostelBlock = { title: string; description: string; features: string[] };

export type HostelContent = {
  hero: FacilityHero;
  intro: { label: string; title: string; description: string; stats: { value: string; label: string }[] };
  boysHostel: HostelBlock;
  girlsHostel: HostelBlock;
  facilities: HostelFacilityItem[];
  rooms: HostelRoom[];
  community: { label: string; title: string; description: string; items: string[] };
  rules: { title: string; rules: HostelRule[] };
  cta: { title: string; description: string; buttonText: string; buttonHref: string };
};

export const DEFAULT_HOSTEL_CONTENT: HostelContent = {
  hero: {
    badge: 'Facilities',
    title: 'Our Hostel',
    description: 'A safe, comfortable, and vibrant living environment for students. Home away from home.',
    heroImage: '',
    video: '',
  },
  intro: {
    label: 'Home Away From Home',
    title: 'Hostel Life',
    description:
      'Our modern hostel facilities provide a safe, comfortable, and vibrant living environment for both boys and girls in separate, well-maintained blocks. Students forge lifelong friendships and create unforgettable memories while pursuing academic excellence in a secure and supportive community.',
    stats: [
      { value: '500+', label: 'Students Accommodated' },
      { value: '24/7', label: 'Security & Support' },
    ],
  },
  boysHostel: {
    title: 'Boys Hostel',
    description:
      'State-of-the-art residential facility designed for male students, offering a secure and conducive environment for academic growth and personal development.',
    features: [
      'Male wardens & support staff',
      'Spacious common areas',
      'Study-friendly environment',
      'Sports & fitness facilities',
    ],
  },
  girlsHostel: {
    title: 'Girls Hostel',
    description:
      'Premium accommodation exclusively for female students with enhanced security measures, creating a safe haven for learning and building lasting friendships.',
    features: [
      'Female wardens available 24/7',
      'Enhanced security protocols',
      'Well-lit & monitored premises',
      'Comfortable living spaces',
    ],
  },
  facilities: [
    {
      title: 'Residential Blocks',
      description:
        'Separate hostel blocks for boys and girls with dedicated wardens, 24/7 security, and CCTV surveillance',
      icon: '🏢',
    },
    {
      title: 'Dining Hall',
      description: 'Hygienic mess with nutritious vegetarian and non-vegetarian meals',
      icon: '🍽️',
    },
    {
      title: 'Recreation Rooms',
      description: 'Indoor games, TV rooms, and common areas for social interaction',
      icon: '🎮',
    },
    {
      title: 'Study Rooms',
      description: 'Dedicated quiet zones with WiFi for focused academic work',
      icon: '📚',
    },
    {
      title: 'Gym & Sports',
      description: 'Well-equipped fitness center and outdoor sports facilities',
      icon: '💪',
    },
    {
      title: 'Medical Care',
      description: 'On-campus health center with 24/7 first aid services',
      icon: '🏥',
    },
    {
      title: 'Laundry Service',
      description: 'Automated washing machines and dry cleaning facilities',
      icon: '👕',
    },
    {
      title: 'High-Speed WiFi',
      description: 'Uninterrupted internet connectivity throughout the hostel premises',
      icon: '📡',
    },
  ],
  rooms: [
    {
      type: 'Single Occupancy',
      capacity: '1 student',
      amenities: 'Attached bathroom, study table, wardrobe, AC',
    },
    {
      type: 'Double Occupancy',
      capacity: '2 students',
      amenities: 'Shared bathroom, study tables, wardrobes, fan',
    },
    {
      type: 'Triple Occupancy',
      capacity: '3 students',
      amenities: 'Common bathroom, study space, storage units',
    },
  ],
  community: {
    label: 'Beyond Academics',
    title: 'A Vibrant Community Experience',
    description:
      "Our hostel is more than just a place to sleep. It's a thriving community where students from diverse backgrounds come together, share experiences, and build networks that last a lifetime.",
    items: [
      'Cultural festivals and celebrations',
      'Sports tournaments and competitions',
      'Study groups and peer learning',
      'Weekend movie nights and events',
      'Student-led clubs and activities',
    ],
  },
  rules: {
    title: 'Hostel Rules & Guidelines',
    rules: [
      { title: 'Curfew Hours', detail: 'Entry restricted after 10:00 PM on weekdays' },
      { title: 'Visitor Policy', detail: 'Guests allowed in common areas with prior permission' },
      { title: 'Mess Timings', detail: 'Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM' },
      { title: 'Cleanliness', detail: 'Maintain room hygiene and common area etiquette' },
    ],
  },
  cta: {
    title: 'Need More Information?',
    description:
      'Our hostel administration team is here to answer all your questions about accommodation, facilities, and hostel life.',
    buttonText: 'Contact Hostel Office',
    buttonHref: '/about',
  },
};

function normalizeFacilityItems(v: unknown, fallback: HostelFacilityItem[]): HostelFacilityItem[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    title: asString(item?.title, fallback[i]?.title ?? ''),
    description: asString(item?.description, fallback[i]?.description ?? ''),
    icon: asString(item?.icon, fallback[i]?.icon ?? ''),
  }));
}

function normalizeRooms(v: unknown, fallback: HostelRoom[]): HostelRoom[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    type: asString(item?.type, fallback[i]?.type ?? ''),
    capacity: asString(item?.capacity, fallback[i]?.capacity ?? ''),
    amenities: asString(item?.amenities, fallback[i]?.amenities ?? ''),
  }));
}

function normalizeHostelBlock(v: unknown, fallback: HostelBlock): HostelBlock {
  const b = v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
  return {
    title: asString(b.title, fallback.title),
    description: asString(b.description, fallback.description),
    features: asStringArray(b.features, fallback.features),
  };
}

function normalizeHostelRules(v: unknown, fallback: HostelRule[]): HostelRule[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    title: asString(item?.title, fallback[i]?.title ?? ''),
    detail: asString(item?.detail, fallback[i]?.detail ?? ''),
  }));
}

export function normalizeHostelContent(raw: unknown): HostelContent {
  const d = DEFAULT_HOSTEL_CONTENT;
  const c = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const intro = c.intro && typeof c.intro === 'object' ? (c.intro as Record<string, unknown>) : {};
  const community =
    c.community && typeof c.community === 'object' ? (c.community as Record<string, unknown>) : {};
  const rules = c.rules && typeof c.rules === 'object' ? (c.rules as Record<string, unknown>) : {};
  const cta = c.cta && typeof c.cta === 'object' ? (c.cta as Record<string, unknown>) : {};

  return {
    hero: normalizeHero(c.hero, d.hero),
    intro: {
      label: asString(intro.label, d.intro.label),
      title: asString(intro.title, d.intro.title),
      description: asString(intro.description, d.intro.description),
      stats: asStatPairs(intro.stats, d.intro.stats),
    },
    boysHostel: normalizeHostelBlock(c.boysHostel, d.boysHostel),
    girlsHostel: normalizeHostelBlock(c.girlsHostel, d.girlsHostel),
    facilities: normalizeFacilityItems(c.facilities, d.facilities),
    rooms: normalizeRooms(c.rooms, d.rooms),
    community: {
      label: asString(community.label, d.community.label),
      title: asString(community.title, d.community.title),
      description: asString(community.description, d.community.description),
      items: asStringArray(community.items, d.community.items),
    },
    rules: {
      title: asString(rules.title, d.rules.title),
      rules: normalizeHostelRules(rules.rules, d.rules.rules),
    },
    cta: {
      title: asString(cta.title, d.cta.title),
      description: asString(cta.description, d.cta.description),
      buttonText: asString(cta.buttonText, d.cta.buttonText),
      buttonHref: asString(cta.buttonHref, d.cta.buttonHref),
    },
  };
}
