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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { galleryAPI, departmentsAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  department?: string;
}

interface Department {
  id: number;
  name: string;
  stream: string;
  level: string;
  image: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    alt: '',
    department: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const fetchDepartments = async () => {
    try {
      const data = await departmentsAPI.getAll();
      if (Array.isArray(data)) {
        setDepartments(data);
        if (data.length === 0) {
          toast.warning('No departments found. Please add departments first in the Departments section.');
        }
      } else {
        console.error('Departments API returned non-array data:', data);
        setDepartments([]);
      }
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast.error(error.message || 'Failed to fetch departments');
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchDepartments();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await galleryAPI.getAll();
      setImages(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ alt: '', department: '' });
    setImageFile(null);
    setPreview('');
    // Refetch departments when opening the dialog to ensure we have the latest list
    fetchDepartments();
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

  const handleDelete = (item: GalleryImage) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!imageFile) {
        toast.error('Please select an image');
        return;
      }
      toast.info('Uploading image…');
      const src = await uploadToSupabase(imageFile, 'gallery', 'images');
      await galleryAPI.create({ src, alt: formData.alt, department: formData.department });
      toast.success('Gallery image added successfully');
      setDialogOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload gallery image');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await galleryAPI.delete(selectedItem.id);
      toast.success('Gallery image deleted successfully');
      setDeleteDialogOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gallery image');
    }
  };

  const columns = [
    {
      key: 'src',
      header: 'Image',
      render: (item: GalleryImage) => {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const imageSrc = item.src.startsWith('/') 
          ? `${API_BASE_URL}${item.src}` 
          : item.src.startsWith('http') 
            ? item.src 
            : `${API_BASE_URL}/${item.src}`;
        return (
          <img
            src={imageSrc}
            alt={item.alt}
            className="w-20 h-12 object-cover rounded"
            onError={(e) => {
              console.error('Failed to load gallery image in admin:', imageSrc);
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        );
      },
    },
    { key: 'alt', header: 'Alt Text' },
    { key: 'department', header: 'Department' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-muted-foreground mt-2">Manage gallery images</p>
      </div>

      <DataTable
        data={images}
        columns={columns}
        onAdd={handleAdd}
        onDelete={handleDelete}
        addLabel="Add Gallery Image"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
            <DialogDescription>Upload a new gallery image</DialogDescription>
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
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Enter alt text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              {departments.length === 0 ? (
                <>
                  <Select disabled>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="No departments available" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-departments" disabled>
                        No departments available
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    No departments found. Please add departments in the <strong>Departments</strong> section first.
                  </p>
                </>
              ) : (
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this gallery image? This action cannot be undone.
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

export default Gallery;



