import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getCroppedImg } from '@/lib/cropImage';
import { toast } from 'sonner';
import { Move, ZoomIn } from 'lucide-react';

interface FacultyImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  fileName?: string;
  facultyName?: string;
  facultyDesignation?: string;
  description?: string;
  previewMaxWidth?: string;
  aspect?: number;
  outputWidth?: number;
  outputHeight?: number;
  showProfileFooter?: boolean;
  onCropComplete: (file: File, previewUrl: string) => void;
}

const FacultyImageCropper = ({
  open,
  onOpenChange,
  imageSrc,
  fileName = 'faculty-photo.jpg',
  facultyName,
  facultyDesignation,
  description = 'Drag to reposition and zoom. The square frame matches the faculty card on the website.',
  previewMaxWidth = '220px',
  aspect = 1,
  outputWidth,
  outputHeight,
  showProfileFooter = true,
  onCropComplete,
}: FacultyImageCropperProps) => {
  const cropOutputWidth = outputWidth ?? (aspect === 1 ? 800 : 1280);
  const cropOutputHeight = outputHeight ?? (aspect === 1 ? 800 : 720);
  const previewAspectClass = aspect === 1 ? 'aspect-square' : 'aspect-video';
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropCompleteHandler = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, cropOutputWidth, cropOutputHeight);
      const previewUrl = URL.createObjectURL(blob);
      const file = new File([blob], fileName.replace(/\.\w+$/, '.jpg'), {
        type: 'image/jpeg',
      });
      onCropComplete(file, previewUrl);
      onOpenChange(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch {
      toast.error('Failed to adjust photo. Please try another image.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust profile photo</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {imageSrc && (
          <div className="space-y-4">
            {/* Faculty card preview — same layout as FacultyPage */}
            <div
              className="mx-auto bg-white border border-slate-200/80 rounded overflow-hidden shadow-sm"
              style={{ maxWidth: previewMaxWidth }}
            >
              <div className={`relative w-full ${previewAspectClass} bg-slate-100 overflow-hidden`}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape="rect"
                  showGrid
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropCompleteHandler}
                />
              </div>
              {showProfileFooter && (
                <div className="p-3 border-t border-slate-100">
                  <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                    {facultyName || 'Faculty name'}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">
                    {facultyDesignation || 'Designation'}
                  </p>
                </div>
              )}
            </div>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Move className="h-3.5 w-3.5" />
              Drag photo to adjust position
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
                <Label className="text-sm text-muted-foreground">Zoom</Label>
              </div>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={[zoom]}
                onValueChange={(v) => setZoom(v[0])}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={saving || !croppedAreaPixels}>
            {saving ? 'Saving…' : 'Use this photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FacultyImageCropper;
