import type { ResolvedHeroMedia } from '@/lib/heroMedia';

type HeroMediaBackgroundProps = {
  media: ResolvedHeroMedia;
  fallbackGradient?: string;
  imageOpacityClass?: string;
};

const DEFAULT_GRADIENT =
  'linear-gradient(155deg, #0f172a 0%, #312e81 35%, #1e3a8a 70%, #0f172a 100%)';

const HeroMediaBackground = ({
  media,
  fallbackGradient = DEFAULT_GRADIENT,
  imageOpacityClass = 'opacity-30',
}: HeroMediaBackgroundProps) => {
  const { imageUrl, videoEmbedUrl, videoDirectUrl } = media;
  const hasVideo = Boolean(videoEmbedUrl || videoDirectUrl);

  return (
    <>
      {!hasVideo && !imageUrl && (
        <div className="absolute inset-0" style={{ background: fallbackGradient }} aria-hidden />
      )}
      {!hasVideo && imageUrl && (
        <div
          className={`absolute inset-0 bg-cover bg-center ${imageOpacityClass}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden
        />
      )}
      {videoEmbedUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={videoEmbedUrl}
            title="Hero video"
            className="absolute top-1/2 left-1/2 w-[100vmax] h-[56.25vmax] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      )}
      {videoDirectUrl && !videoEmbedUrl && (
        <div className="absolute inset-0 z-0">
          <video
            src={videoDirectUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={imageUrl || undefined}
          />
        </div>
      )}
    </>
  );
};

export default HeroMediaBackground;
