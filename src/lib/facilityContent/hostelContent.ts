import { asStatPairs, asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';

export type HostelIconItem = { title: string; icon: string };
export type HostelRoom = { type: string; capacity: string; amenities: string };
export type HostelRule = { title: string; detail: string };
export type HostelBlock = { title: string; description: string; features: string[] };
export type HostelContactColumn = { title: string; lines: string[]; email?: string };

export type HostelContent = {
  hero: FacilityHero;
  intro: { label: string; title: string; description: string; stats: { value: string; label: string }[] };
  boysHostel: HostelBlock;
  girlsHostel: HostelBlock;
  facilities: HostelIconItem[];
  rooms: HostelRoom[];
  community: { label: string; title: string; description: string; items: string[] };
  rules: { title: string; rules: HostelRule[] };
  cta: { title: string; description: string; buttonText: string; buttonHref: string };
  contact: { columns: HostelContactColumn[] };
};

/** Material Design SVG paths — same icon system as NSS page */
const DEFAULT_FACILITY_ICONS = [
  'M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z',
  'M8.1,13.34L2,20.34V22H22V20.34L15.9,13.34C15.29,12.73 14.68,12.11 14.13,11.5C13.5,10.78 12.78,10.12 12,9.5C11.22,10.12 10.5,10.78 9.87,11.5C9.32,12.11 8.71,12.73 8.1,13.34M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2Z',
  'M6,9H8V11H10V9H12V7H10V5H8V7H6V9M15.5,12A1.5,1.5 0 0,1 14,10.5A1.5,1.5 0 0,1 15.5,9A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 15.5,12M18.5,9A1.5,1.5 0 0,1 17,7.5A1.5,1.5 0 0,1 18.5,6A1.5,1.5 0 0,1 20,7.5A1.5,1.5 0 0,1 18.5,9M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  'M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z',
  'M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z',
  'M19.5,3.5L18,2L16.5,3.5L15,2L13.5,3.5L12,2L10.5,3.5L9,2L7.5,3.5L6,2L4.5,3.5L3,2V22L4.5,20.5L6,22L7.5,20.5L9,22L10.5,20.5L12,22L13.5,20.5L15,22L16.5,20.5L18,22L19.5,20.5L21,22V2L19.5,3.5M19,19H5V5H19V19M6,15H18V17H6V15M6,11H18V13H6V11M6,7H18V9H6V7Z',
  'M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.37C4.8,14.27 4.3,15.57 4.3,16.97V20A1,1 0 0,1 3,21H1V20A3,3 0 0,1 4,17V12A2,2 0 0,1 6,10H9V8A2,2 0 0,1 11,6H13A2,2 0 0,1 15,8V10H18A2,2 0 0,1 20,12V17A3,3 0 0,1 23,20V21H21A1,1 0 0,1 20,20V16.97C20,15.57 19.5,14.27 18.6,13.37L17,11.77V20A1,1 0 0,1 16,21Z',
  'M1,9L3,11C7.97,6.03 16.03,6.03 21,11L23,9C16.93,2.93 7.08,2.93 1,9M9,17L12,20L15,17C13.35,15.34 10.66,15.34 9,17M5,13L7,15C9.76,12.24 14.24,12.24 17,15L19,13C15.14,9.14 8.87,9.14 5,13Z',
];

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
      { value: '2', label: 'Separate Blocks' },
      { value: '3', label: 'Room Configurations' },
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
    { title: 'Residential Blocks', icon: DEFAULT_FACILITY_ICONS[0] },
    { title: 'Dining Hall', icon: DEFAULT_FACILITY_ICONS[1] },
    { title: 'Recreation Rooms', icon: DEFAULT_FACILITY_ICONS[2] },
    { title: 'Study Rooms', icon: DEFAULT_FACILITY_ICONS[3] },
    { title: 'Gym & Sports', icon: DEFAULT_FACILITY_ICONS[4] },
    { title: 'Medical Care', icon: DEFAULT_FACILITY_ICONS[5] },
    { title: 'Laundry Service', icon: DEFAULT_FACILITY_ICONS[6] },
    { title: 'High-Speed WiFi', icon: DEFAULT_FACILITY_ICONS[7] },
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
  contact: {
    columns: [
      {
        title: 'Hostel Warden',
        lines: ['Contact via college office'],
        email: 'admissions@viet.edu.in',
      },
      { title: 'Office Hours', lines: ['Monday – Friday', '9:00 AM – 5:00 PM'] },
      { title: 'Location', lines: ['Hostel Block, VIET Campus', 'Narava, Visakhapatnam'] },
    ],
  },
};

function isSvgPath(icon: string): boolean {
  return /^[Mm]/.test(icon.trim());
}

function normalizeIconItems(v: unknown, fallback: HostelIconItem[]): HostelIconItem[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => {
    const rawIcon = asString(item?.icon, '');
    const icon = isSvgPath(rawIcon) ? rawIcon : (fallback[i]?.icon ?? DEFAULT_FACILITY_ICONS[i % DEFAULT_FACILITY_ICONS.length]);
    return {
      title: asString(item?.title, fallback[i]?.title ?? ''),
      icon,
    };
  });
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
  const contact = c.contact && typeof c.contact === 'object' ? (c.contact as Record<string, unknown>) : {};

  const columnsRaw = Array.isArray((contact as any).columns) ? (contact as any).columns : null;
  const columns: HostelContactColumn[] = (columnsRaw ?? d.contact.columns).map((col: any, i: number) => ({
    title: asString(col?.title, d.contact.columns[i]?.title ?? ''),
    lines: asStringArray(col?.lines, d.contact.columns[i]?.lines ?? []),
    email: asString(col?.email) || undefined,
  }));

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
    facilities: normalizeIconItems(c.facilities, d.facilities),
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
    contact: { columns },
  };
}
