import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { imgUrl } from '@/lib/imageUtils';
import type { FacilityLeaderProfile } from '@/lib/facilityContent/leaderProfile';

type Props = {
  value: FacilityLeaderProfile;
  onChange: (value: FacilityLeaderProfile) => void;
  imageFile: File | null;
  onImageFileChange: (file: File | null) => void;
  personLabel: string;
};

const FacilityLeaderEditor = ({
  value,
  onChange,
  imageFile,
  onImageFileChange,
  personLabel,
}: Props) => {
  const update = (patch: Partial<FacilityLeaderProfile>) => onChange({ ...value, ...patch });
  const preview = imageFile ? URL.createObjectURL(imageFile) : value.image ? imgUrl(value.image) : '';

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Section label</Label>
          <Input value={value.label} onChange={(e) => update({ label: e.target.value })} />
        </div>
        <div>
          <Label>Section title</Label>
          <Input value={value.title} onChange={(e) => update({ title: e.target.value })} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input value={value.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div>
          <Label>Designation</Label>
          <Input value={value.designation} onChange={(e) => update({ designation: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Qualification</Label>
        <Input value={value.qualification} onChange={(e) => update({ qualification: e.target.value })} />
      </div>
      <div>
        <Label>Short introduction</Label>
        <Textarea rows={2} value={value.intro} onChange={(e) => update({ intro: e.target.value })} />
      </div>
      <div>
        <Label>Message / profile details</Label>
        <Textarea rows={6} value={value.message} onChange={(e) => update({ message: e.target.value })} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input value={value.phone} onChange={(e) => update({ phone: e.target.value })} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={value.email} onChange={(e) => update({ email: e.target.value })} />
        </div>
      </div>
      <div className="space-y-3">
        <Label>{personLabel} photo</Label>
        {preview && (
          <img
            src={preview}
            alt={`${personLabel} preview`}
            className="w-40 aspect-[4/5] object-cover rounded-lg border"
          />
        )}
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            type="file"
            accept="image/*"
            className="max-w-md"
            onChange={(e) => onImageFileChange(e.target.files?.[0] || null)}
          />
          {(imageFile || value.image) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onImageFileChange(null);
                update({ image: '' });
              }}
            >
              Remove photo
            </Button>
          )}
        </div>
        <ImageUploadGuide spec={IMAGE_SPECS.facilityGallery} />
      </div>
    </div>
  );
};

export default FacilityLeaderEditor;
