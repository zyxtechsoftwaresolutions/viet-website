import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { IMAGE_SPECS, type ImageUploadSpec } from '@/lib/adminImageSpecs';
import { imgUrl } from '@/lib/imageUtils';

export type HeroMediaFormState = {
  image: string;
  video: string;
  imageFile: File | null;
  videoFile: File | null;
};

type HeroMediaFieldsProps = {
  value: HeroMediaFormState;
  onChange: (patch: Partial<HeroMediaFormState>) => void;
  imageSpec?: ImageUploadSpec;
  imageLabel?: string;
  videoLabel?: string;
};

const HeroMediaFields = ({
  value,
  onChange,
  imageSpec = IMAGE_SPECS.facilityHero,
  imageLabel = 'Hero image (background when no video)',
  videoLabel = 'Hero video (optional — file or YouTube / Drive / Vimeo link)',
}: HeroMediaFieldsProps) => {
  const imagePreview = value.imageFile
    ? URL.createObjectURL(value.imageFile)
    : value.image
      ? imgUrl(value.image)
      : null;

  return (
    <div className="space-y-6 pt-2 border-t">
      <div className="space-y-3">
        <Label>{imageLabel}</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              onChange({ imageFile: f });
              e.target.value = '';
            }}
            className="max-w-xs"
          />
          <ImageUploadGuide {...imageSpec} inline />
        </div>
        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Hero preview" className="h-32 object-cover rounded border" />
            {(value.image || value.imageFile) && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1"
                onClick={() => onChange({ image: '', imageFile: null })}
              >
                Remove image
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>{videoLabel}</Label>
        <p className="text-xs text-muted-foreground">
          Upload an MP4/WebM file or paste a link. Video takes priority over the image when both are set.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              onChange({ videoFile: f });
              e.target.value = '';
            }}
            className="max-w-xs"
          />
          <span className="text-sm text-muted-foreground">or</span>
          <Input
            value={value.video}
            onChange={(e) => onChange({ video: e.target.value })}
            placeholder="Paste YouTube, Google Drive, Vimeo, or direct video URL…"
            className="max-w-md"
          />
        </div>
        {value.videoFile && (
          <p className="text-sm text-muted-foreground">Selected file: {value.videoFile.name}</p>
        )}
        {(value.video || value.videoFile) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ video: '', videoFile: null })}
          >
            Remove video
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeroMediaFields;
