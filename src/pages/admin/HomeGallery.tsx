import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { homeGalleryAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Image } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface HomeGalleryImage {
  id: number;
  image: string;
  order?: number;
}

const HomeGallery = () => {
  const [images, setImages] = useState<HomeGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await homeGalleryAPI.getAll();
      console.log('Fetched gallery data:', data);
      
      // Handle case where API returns empty array or null
      if (!data || !Array.isArray(data) || data.length === 0) {
        // Initialize with 8 placeholder images
        const placeholderImages = Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          image: '/placeholder.svg',
          order: i
        }));
        setImages(placeholderImages);
        return;
      }
      
      // Ensure we have exactly 8 images
      const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      while (sortedData.length < 8) {
        sortedData.push({
          id: Date.now() + sortedData.length,
          image: '/placeholder.svg',
          order: sortedData.length
        });
      }
      setImages(sortedData.slice(0, 8));
    } catch (error: any) {
      console.error('Error fetching gallery:', error);
      // On error, still show 8 placeholder images so admin can add images
      const placeholderImages = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        image: '/placeholder.svg',
        order: i
      }));
      setImages(placeholderImages);
      toast.error(error.message || 'Failed to fetch gallery images. Showing placeholders.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setSelectedIndex(index);
    setImageFile(null);
    const image = images[index];
    // Set preview to current image
    const imageUrl = image.image.startsWith('/') 
      ? (image.image.startsWith('/uploads') ? `${API_BASE_URL}${image.image}` : image.image)
      : image.image;
    setPreview(imageUrl);
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

  const handleSubmit = async () => {
    if (selectedIndex === null) return;
    
    try {
      const image = images[selectedIndex];
      if (!imageFile) {
        toast.error('Please select an image');
        return;
      }
      
      await homeGalleryAPI.update(image.id, imageFile);
      toast.success('Image updated successfully');
      setDialogOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Home Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Manage the 8 gallery images displayed on the home page. Click on any image to edit it.
        </p>
        <p className="text-sm text-amber-600 mt-2">
          Note: Only these 8 images can be edited. You cannot add or remove images.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-all"
            onClick={() => handleEdit(index)}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
              {image.image && image.image !== '/placeholder.svg' ? (
                <img
                  src={image.image.startsWith('/uploads') 
                    ? `${API_BASE_URL}${image.image}` 
                    : image.image.startsWith('/') 
                      ? image.image 
                      : image.image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Image className="w-12 h-12 mb-2" />
                  <p className="text-xs">No Image</p>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                <Image className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Edit Image {index + 1}</p>
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              {index + 1}
            </div>
        </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Gallery Image {selectedIndex !== null ? selectedIndex + 1 : ''}
            </DialogTitle>
            <DialogDescription>
              Upload a new image to replace the current one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {(preview || imageFile) && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain rounded bg-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                {!preview && !imageFile && selectedIndex !== null && images[selectedIndex] && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Current Image:</p>
                    <img
                      src={images[selectedIndex].image.startsWith('/uploads') 
                        ? `${API_BASE_URL}${images[selectedIndex].image}` 
                        : images[selectedIndex].image.startsWith('/') 
                          ? images[selectedIndex].image 
                          : images[selectedIndex].image}
                      alt="Current"
                      className="w-full max-h-96 object-contain rounded bg-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!imageFile}>
              Update Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeGallery;

