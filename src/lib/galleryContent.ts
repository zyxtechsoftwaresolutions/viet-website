export type GalleryHero = {
  badge: string;
  title: string;
  description: string;
  heroImage?: string;
  video?: string;
};

export type GallerySettings = {
  hero: GalleryHero;
  eventsSectionLabel: string;
  eventsSectionTitle: string;
};

export type GalleryEvent = {
  id: number;
  name: string;
  badge: string;
  description: string;
  order: number;
};

export type GalleryPhoto = {
  id: number;
  src: string;
  alt?: string;
  department?: string;
  eventId?: number;
  eventName?: string;
  caption?: string;
  order?: number;
  createdAt?: string;
};

export type GalleryPageData = {
  settings: GallerySettings;
  events: GalleryEvent[];
  images: GalleryPhoto[];
};

export const DEFAULT_GALLERY_SETTINGS: GallerySettings = {
  hero: {
    badge: 'Campus Life',
    title: 'Gallery',
    description: 'Browse photos from campus events, celebrations, and student activities at VIET.',
    heroImage: '/campus-hero.jpg',
  },
  eventsSectionLabel: 'Events',
  eventsSectionTitle: 'Browse by event',
};

export function normalizeGalleryPageData(raw: unknown): GalleryPageData {
  const d = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const settingsRaw = d.settings && typeof d.settings === 'object' ? (d.settings as Record<string, unknown>) : {};
  const heroRaw = settingsRaw.hero && typeof settingsRaw.hero === 'object' ? (settingsRaw.hero as Record<string, unknown>) : {};

  const settings: GallerySettings = {
    hero: {
      badge: String(heroRaw.badge ?? DEFAULT_GALLERY_SETTINGS.hero.badge),
      title: String(heroRaw.title ?? DEFAULT_GALLERY_SETTINGS.hero.title),
      description: String(heroRaw.description ?? DEFAULT_GALLERY_SETTINGS.hero.description),
      heroImage: typeof heroRaw.heroImage === 'string' ? heroRaw.heroImage : DEFAULT_GALLERY_SETTINGS.hero.heroImage,
      video: typeof heroRaw.video === 'string' ? heroRaw.video : undefined,
    },
    eventsSectionLabel: String(settingsRaw.eventsSectionLabel ?? DEFAULT_GALLERY_SETTINGS.eventsSectionLabel),
    eventsSectionTitle: String(settingsRaw.eventsSectionTitle ?? DEFAULT_GALLERY_SETTINGS.eventsSectionTitle),
  };

  let events: GalleryEvent[] = Array.isArray(d.events)
    ? d.events.map((e: any, i: number) => ({
        id: Number(e.id) || Date.now() + i,
        name: String(e.name || ''),
        badge: String(e.badge || ''),
        description: String(e.description || ''),
        order: Number(e.order) ?? i,
      }))
    : [];

  const images: GalleryPhoto[] = Array.isArray(d.images)
    ? d.images.map((img: any, i: number) => ({
        id: Number(img.id) || Date.now() + i,
        src: String(img.src || ''),
        alt: img.alt ? String(img.alt) : undefined,
        department: img.department ? String(img.department) : undefined,
        eventId: img.eventId != null ? Number(img.eventId) : undefined,
        eventName: img.eventName ? String(img.eventName) : img.alt ? String(img.alt) : undefined,
        caption: img.caption ? String(img.caption) : img.alt ? String(img.alt) : undefined,
        order: Number(img.order) ?? i,
        createdAt: img.createdAt,
      }))
    : [];

  if (events.length === 0 && images.length > 0 && !Array.isArray(d.events)) {
    const eventNames = [
      ...new Set(
        images
          .map((img) => img.eventName?.trim())
          .filter((name): name is string => Boolean(name))
      ),
    ];
    events = eventNames.map((name, idx) => {
      const related = images.filter((img) => img.eventName === name);
      const stableId =
        related.length > 0 && related[0].id != null ? Number(related[0].id) : Date.now() + idx;
      return {
        id: stableId,
        name,
        badge: '',
        description: '',
        order: idx,
      };
    });
    images.forEach((img) => {
      if (!img.eventId && img.eventName) {
        const match = events.find((e) => e.name === img.eventName);
        if (match) img.eventId = match.id;
      }
    });
  }

  events.sort((a, b) => a.order - b.order);
  return { settings, events, images };
}

export function photosForEvent(images: GalleryPhoto[], event: GalleryEvent): GalleryPhoto[] {
  const eventId = Number(event.id);
  return images
    .filter(
      (img) =>
        Number(img.eventId) === eventId ||
        img.eventName === event.name ||
        (!img.eventId && img.alt === event.name)
    )
    .sort((a, b) => (Number(a.order) ?? 0) - (Number(b.order) ?? 0));
}
