import { cn } from '@/lib/utils';
import type { ImageUploadSpec } from '@/lib/adminImageSpecs';

type ImageUploadGuideProps = ImageUploadSpec & {
  className?: string;
  inline?: boolean;
};

export function ImageUploadGuide({
  dimensions,
  aspectRatio,
  hint,
  className,
  inline = false,
}: ImageUploadGuideProps) {
  const Tag = inline ? 'span' : 'p';

  return (
    <Tag className={cn('text-xs text-muted-foreground', className)}>
      <span className="font-medium text-foreground/80">Recommended size:</span>{' '}
      {dimensions}
      {aspectRatio && (
        <>
          {' '}
          · <span className="font-medium text-foreground/80">Ratio</span> {aspectRatio}
        </>
      )}
      {hint && <> · {hint}</>}
    </Tag>
  );
}

export default ImageUploadGuide;
