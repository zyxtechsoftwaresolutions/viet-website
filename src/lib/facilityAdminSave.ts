import { pagesAPI } from '@/lib/api';
import { uploadToSupabase, uploadVideoToSupabase } from '@/lib/storage';
import type { HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import type { FacilityHero } from '@/lib/facilityContent/helpers';

export async function saveFacilityPageContent(
  slug: string,
  pageTitle: string,
  route: string,
  content: Record<string, unknown>,
  heroMedia?: HeroMediaFormState
) {
  let heroImage = (content.hero as FacilityHero | undefined)?.heroImage || '';
  let video = (content.hero as FacilityHero | undefined)?.video || '';

  if (heroMedia?.imageFile) {
    heroImage = await uploadToSupabase(heroMedia.imageFile, 'facilities', 'images');
  }
  if (heroMedia?.videoFile) {
    video = await uploadVideoToSupabase(heroMedia.videoFile, 'facilities');
  }

  const hero = {
    ...(typeof content.hero === 'object' && content.hero ? content.hero : {}),
    heroImage: heroImage || undefined,
    video: video || undefined,
  };

  return pagesAPI.saveBySlug(slug, {
    title: pageTitle,
    route,
    category: 'Facilities',
    content: { ...content, hero },
  });
}
