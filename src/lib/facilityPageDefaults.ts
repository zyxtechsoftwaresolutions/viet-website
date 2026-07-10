export type FacilityHeroDefaults = {
  badge: string;
  title: string;
  description: string;
  gradient: string;
  waveFill: string;
  showDotPattern?: boolean;
  align?: 'center' | 'end';
};

export const FACILITY_HERO_DEFAULTS: Record<string, FacilityHeroDefaults> = {
  nss: {
    badge: 'Empowering through service',
    title: 'National Service Scheme',
    description:
      "Not Me, But You — Building tomorrow's leaders through community service and social responsibility.",
    gradient: 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
    waveFill: 'rgb(248 250 252)',
    showDotPattern: true,
    align: 'end',
  },
  hostel: {
    badge: 'Facilities',
    title: 'Our Hostel',
    description: 'A safe, comfortable, and vibrant living environment for students. Home away from home.',
    gradient: 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
    waveFill: 'rgb(248 250 252)',
    showDotPattern: true,
    align: 'end',
  },
  library: {
    badge: 'Facilities',
    title: 'Our Library',
    description: 'A place of knowledge, inspiration, and academic excellence.',
    gradient: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #0f172a 100%)',
    waveFill: 'rgb(250 250 250)',
    align: 'center',
  },
  laboratory: {
    badge: 'Facilities',
    title: 'Our Laboratories',
    description: 'Where theory meets practice — advanced engineering labs.',
    gradient: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #0f172a 100%)',
    waveFill: 'rgb(250 250 250)',
    align: 'center',
  },
  sports: {
    badge: 'Facilities',
    title: 'Sports & Games',
    description:
      'A dedicated indoor sports room, expert PT staff, and a wide range of indoor and outdoor games for fitness and fun.',
    gradient: 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
    waveFill: 'rgb(248 250 252)',
    showDotPattern: true,
    align: 'end',
  },
  cafeteria: {
    badge: 'Facilities',
    title: 'Cafeteria & Canteen',
    description:
      'A hygienic, spacious cafeteria offering a variety of meals, snacks, and beverages at affordable prices for students and staff.',
    gradient: 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
    waveFill: 'rgb(248 250 252)',
    showDotPattern: true,
    align: 'end',
  },
  transport: {
    badge: 'Facilities',
    title: 'Campus Transport',
    description:
      'VIET provides safe and reliable bus transport for students and staff from various points in and around Visakhapatnam to our campus at Narava.',
    gradient: 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
    waveFill: 'rgb(248 250 252)',
    align: 'end',
  },
};

export function getFacilityHeroDefaults(slug: string): FacilityHeroDefaults {
  return (
    FACILITY_HERO_DEFAULTS[slug] ?? {
      badge: 'Facilities',
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: '',
      gradient: 'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)',
      waveFill: 'rgb(248 250 252)',
      showDotPattern: true,
      align: 'end',
    }
  );
}
