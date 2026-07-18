/** Nav links that are not ready yet — show Coming Soon instead of a blank 404 */
export const COMING_SOON_PAGES: { path: string; title: string }[] = [
  { path: '/page/students', title: 'Students' },
  { path: '/page/linkages', title: 'Linkages' },
  { path: '/page/global', title: 'Global' },
  { path: '/page/infrastructure', title: 'Infrastructure' },
  { path: '/page/finance', title: 'Finance' },
  { path: '/page/disclosures', title: 'Disclosures' },
  { path: '/page/directions', title: 'Directions' },
  { path: '/page/online-payment', title: 'Online Payment' },
];

const byPath = new Map(COMING_SOON_PAGES.map((p) => [p.path, p.title]));
const bySlug = new Map(
  COMING_SOON_PAGES.filter((p) => p.path.startsWith('/page/')).map((p) => [
    p.path.replace('/page/', ''),
    p.title,
  ])
);

export function getComingSoonTitle(pathname: string): string | undefined {
  return byPath.get(pathname);
}

export function getComingSoonTitleBySlug(slug: string): string | undefined {
  return bySlug.get(slug);
}
