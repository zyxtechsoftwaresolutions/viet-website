import { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { carouselAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface CarouselImage {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

const Carousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarouselImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await carouselAPI.getAll();
      setImages(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch carousel images');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ title: '', subtitle: '' });
    setImageFile(null);
    setPreview('');
    setDialogOpen(true);
  };

  const handleEdit = (item: CarouselImage) => {
    setSelectedItem(item);
    setFormData({ title: item.title, subtitle: item.subtitle });
    setImageFile(null);
    setPreview(item.src);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (item: CarouselImage) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let src: string | undefined;
      if (imageFile) {
        toast.info('Uploading image…');
        src = await uploadToSupabase(imageFile, 'carousel', 'images');
      } else if (selectedItem) {
        src = selectedItem.src;
      }
      if (!src) {
        toast.error('Please select an image');
        return;
      }
      if (selectedItem) {
        await carouselAPI.update(selectedItem.id, { src, title: formData.title, subtitle: formData.subtitle });
        toast.success('Carousel image updated successfully');
      } else {
        await carouselAPI.create({ src, title: formData.title, subtitle: formData.subtitle });
        toast.success('Carousel image added successfully');
      }
      setDialogOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save carousel image');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await carouselAPI.delete(selectedItem.id);
      toast.success('Carousel image deleted successfully');
      setDeleteDialogOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete carousel image');
    }
  };

  const columns = [
    {
      key: 'src',
      header: 'Image',
      render: (item: CarouselImage) => (
        <img
          src={item.src.startsWith('/') ? item.src : `http://localhost:3001${item.src}`}
          alt={item.title}
          className="w-20 h-12 object-cover rounded"
        />
      ),
    },
    { key: 'title', header: 'Title' },
    { key: 'subtitle', header: 'Subtitle' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Carousel Images</h1>
        <p className="text-muted-foreground mt-2">Manage homepage carousel images</p>
      </div>

      <DataTable
        data={images}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Carousel Image"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Carousel Image' : 'Add Carousel Image'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update carousel image details' : 'Upload a new carousel image'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {preview && (
                  <img
                    src={preview.startsWith('/') ? preview : `http://localhost:3001${preview}`}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
              </div>
              {!selectedItem && (
                <p className="text-sm text-muted-foreground">
                  {selectedItem ? 'Leave empty to keep current image' : 'Select an image file'}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter image title (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Enter image subtitle (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedItem ? 'Update' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Carousel Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this carousel image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Carousel;







