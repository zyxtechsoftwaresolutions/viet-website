import { asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';

export type CafeteriaGalleryItem = {
  image: string;
  title: string;
  caption: string;
  large?: boolean;
  wide?: boolean;
};
export type CafeteriaFeature = { title: string; description: string; icon: string };

export type CafeteriaContent = {
  hero: FacilityHero;
  about: { label: string; title: string; paragraphs: string[] };
  gallery: CafeteriaGalleryItem[];
  features: CafeteriaFeature[];
  contact: { label: string; title: string; description: string; ctaText: string; ctaHref: string };
};

export const DEFAULT_CAFETERIA_CONTENT: CafeteriaContent = {
  hero: {
    badge: 'Facilities',
    title: 'Cafeteria & Canteen',
    description:
      'A hygienic, spacious cafeteria offering a variety of meals, snacks, and beverages at affordable prices for students and staff.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About',
    title: 'Cafeteria at VIET',
    paragraphs: [
      'Our college cafeteria provides a clean, comfortable space for students and staff to enjoy meals and refreshments throughout the day. We focus on hygiene, variety, and affordability so that everyone on campus can eat well without leaving the premises.',
      'The cafeteria is open during college hours and serves breakfast, lunch, and evening snacks. It also doubles as a social space where students can take a break, catch up with friends, and recharge before the next class.',
    ],
  },
  gallery: [
    {
      image: '/GALLERY/section2.jpg',
      title: 'Dining area',
      caption: 'Spacious and comfortable seating',
      large: true,
    },
    { image: '/GALLERY/section3.jpg', title: 'Food counter', caption: 'Variety of meals and snacks' },
    { image: '/GALLERY/bg1.jpg', title: 'Cafeteria space', caption: 'Clean and hygienic environment' },
    { image: '/GALLERY/bg2.jpg', title: 'Refreshments', caption: 'Beverages and light bites' },
    { image: '/GALLERY/bg3.jpg', title: 'Campus dining', caption: 'A place to relax and refuel' },
    {
      image: '/GALLERY/bg4.jpg',
      title: 'Student hub',
      caption: 'Where students gather and connect',
      wide: true,
    },
  ],
  features: [
    {
      title: 'Hygienic kitchen & serving',
      description:
        'Our cafeteria follows strict hygiene standards. Food is prepared in a clean kitchen and served in a well-maintained dining area for the safety and health of our students and staff.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      title: 'Variety of food',
      description:
        'From breakfast to lunch and evening snacks, we offer a range of vegetarian options, rice meals, curries, snacks, and beverages at affordable prices to suit different tastes.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    {
      title: 'Comfortable seating',
      description:
        'The cafeteria has ample seating so students and staff can enjoy their meals in a relaxed environment. It also serves as a social space for breaks between classes.',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    },
  ],
  contact: {
    label: 'Contact',
    title: 'Visit the cafeteria',
    description:
      'The cafeteria is located on campus and is open during college hours. For any queries regarding food services or timings, please contact the administration or visit the cafeteria in person.',
    ctaText: 'Enquire',
    ctaHref: 'mailto:admissions@viet.edu.in?subject=Cafeteria enquiry',
  },
};

function normalizeCafeteriaGallery(v: unknown, fallback: CafeteriaGalleryItem[]): CafeteriaGalleryItem[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    image: asString(item?.image, fallback[i]?.image ?? ''),
    title: asString(item?.title, fallback[i]?.title ?? ''),
    caption: asString(item?.caption, fallback[i]?.caption ?? ''),
    ...(item?.large === true || fallback[i]?.large ? { large: true } : {}),
    ...(item?.wide === true || fallback[i]?.wide ? { wide: true } : {}),
  }));
}

function normalizeCafeteriaFeatures(v: unknown, fallback: CafeteriaFeature[]): CafeteriaFeature[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    title: asString(item?.title, fallback[i]?.title ?? ''),
    description: asString(item?.description, fallback[i]?.description ?? ''),
    icon: asString(item?.icon, fallback[i]?.icon ?? ''),
  }));
}

export function normalizeCafeteriaContent(raw: unknown): CafeteriaContent {
  const d = DEFAULT_CAFETERIA_CONTENT;
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
    gallery: normalizeCafeteriaGallery(c.gallery, d.gallery),
    features: normalizeCafeteriaFeatures(c.features, d.features),
    contact: {
      label: asString(contact.label, d.contact.label),
      title: asString(contact.title, d.contact.title),
      description: asString(contact.description, d.contact.description),
      ctaText: asString(contact.ctaText, d.contact.ctaText),
      ctaHref: asString(contact.ctaHref, d.contact.ctaHref),
    },
  };
}
