import { useEffect, useState } from 'react';
import { pagesAPI } from '@/lib/api';
import { getFacilityHeroDefaults } from '@/lib/facilityPageDefaults';

export function useFacilityPageContent(slug: string) {
  const defaults = getFacilityHeroDefaults(slug);
  const [cmsContent, setCmsContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    pagesAPI
      .resolveBySlug(slug)
      .then((page) => {
        if (!cancelled) setCmsContent((page?.content as Record<string, unknown>) || null);
      })
      .catch(() => {
        if (!cancelled) setCmsContent(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const cmsHero = (cmsContent?.hero || {}) as Record<string, string>;

  const hero = {
    badge: cmsHero.badge || defaults.badge,
    title: cmsHero.title || defaults.title,
    description: cmsHero.description || defaults.description,
    heroImage: cmsHero.heroImage || '',
    video: cmsHero.video || '',
    gradient: defaults.gradient,
    waveFill: defaults.waveFill,
    showDotPattern: defaults.showDotPattern ?? false,
    align: defaults.align || 'end',
  };

  return { loading, cmsContent, hero };
}
