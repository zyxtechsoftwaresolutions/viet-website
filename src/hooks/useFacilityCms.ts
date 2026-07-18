import { useEffect, useState } from 'react';
import { pagesAPI } from '@/lib/api';
import { getFacilityHeroDefaults } from '@/lib/facilityPageDefaults';
import {
  normalizeNssContent,
  normalizeHostelContent,
  normalizeLibraryContent,
  normalizeLaboratoryContent,
  normalizeSportsContent,
  normalizeCafeteriaContent,
  normalizeScoutsContent,
  DEFAULT_NSS_CONTENT,
  DEFAULT_HOSTEL_CONTENT,
  DEFAULT_LIBRARY_CONTENT,
  DEFAULT_LABORATORY_CONTENT,
  DEFAULT_SPORTS_CONTENT,
  DEFAULT_CAFETERIA_CONTENT,
  DEFAULT_SCOUTS_CONTENT,
  type NssContent,
  type HostelContent,
  type LibraryContent,
  type LaboratoryContent,
  type SportsContent,
  type CafeteriaContent,
  type ScoutsContent,
} from '@/lib/facilityContent';

type FacilityCmsSlug = 'nss' | 'hostel' | 'library' | 'laboratory' | 'sports' | 'cafeteria' | 'scouts';

type ContentMap = {
  nss: NssContent;
  hostel: HostelContent;
  library: LibraryContent;
  laboratory: LaboratoryContent;
  sports: SportsContent;
  cafeteria: CafeteriaContent;
  scouts: ScoutsContent;
};

const DEFAULTS: ContentMap = {
  nss: DEFAULT_NSS_CONTENT,
  hostel: DEFAULT_HOSTEL_CONTENT,
  library: DEFAULT_LIBRARY_CONTENT,
  laboratory: DEFAULT_LABORATORY_CONTENT,
  sports: DEFAULT_SPORTS_CONTENT,
  cafeteria: DEFAULT_CAFETERIA_CONTENT,
  scouts: DEFAULT_SCOUTS_CONTENT,
};

const NORMALIZERS: Record<FacilityCmsSlug, (raw: unknown) => ContentMap[FacilityCmsSlug]> = {
  nss: normalizeNssContent,
  hostel: normalizeHostelContent,
  library: normalizeLibraryContent,
  laboratory: normalizeLaboratoryContent,
  sports: normalizeSportsContent,
  cafeteria: normalizeCafeteriaContent,
  scouts: normalizeScoutsContent,
};

export function useFacilityCms<S extends FacilityCmsSlug>(slug: S) {
  const defaults = DEFAULTS[slug];
  const normalize = NORMALIZERS[slug] as (raw: unknown) => ContentMap[S];
  const heroDefaults = getFacilityHeroDefaults(slug);
  const [content, setContent] = useState<ContentMap[S]>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    pagesAPI
      .resolveBySlug(slug)
      .then((page) => {
        if (!cancelled) {
          setContent(normalize(page?.content || null));
        }
      })
      .catch(() => {
        if (!cancelled) setContent(defaults);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const hero = {
    badge: content.hero.badge || heroDefaults.badge,
    title: content.hero.title || heroDefaults.title,
    description: content.hero.description || heroDefaults.description,
    heroImage: content.hero.heroImage || '',
    video: content.hero.video || '',
    gradient: heroDefaults.gradient,
    waveFill: heroDefaults.waveFill,
    showDotPattern: heroDefaults.showDotPattern ?? false,
    align: heroDefaults.align || ('end' as const),
  };

  return { loading, content, hero };
}
