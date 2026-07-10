import { asString, normalizeHero, type FacilityHero } from './facilityContent/helpers';

export type OrganizationalChartContent = {
  hero: FacilityHero;
  chartImage: string;
  chartAlt: string;
};

export const DEFAULT_ORG_CHART_IMAGE = '/VIET-Org_Chart_Affiliated.png';

export const DEFAULT_ORGANIZATIONAL_CHART_CONTENT: OrganizationalChartContent = {
  hero: {
    badge: 'Organizational Chart',
    title: 'Organizational Chart',
    description: 'Structure and hierarchy of Visakha Institute of Engineering & Technology',
    heroImage: '/campus-hero.jpg',
    video: '',
  },
  chartImage: DEFAULT_ORG_CHART_IMAGE,
  chartAlt: 'VIET Organizational Chart',
};

export function normalizeOrganizationalChartContent(raw: unknown): OrganizationalChartContent {
  const d = DEFAULT_ORGANIZATIONAL_CHART_CONTENT;
  const c = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    hero: normalizeHero(c.hero, d.hero),
    chartImage: asString(c.chartImage, d.chartImage),
    chartAlt: asString(c.chartAlt, d.chartAlt),
  };
}
