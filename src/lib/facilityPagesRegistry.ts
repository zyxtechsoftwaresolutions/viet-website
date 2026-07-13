export type FacilityEditorKind =
  | 'standard'
  | 'campus-life'
  | 'transport'
  | 'nss'
  | 'hostel'
  | 'library'
  | 'laboratory'
  | 'sports'
  | 'cafeteria';

export type FacilityPageDef = {
  slug: string;
  title: string;
  route: string;
  description: string;
  editor: FacilityEditorKind;
};

/** All facility pages shown in admin hub and public Facilities menu */
export const FACILITY_PAGES: FacilityPageDef[] = [
  {
    slug: 'campus-life',
    title: 'Campus Life',
    route: '/campus-life',
    description: 'Experience life at VIET — events, clubs, and culture.',
    editor: 'campus-life',
  },
  {
    slug: 'center-of-excellence',
    title: 'Center of Excellence',
    route: '/facilities/center-of-excellence',
    description: 'EISC, COE and innovation labs — edit hero, content, stats, features, and gallery.',
    editor: 'standard',
  },
  {
    slug: 'library',
    title: 'Library',
    route: '/facilities/library',
    description: 'Digital and physical library resources.',
    editor: 'library',
  },
  {
    slug: 'laboratory',
    title: 'Laboratories',
    route: '/facilities/laboratory',
    description: 'State-of-the-art labs and equipment.',
    editor: 'laboratory',
  },
  {
    slug: 'nss',
    title: 'NSS',
    route: '/facilities/nss',
    description: 'National Service Scheme activities.',
    editor: 'nss',
  },
  {
    slug: 'hostel',
    title: 'Hostel',
    route: '/facilities/hostel',
    description: 'Comfortable accommodation facilities.',
    editor: 'hostel',
  },
  {
    slug: 'sports',
    title: 'Sports',
    route: '/facilities/sports',
    description: 'Sports facilities and activities.',
    editor: 'sports',
  },
  {
    slug: 'wifi',
    title: 'WIFI',
    route: '/facilities/wifi',
    description: 'High-speed internet connectivity.',
    editor: 'standard',
  },
  {
    slug: 'transport',
    title: 'Transport',
    route: '/facilities/transport',
    description: 'College transport services.',
    editor: 'transport',
  },
  {
    slug: 'medical-facility',
    title: 'Medical Facility',
    route: '/facilities/medical-facility',
    description: 'Healthcare services on campus.',
    editor: 'standard',
  },
  {
    slug: 'cafeteria',
    title: 'Cafeteria',
    route: '/facilities/cafeteria',
    description: 'Food and dining facilities.',
    editor: 'cafeteria',
  },
  {
    slug: 'ro-water-plant',
    title: 'RO Water Plant',
    route: '/facilities/ro-water-plant',
    description: 'Safe drinking water facility.',
    editor: 'standard',
  },
  {
    slug: 'green-initiatives',
    title: 'Green Initiatives',
    route: '/facilities/green-initiatives',
    description: 'Eco-friendly campus initiatives.',
    editor: 'standard',
  },
  {
    slug: 'solar-power-plant',
    title: 'Solar Power Plant',
    route: '/facilities/solar-power-plant',
    description: 'Renewable energy on campus.',
    editor: 'standard',
  },
];

export function getFacilityBySlug(slug: string): FacilityPageDef | undefined {
  return FACILITY_PAGES.find((f) => f.slug === slug);
}

export function getFacilityAdminPath(slug: string): string {
  return `/admin/facilities/${slug}`;
}
