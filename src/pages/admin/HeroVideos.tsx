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
import { heroVideosAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Video, Upload } from 'lucide-react';

interface HeroVideo {
  id: number;
  src: string;
  poster?: string | null;
  badge?: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
}

const HeroVideos = () => {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HeroVideo | null>(null);
  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    subtitle: '',
    buttonText: 'Apply Now',
    buttonLink: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [posterPreview, setPosterPreview] = useState<string>('');

  // Backend serves uploads at origin root (no /api). Use full URL so image requests show in Network and work from any host.
  const uploadsOrigin = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/api\/?$/, '');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await heroVideosAPI.getAll();
      setVideos(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch hero videos');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ badge: '', title: '', subtitle: '', buttonText: 'Apply Now', buttonLink: '' });
    setVideoFile(null);
    setPosterFile(null);
    setVideoPreview('');
    setPosterPreview('');
    setDialogOpen(true);
  };

  const handleEdit = (item: HeroVideo) => {
    setSelectedItem(item);
    setFormData({
      badge: item.badge || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      buttonText: item.buttonText || 'Apply Now',
      buttonLink: item.buttonLink || '',
    });
    setVideoFile(null);
    setPosterFile(null);
    setVideoPreview(item.src ? (uploadsOrigin ? `${uploadsOrigin}${item.src}` : item.src) : '');
    setPosterPreview(item.poster ? (uploadsOrigin ? `${uploadsOrigin}${item.poster}` : item.poster) : '');
    setDialogOpen(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (item: HeroVideo) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!videoFile && !selectedItem) {
        toast.error('Please select a video file');
        return;
      }

      if (selectedItem) {
        await heroVideosAPI.update(selectedItem.id, videoFile, posterFile, formData);
        toast.success('Hero video updated successfully');
      } else {
        if (!videoFile) {
          toast.error('Please select a video file');
          return;
        }
        await heroVideosAPI.create(videoFile, posterFile, formData);
        toast.success('Hero video added successfully');
      }
      setDialogOpen(false);
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save hero video');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await heroVideosAPI.delete(selectedItem.id);
      toast.success('Hero video deleted successfully');
      setDeleteDialogOpen(false);
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete hero video');
    }
  };

  const columns = [
    {
      key: 'src',
      header: 'Video',
      render: (item: HeroVideo) => (
        <div className="flex items-center gap-2">
          {item.poster ? (
            <img
              src={item.poster.startsWith('/') ? (uploadsOrigin ? `${uploadsOrigin}${item.poster}` : item.poster) : item.poster}
              alt={item.title}
              className="w-20 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
              <Video className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    { key: 'badge', header: 'Badge', render: (item: HeroVideo) => item.badge || '-' },
    { key: 'title', header: 'Title' },
    {
      key: 'subtitle',
      header: 'Subtitle',
      render: (item: HeroVideo) => (
        <span className="line-clamp-2 max-w-md">{item.subtitle}</span>
      ),
    },
    { key: 'buttonText', header: 'Button Text' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hero Videos</h1>
        <p className="text-muted-foreground mt-2">Manage hero section videos displayed on the homepage</p>
      </div>

      <DataTable
        data={videos}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Hero Video"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Hero Video' : 'Add Hero Video'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update hero video details' : 'Upload a new hero video for the homepage'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="video">Video File *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="cursor-pointer"
                />
                {videoPreview && (
                  <div className="relative w-48 h-32 bg-muted rounded overflow-hidden">
                    {videoFile ? (
                      <video
                        src={videoPreview}
                        className="w-full h-full object-cover"
                        controls
                        muted
                      />
                    ) : (
                      <video
                        src={videoPreview}
                        className="w-full h-full object-cover"
                        controls
                        muted
                      />
                    )}
                  </div>
                )}
              </div>
              {selectedItem && (
                <p className="text-sm text-muted-foreground">
                  Leave empty to keep current video
                </p>
              )}
              {!selectedItem && (
                <p className="text-sm text-muted-foreground">
                  Supported formats: MP4, WebM, MOV, AVI, MKV (max 200MB)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="poster">Poster Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="poster"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="cursor-pointer"
                />
                {posterPreview && (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Poster image shown before video loads (optional)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Text (Optional)</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g., Admissions Open 2026"
              />
              <p className="text-sm text-muted-foreground">
                Glass effect badge text shown above the title
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., ADMISSIONS OPEN 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., Join VIET, begin your Journey of Excellence..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Apply Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
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
            <AlertDialogTitle>Delete Hero Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hero video? This will permanently delete the video file and poster image. This action cannot be undone.
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

export default HeroVideos;
