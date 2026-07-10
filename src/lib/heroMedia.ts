import { API_BASE_URL, getApiHostBase } from './apiConfig';
import { convertGoogleDriveToDownload } from '@/lib/googleDriveUtils';
import { getVideoEmbedUrl, isVideoUrl } from '@/lib/videoUtils';
import { imgUrl } from '@/lib/imageUtils';

const API_BASE = getApiHostBase() || 'http://localhost:3001';

export type HeroMediaInput = {
  image?: string;
  heroImage?: string;
  video?: string;
};

export type ResolvedHeroMedia = {
  imageUrl: string | null;
  videoEmbedUrl: string | null;
  videoDirectUrl: string | null;
};

export function resolveHeroMedia(
  hero?: HeroMediaInput | null,
  apiBase: string = API_BASE
): ResolvedHeroMedia {
  const imageRaw = (hero?.image || hero?.heroImage || '').trim();
  const imageUrl = imageRaw
    ? imgUrl(imageRaw) ||
      (imageRaw.startsWith('http') ? imageRaw : `${apiBase}${imageRaw.startsWith('/') ? imageRaw : `/${imageRaw}`}`)
    : null;

  const heroVideoRaw = (hero?.video || '').trim();
  const heroVideoInfo = heroVideoRaw && isVideoUrl(heroVideoRaw) ? getVideoEmbedUrl(heroVideoRaw) : null;
  const heroVideoIsEmbed =
    heroVideoInfo && ['youtube', 'instagram', 'vimeo', 'googledrive'].includes(heroVideoInfo.platform);
  const videoEmbedUrl = heroVideoIsEmbed ? heroVideoInfo!.embedUrl : null;
  const videoDirectUrl = (() => {
    if (!heroVideoRaw) return null;
    if (heroVideoInfo && heroVideoIsEmbed) return null;
    if (isVideoUrl(heroVideoRaw)) {
      return heroVideoRaw.includes('drive.google.com')
        ? convertGoogleDriveToDownload(heroVideoRaw)
        : heroVideoRaw;
    }
    return heroVideoRaw.startsWith('/') ? `${apiBase}${heroVideoRaw}` : `${apiBase}/${heroVideoRaw}`;
  })();

  return { imageUrl, videoEmbedUrl, videoDirectUrl };
}

export function heroHasVideo(media: ResolvedHeroMedia): boolean {
  return Boolean(media.videoEmbedUrl || media.videoDirectUrl);
}
