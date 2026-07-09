export function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

export function asStringArray(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  const items = v.map((x) => (typeof x === 'string' ? x : '')).filter(Boolean);
  return items.length > 0 ? items : fallback;
}

export function asStatPairs(
  v: unknown,
  fallback: { value: string; label: string }[]
): { value: string; label: string }[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((s: any, i) => ({
    value: asString(s?.value, fallback[i]?.value ?? ''),
    label: asString(s?.label, fallback[i]?.label ?? ''),
  }));
}

export type FacilityHero = {
  badge: string;
  title: string;
  description: string;
  heroImage?: string;
  video?: string;
};

export function normalizeHero(raw: unknown, defaults: FacilityHero): FacilityHero {
  const h = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    badge: asString(h.badge, defaults.badge),
    title: asString(h.title, defaults.title),
    description: asString(h.description, defaults.description),
    heroImage: asString(h.heroImage || h.image, defaults.heroImage || ''),
    video: asString(h.video, defaults.video || ''),
  };
}
