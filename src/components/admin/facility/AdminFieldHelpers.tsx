import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { IMAGE_SPECS, type ImageUploadSpec } from '@/lib/adminImageSpecs';
import { imgUrl } from '@/lib/imageUtils';
import { Plus, Trash2, Upload } from 'lucide-react';

export type FacilityGalleryItem = { image: string; title: string; caption: string };
export type PendingGalleryFiles = Record<number, File>;

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder = 'Item',
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={placeholder}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export function StatPairsEditor({
  label,
  stats,
  onChange,
}: {
  label: string;
  stats: { value: string; label: string }[];
  onChange: (stats: { value: string; label: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...stats, { value: '', label: '' }])}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {stats.map((stat, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            value={stat.value}
            onChange={(e) => onChange(stats.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
            placeholder="Value"
          />
          <div className="flex gap-2">
            <Input
              value={stat.label}
              onChange={(e) => onChange(stats.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))}
              placeholder="Label"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange(stats.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FacilityGalleryEditor({
  items,
  onChange,
  pendingFiles,
  onPendingFilesChange,
  imageSpec = IMAGE_SPECS.facilityGallery,
}: {
  items: FacilityGalleryItem[];
  onChange: (items: FacilityGalleryItem[]) => void;
  pendingFiles: PendingGalleryFiles;
  onPendingFilesChange: (files: PendingGalleryFiles) => void;
  imageSpec?: ImageUploadSpec;
}) {
  const updateItem = (index: number, patch: Partial<FacilityGalleryItem>) => {
    onChange(items.map((item, j) => (j === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, j) => j !== index));
    const next: PendingGalleryFiles = {};
    Object.entries(pendingFiles).forEach(([key, file]) => {
      const idx = Number(key);
      if (idx < index) next[idx] = file;
      else if (idx > index) next[idx - 1] = file;
    });
    onPendingFilesChange(next);
  };

  const setPendingFile = (index: number, file: File | null) => {
    const next = { ...pendingFiles };
    if (file) next[index] = file;
    else delete next[index];
    onPendingFilesChange(next);
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const fileList = Array.from(files);
    const startIdx = items.length;
    onChange([
      ...items,
      ...fileList.map((file) => ({
        image: '',
        title: file.name.replace(/\.[^.]+$/, ''),
        caption: '',
      })),
    ]);
    const next = { ...pendingFiles };
    fileList.forEach((file, i) => {
      next[startIdx + i] = file;
    });
    onPendingFilesChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ImageUploadGuide spec={imageSpec} inline />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange([...items, { image: '', title: '', caption: '' }])}
          >
            <Plus className="h-4 w-4 mr-1" /> Add row
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-1 inline" />
              Upload photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          </Button>
        </div>
      </div>

      {items.map((item, i) => {
        const pending = pendingFiles[i];
        const previewSrc = pending ? URL.createObjectURL(pending) : item.image ? imgUrl(item.image) : '';
        return (
          <div key={i} className="grid gap-3 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <Label>Image {i + 1}</Label>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {previewSrc && (
              <img src={previewSrc} alt={item.title || `Gallery ${i + 1}`} className="w-full max-h-48 object-cover rounded-md border" />
            )}
            <div className="flex flex-wrap gap-2">
              <Input
                value={item.image}
                onChange={(e) => updateItem(i, { image: e.target.value })}
                placeholder="Image URL (or upload below)"
                className="flex-1 min-w-[200px]"
              />
              <Button type="button" variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  {pending || item.image ? 'Replace' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPendingFile(i, file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </Button>
            </div>
            {pending && <p className="text-xs text-muted-foreground">Pending upload: {pending.name}</p>}
            <Input value={item.title} onChange={(e) => updateItem(i, { title: e.target.value })} placeholder="Title" />
            <Input value={item.caption} onChange={(e) => updateItem(i, { caption: e.target.value })} placeholder="Caption" />
          </div>
        );
      })}
    </div>
  );
}

export function ParagraphsEditor({
  label,
  paragraphs,
  onChange,
}: {
  label: string;
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...paragraphs, ''])}>
          <Plus className="h-4 w-4 mr-1" /> Add paragraph
        </Button>
      </div>
      {paragraphs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={p}
            onChange={(e) => onChange(paragraphs.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={`Paragraph ${i + 1}`}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(paragraphs.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
