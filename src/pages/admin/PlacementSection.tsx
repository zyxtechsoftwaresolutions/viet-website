import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { placementSectionAPI, placementCarouselAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { Briefcase, Link2, ImagePlus, Edit, Trash2 } from 'lucide-react';

interface PlacementSectionData {
  title: string;
  subtitle: string;
  highestPackageLPA: number;
  averagePackageLPA: number;
  totalOffers: number;
  companiesVisited: number;
}

interface StudentCarouselImage {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

const PlacementSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PlacementSectionData>({
    title: 'Placement Excellence at VIET',
    subtitle: "Our students are shaping the future at the world's leading technology companies.",
    highestPackageLPA: 10,
    averagePackageLPA: 4.5,
    totalOffers: 250,
    companiesVisited: 53,
  });

  const [studentImages, setStudentImages] = useState<StudentCarouselImage[]>([]);
  const [studentImagesLoading, setStudentImagesLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StudentCarouselImage | null>(null);
  const [imageForm, setImageForm] = useState({ title: '', subtitle: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    placementSectionAPI
      .get()
      .then((data: PlacementSectionData) =>
        setForm({
          title: data.title ?? '',
          subtitle: data.subtitle ?? '',
          highestPackageLPA: Number(data.highestPackageLPA) ?? 0,
          averagePackageLPA: Number(data.averagePackageLPA) ?? 0,
          totalOffers: Number(data.totalOffers) ?? 0,
          companiesVisited: Number(data.companiesVisited) ?? 0,
        })
      )
      .catch(() => toast.error('Failed to load placement section'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    placementCarouselAPI
      .getAll()
      .then((data: StudentCarouselImage[]) => setStudentImages(Array.isArray(data) ? data : []))
      .catch(() => setStudentImages([]))
      .finally(() => setStudentImagesLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await placementSectionAPI.update({
        title: form.title,
        subtitle: form.subtitle,
        highestPackageLPA: Number(form.highestPackageLPA),
        averagePackageLPA: Number(form.averagePackageLPA),
        totalOffers: Number(form.totalOffers),
        companiesVisited: Number(form.companiesVisited),
      });
      toast.success('Placement section saved');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const openAddImage = () => {
    setSelectedImage(null);
    setImageForm({ title: '', subtitle: '' });
    setImageFile(null);
    setImagePreview('');
    setDialogOpen(true);
  };

  const openEditImage = (item: StudentCarouselImage) => {
    setSelectedImage(item);
    setImageForm({ title: item.title, subtitle: item.subtitle });
    setImageFile(null);
    setImagePreview(item.src);
    setDialogOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    try {
      let src: string | undefined;
      if (imageFile) {
        toast.info('Uploading image…');
        src = await uploadToSupabase(imageFile, 'placement-carousel', 'images');
      } else if (selectedImage) {
        src = selectedImage.src;
      }
      if (!src) {
        toast.error('Please select an image');
        return;
      }
      if (selectedImage) {
        await placementCarouselAPI.update(selectedImage.id, { src, title: imageForm.title, subtitle: imageForm.subtitle });
        toast.success('Image updated');
      } else {
        await placementCarouselAPI.create({ src, title: imageForm.title, subtitle: imageForm.subtitle });
        toast.success('Image added');
      }
      setDialogOpen(false);
      const data = await placementCarouselAPI.getAll();
      setStudentImages(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    }
  };

  const openDeleteImage = (item: StudentCarouselImage) => {
    setSelectedImage(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    try {
      await placementCarouselAPI.delete(selectedImage.id);
      toast.success('Image deleted');
      setDeleteDialogOpen(false);
      const data = await placementCarouselAPI.getAll();
      setStudentImages(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const imgUrl = (src: string) => src;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0a192f] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-8 h-8 text-[#0a192f]" />
        <div>
          <h1 className="text-2xl font-bold text-[#0a192f]">Placement Section (Home)</h1>
          <p className="text-sm text-slate-600">
            Edit the placement block that appears below Vibe@Viet on the homepage.
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Section title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Placement Excellence at VIET"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea
            id="subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="e.g. Our students are shaping the future..."
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="highest">Highest Package (LPA)</Label>
            <Input
              id="highest"
              type="number"
              min={0}
              step={0.5}
              value={form.highestPackageLPA}
              onChange={(e) => setForm((f) => ({ ...f, highestPackageLPA: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="average">Average Package (LPA)</Label>
            <Input
              id="average"
              type="number"
              min={0}
              step={0.1}
              value={form.averagePackageLPA}
              onChange={(e) => setForm((f) => ({ ...f, averagePackageLPA: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offers">Total Offers (e.g. 2024-2025)</Label>
            <Input
              id="offers"
              type="number"
              min={0}
              value={form.totalOffers}
              onChange={(e) => setForm((f) => ({ ...f, totalOffers: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companies">Companies Visited</Label>
            <Input
              id="companies"
              type="number"
              min={0}
              value={form.companiesVisited}
              onChange={(e) => setForm((f) => ({ ...f, companiesVisited: Number(e.target.value) || 0 }))}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>

      {/* Student carousel images */}
      <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#0a192f]">Student carousel images</h2>
            <p className="text-sm text-slate-600">
              Student/placement cards in the 3D carousel (below stats, above Top Recruiters). Use <strong>Student name</strong> and <strong>Company &amp; package</strong> for each card.
            </p>
          </div>
          <Button onClick={openAddImage} variant="outline" size="sm" className="gap-2">
            <ImagePlus className="w-4 h-4" />
            Add image
          </Button>
        </div>
        {studentImagesLoading ? (
          <div className="py-8 text-center text-slate-500">Loading...</div>
        ) : studentImages.length === 0 ? (
          <div className="py-8 text-center text-slate-500 border border-dashed rounded-lg">
            No images yet. Add images to show a carousel in the placement section.
          </div>
        ) : (
          <ul className="space-y-3">
            {studentImages.map((img) => (
              <li
                key={img.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
              >
                <img
                  src={imgUrl(img.src)}
                  alt={img.title}
                  className="w-24 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{img.title || 'No name'}</p>
                  <p className="text-sm text-slate-600 truncate">{img.subtitle || '—'}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditImage(img)} aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteImage(img)} aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
        <Link2 className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-700">
          <p className="font-medium text-slate-900">Top Recruiters logos</p>
          <p>
            The scrolling company logos are managed in <strong>Recruiters</strong>. Add or edit recruiter logos there.
          </p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedImage ? 'Edit carousel image' : 'Add carousel image'}</DialogTitle>
            <DialogDescription>
              Student/placement cards shown in the 3D carousel on the homepage. Use <strong>Student name</strong> as Title and <strong>Company &amp; package</strong> as Subtitle.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Photo</Label>
              <Input type="file" accept="image/*" onChange={handleImageFileChange} className="mt-1" />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-full max-h-40 object-contain rounded" />
              )}
            </div>
            <div>
              <Label htmlFor="img-title">Student name</Label>
              <Input
                id="img-title"
                value={imageForm.title}
                onChange={(e) => setImageForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <Label htmlFor="img-subtitle">Company &amp; package</Label>
              <Input
                id="img-subtitle"
                value={imageForm.subtitle}
                onChange={(e) => setImageForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g. TCS, 8 LPA"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveImage} className="bg-primary hover:bg-primary/90">
              {selectedImage ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image</AlertDialogTitle>
            <AlertDialogDescription>
              Remove this image from the student carousel? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlacementSection;
