/** Leader / authority pages edited in Authorities admin */
export const LEADER_SLUGS = [
  'chairman',
  'principal',
  'diploma-principal',
  'hr',
  'dean-academics',
  'dean-innovation',
] as const;

export type SitePageMeta = {
  slug: string;
  title: string;
  route: string;
  category: string;
};

/** Expected public pages — used by admin hub (server seeds missing rows). */
export const EXPECTED_SITE_PAGES: SitePageMeta[] = [
  { slug: 'about', title: 'About Us', route: '/about', category: 'About' },
  { slug: 'vision-mission', title: 'Vision & Mission', route: '/vision-mission', category: 'About' },
  { slug: 'organizational-chart', title: 'Organizational Chart', route: '/organizational-chart', category: 'About' },
  { slug: 'governing-body', title: 'Governing Body', route: '/governing-body', category: 'About' },
  { slug: 'grievance-redressal', title: 'Grievance Redressal', route: '/grievance-redressal', category: 'About' },
  { slug: 'committees', title: 'Committees', route: '/committees', category: 'About' },
  { slug: 'chairman', title: 'Chairman', route: '/chairman', category: 'About' },
  { slug: 'principal', title: 'Principal', route: '/principal', category: 'About' },
  { slug: 'diploma-principal', title: 'Diploma Principal', route: '/diploma-principal', category: 'About' },
  { slug: 'hr', title: 'Human Resources', route: '/hr', category: 'About' },
  { slug: 'dean-academics', title: 'Dean Academics', route: '/dean-academics', category: 'About' },
  { slug: 'dean-innovation', title: 'Dean Innovation', route: '/dean-innovation', category: 'About' },
  { slug: 'placements', title: 'Placements', route: '/placements', category: 'Placements' },
  { slug: 'placements-cell', title: 'Placements Cell', route: '/placements-cell', category: 'Placements' },
  { slug: 'research-development', title: 'Research & Development', route: '/research-development', category: 'Academics' },
  { slug: 'campus-life', title: 'Campus Life', route: '/campus-life', category: 'Campus' },
  { slug: 'ug-pg-examinations', title: 'UG & PG Examinations', route: '/examinations/ug-pg', category: 'Examinations' },
  { slug: 'diploma-sbtet', title: 'Diploma (SBTET)', route: '/examinations/diploma', category: 'Examinations' },
  { slug: 'transport', title: 'Transport', route: '/facilities/transport', category: 'Facilities' },
  { slug: 'library', title: 'Library', route: '/facilities/library', category: 'Facilities' },
  { slug: 'laboratory', title: 'Laboratory', route: '/facilities/laboratory', category: 'Facilities' },
  { slug: 'hostel', title: 'Hostel', route: '/facilities/hostel', category: 'Facilities' },
  { slug: 'nss', title: 'NSS', route: '/facilities/nss', category: 'Facilities' },
  { slug: 'sports', title: 'Sports', route: '/facilities/sports', category: 'Facilities' },
  { slug: 'cafeteria', title: 'Cafeteria', route: '/facilities/cafeteria', category: 'Facilities' },
  { slug: 'center-of-excellence', title: 'Center of Excellence', route: '/facilities/center-of-excellence', category: 'Facilities' },
  { slug: 'wifi', title: 'WIFI', route: '/facilities/wifi', category: 'Facilities' },
  { slug: 'medical-facility', title: 'Medical Facility', route: '/facilities/medical-facility', category: 'Facilities' },
  { slug: 'ro-water-plant', title: 'RO Water Plant', route: '/facilities/ro-water-plant', category: 'Facilities' },
  { slug: 'green-initiatives', title: 'Green Initiatives', route: '/facilities/green-initiatives', category: 'Facilities' },
  { slug: 'solar-power-plant', title: 'Solar Power Plant', route: '/facilities/solar-power-plant', category: 'Facilities' },
];

export function getPageEditorKind(
  slug: string,
  category: string
): 'about' | 'authorities' | 'facilities' | 'transport' | 'campus-life' | 'organizational-chart' | 'generic' {
  if (slug === 'about') return 'about';
  if (slug === 'organizational-chart') return 'organizational-chart';
  if (slug === 'transport') return 'transport';
  if (slug === 'campus-life') return 'campus-life';
  if ((LEADER_SLUGS as readonly string[]).includes(slug)) return 'authorities';
  if (category.toLowerCase() === 'facilities') return 'facilities';
  return 'generic';
}

export function getAdminEditorPath(slug: string, category: string): string {
  const kind = getPageEditorKind(slug, category);
  if (kind === 'about') return '/admin/pages';
  if (kind === 'organizational-chart') return '/admin/organizational-chart';
  if (kind === 'authorities') return '/admin/authorities';
  if (kind === 'transport') return '/admin/facilities/transport';
  if (kind === 'facilities') return `/admin/facilities/${slug}`;
  if (kind === 'campus-life') return '/admin/facilities/campus-life';
  return '/admin/site-pages';
}
