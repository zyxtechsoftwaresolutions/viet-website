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
import { uploadVideoToSupabase, uploadImageToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { Monitor, Smartphone, Video } from 'lucide-react';

interface HeroVideo {
  id: number;
  src?: string | null;
  poster?: string | null;
  mobileSrc?: string | null;
  mobilePoster?: string | null;
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
}

function MediaThumb({ video, photo }: { video?: string | null; photo?: string | null }) {
  if (photo) {
    return <img src={photo} alt="" className="w-16 h-10 object-cover rounded" />;
  }
  if (video) {
    return (
      <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
        <Video className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }
  return <div className="w-16 h-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground">—</div>;
}

function HeroMediaFields({
  label,
  icon: Icon,
  videoPreview,
  photoPreview,
  onVideoChange,
  onPhotoChange,
  hint,
}: {
  label: string;
  icon: typeof Monitor;
  videoPreview: string;
  photoPreview: string;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint: string;
}) {
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-muted/20">
      <div className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="space-y-2">
        <Label>Video (optional)</Label>
        <div className="flex items-center gap-4 flex-wrap">
          <Input type="file" accept="video/*" onChange={onVideoChange} className="cursor-pointer max-w-md" />
          {videoPreview && (
            <video src={videoPreview} className="w-40 h-24 object-cover rounded bg-black" controls muted />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Photo (optional fallback)</Label>
        <div className="flex items-center gap-4 flex-wrap">
          <Input type="file" accept="image/*" onChange={onPhotoChange} className="cursor-pointer max-w-md" />
          {photoPreview && (
            <img src={photoPreview} alt="" className="w-32 h-20 object-cover rounded" />
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
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
    buttonText: '',
    buttonLink: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [mobileVideoFile, setMobileVideoFile] = useState<File | null>(null);
  const [mobilePosterFile, setMobilePosterFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [posterPreview, setPosterPreview] = useState('');
  const [mobileVideoPreview, setMobileVideoPreview] = useState('');
  const [mobilePosterPreview, setMobilePosterPreview] = useState('');

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

  const resetMediaState = () => {
    setVideoFile(null);
    setPosterFile(null);
    setMobileVideoFile(null);
    setMobilePosterFile(null);
    setVideoPreview('');
    setPosterPreview('');
    setMobileVideoPreview('');
    setMobilePosterPreview('');
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ badge: '', title: '', subtitle: '', buttonText: '', buttonLink: '' });
    resetMediaState();
    setDialogOpen(true);
  };

  const handleEdit = (item: HeroVideo) => {
    setSelectedItem(item);
    setFormData({
      badge: item.badge || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      buttonText: item.buttonText || '',
      buttonLink: item.buttonLink || '',
    });
    resetMediaState();
    setVideoPreview(item.src || '');
    setPosterPreview(item.poster || '');
    setMobileVideoPreview(item.mobileSrc || '');
    setMobilePosterPreview(item.mobilePoster || '');
    setDialogOpen(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleMobileVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobileVideoFile(file);
      setMobileVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleMobilePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobilePosterFile(file);
      setMobilePosterPreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = (item: HeroVideo) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const hasMedia = (
    file: File | null,
    existing?: string | null,
    otherFile?: File | null,
    otherExisting?: string | null
  ) => Boolean(file || existing?.trim() || otherFile || otherExisting?.trim());

  const handleSubmit = async () => {
    try {
      const desktopOk = hasMedia(videoFile, selectedItem?.src, posterFile, selectedItem?.poster);
      const mobileOk = hasMedia(mobileVideoFile, selectedItem?.mobileSrc, mobilePosterFile, selectedItem?.mobilePoster);

      if (!desktopOk && !mobileOk) {
        toast.error('Upload at least one desktop or mobile video/photo');
        return;
      }

      let src: string | undefined;
      let poster: string | undefined;
      let mobileSrc: string | undefined;
      let mobilePoster: string | undefined;

      if (videoFile) {
        toast.info('Uploading desktop video…');
        src = await uploadVideoToSupabase(videoFile);
      }
      if (posterFile) {
        toast.info('Uploading desktop photo…');
        poster = await uploadImageToSupabase(posterFile, 'hero-videos');
      }
      if (mobileVideoFile) {
        toast.info('Uploading mobile video…');
        mobileSrc = await uploadVideoToSupabase(mobileVideoFile, 'hero-videos/mobile');
      }
      if (mobilePosterFile) {
        toast.info('Uploading mobile photo…');
        mobilePoster = await uploadImageToSupabase(mobilePosterFile, 'hero-videos/mobile');
      }

      if (selectedItem) {
        const payload: Record<string, unknown> = { ...formData };
        if (src !== undefined) payload.src = src;
        if (poster !== undefined) payload.poster = poster;
        if (mobileSrc !== undefined) payload.mobileSrc = mobileSrc;
        if (mobilePoster !== undefined) payload.mobilePoster = mobilePoster;
        await heroVideosAPI.update(selectedItem.id, payload);
        toast.success('Hero slide updated successfully');
      } else {
        if (!src && !poster && !mobileSrc && !mobilePoster) {
          toast.error('Please upload at least one video or photo');
          return;
        }
        await heroVideosAPI.create({
          ...formData,
          src: src || null,
          poster: poster || null,
          mobileSrc: mobileSrc || null,
          mobilePoster: mobilePoster || null,
        });
        toast.success('Hero slide added successfully');
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
      key: 'media',
      header: 'Media',
      render: (item: HeroVideo) => (
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-1">Desktop</p>
            <MediaThumb video={item.src} photo={item.poster} />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-1">Mobile</p>
            <MediaThumb video={item.mobileSrc} photo={item.mobilePoster} />
          </div>
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
        <h1 className="text-3xl font-bold">Hero Slides</h1>
        <p className="text-muted-foreground mt-2">
          Upload separate desktop and mobile media. Video is shown first; photo is used only if video is missing or cannot play.
        </p>
      </div>

      <DataTable
        data={videos}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Hero Slide"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Hero Slide' : 'Add Hero Slide'}</DialogTitle>
            <DialogDescription>
              Desktop media is shown on tablets/desktops only. Mobile media is shown on phones only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <HeroMediaFields
              label="Desktop view"
              icon={Monitor}
              videoPreview={videoPreview}
              photoPreview={posterPreview}
              onVideoChange={handleVideoChange}
              onPhotoChange={handlePosterChange}
              hint="Shown on screens 768px and wider. Video takes priority; photo is fallback."
            />
            <HeroMediaFields
              label="Mobile view"
              icon={Smartphone}
              videoPreview={mobileVideoPreview}
              photoPreview={mobilePosterPreview}
              onVideoChange={handleMobileVideoChange}
              onPhotoChange={handleMobilePosterChange}
              hint="Shown on screens below 768px. Video takes priority; photo is fallback."
            />
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Text (Optional)</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g., Admissions Open 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text (Optional)</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link (Optional)</Label>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{selectedItem ? 'Update' : 'Upload'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Delete this hero slide and all associated desktop and mobile media?
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
