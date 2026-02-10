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
import { vibeAtVietAPI, type VibeAtVietItem } from '@/lib/api';
import { uploadVibeVideoToSupabase, uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { ImagePlus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { isVideoUrl, getVideoEmbedUrl } from '@/lib/videoUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { convertGoogleDriveLink, isGoogleDriveLink } from '@/lib/googleDriveUtils';

const VibeAtVietAdmin = () => {
  const [items, setItems] = useState<VibeAtVietItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VibeAtVietItem | null>(null);
  const [caption, setCaption] = useState('');
  const [gridPosition, setGridPosition] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState<string>('');
  const [imageInputType, setImageInputType] = useState<'file' | 'link'>('file');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState<string>('');
  const [videoInputType, setVideoInputType] = useState<'file' | 'link'>('file');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<VibeAtVietItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const imageUrl = (path: string) =>
    isGoogleDriveLink(path) ? convertGoogleDriveLink(path) : path;

  const fetchItems = async () => {
    try {
      const data = await vibeAtVietAPI.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch';
      toast.error(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setCaption('');
    setGridPosition(1);
    setImageFile(null);
    setImageLink('');
    setImageInputType('file');
    setVideoFile(null);
    setVideoLink('');
    setVideoInputType('file');
    setImagePreview('');
    setVideoPreview('');
    setDialogOpen(true);
  };

  const openEdit = (item: VibeAtVietItem) => {
    setEditingItem(item);
    setCaption(item.caption || '');
    setGridPosition((item.order ?? 0) + 1);
    setImageFile(null);
    setVideoFile(null);
    
    // Determine if existing image is a link (Google Drive) or file
    if (isGoogleDriveLink(item.image) || (item.image.startsWith('http://') || item.image.startsWith('https://'))) {
      setImageInputType('link');
      setImageLink(item.image);
      setImagePreview(imageUrl(item.image));
    } else {
      setImageInputType('file');
      setImageLink('');
      setImagePreview(imageUrl(item.image));
    }
    
    // Determine if existing video is a link or file
    if (item.video) {
      if (isVideoUrl(item.video)) {
        setVideoInputType('link');
        setVideoLink(item.video ?? '');
        setVideoPreview(item.video ?? '');
      } else {
        setVideoInputType('file');
        setVideoLink('');
        setVideoPreview(imageUrl(item.video));
      }
    } else {
      setVideoInputType('file');
      setVideoLink('');
      setVideoPreview('');
    }
    
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageLink('');
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      if (editingItem?.image && (isGoogleDriveLink(editingItem.image) || editingItem.image.startsWith('http'))) {
        setImagePreview(imageUrl(editingItem.image));
      } else {
        setImagePreview('');
      }
    }
  };

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setImageLink(link);
    setImageFile(null);
    if (link.trim()) {
      const convertedLink = isGoogleDriveLink(link) ? convertGoogleDriveLink(link) : link;
      setImagePreview(convertedLink);
    } else {
      setImagePreview('');
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoLink('');
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      if (editingItem?.video && !isVideoUrl(editingItem.video)) {
        setVideoPreview(imageUrl(editingItem.video));
      } else {
        setVideoPreview('');
      }
    }
  };

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setVideoLink(link);
    setVideoFile(null);
    if (link.trim()) {
      setVideoPreview(link);
    } else {
      setVideoPreview('');
    }
  };

  const handleSubmit = async () => {
    if (editingItem) {
      if (!caption.trim()) {
        toast.error('Caption is required');
        return;
      }
      setSubmitting(true);
      try {
        let imageUrl: string | null = null;
        if (imageInputType === 'file' && imageFile) {
          toast.info('Uploading image…');
          imageUrl = await uploadToSupabase(imageFile, 'vibe-at-viet', 'images');
        }
        let videoUrl: string | null = null;
        if (videoInputType === 'file' && videoFile) {
          toast.info('Uploading video…');
          videoUrl = await uploadVibeVideoToSupabase(videoFile);
        }
        await vibeAtVietAPI.update(editingItem.id, {
          caption: caption.trim(),
          order: gridPosition - 1,
          ...(imageUrl !== null && { image: imageUrl }),
          ...(imageInputType === 'link' && { imageLink: imageLink.trim() || null }),
          ...(videoUrl !== null && { video: videoUrl }),
          ...(videoInputType === 'link' && { videoLink: videoLink.trim() || null }),
          ...(videoInputType === 'file' && !videoFile && !videoUrl && { video: null, videoLink: null }),
        });
        toast.success('Item updated');
        setDialogOpen(false);
        fetchItems();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Update failed';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!imageFile && !imageLink.trim()) {
        toast.error('Image is required (upload file or paste Google Drive link)');
        return;
      }
      if (!caption.trim()) {
        toast.error('Caption is required');
        return;
      }
      setSubmitting(true);
      try {
        let imageUrl: string | null = null;
        if (imageInputType === 'file' && imageFile) {
          toast.info('Uploading image…');
          imageUrl = await uploadToSupabase(imageFile, 'vibe-at-viet', 'images');
        }
        let videoUrl: string | null = null;
        if (videoInputType === 'file' && videoFile) {
          toast.info('Uploading video…');
          videoUrl = await uploadVibeVideoToSupabase(videoFile);
        }
        await vibeAtVietAPI.create({
          image: imageUrl ?? undefined,
          imageLink: imageInputType === 'link' && imageLink.trim() ? imageLink.trim() : undefined,
          video: videoUrl ?? undefined,
          videoLink: videoInputType === 'link' && videoLink.trim() ? videoLink.trim() : undefined,
          caption: caption.trim(),
          position: gridPosition,
        });
        toast.success('Photo added');
        setDialogOpen(false);
        fetchItems();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Add failed';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const openDelete = (item: VibeAtVietItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await vibeAtVietAPI.delete(itemToDelete.id);
      toast.success('Photo deleted');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Delete failed';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Vibe@Viet photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vibe@Viet</h1>
          <p className="text-muted-foreground mt-2">
            Manage the photos and videos in the Vibe@Viet section on the home page. Add, edit, or delete items and set captions.
          </p>
        </div>
        <Button onClick={openAdd}>
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative group border rounded-lg overflow-hidden bg-muted/50 hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
              {item.video ? (
                isVideoUrl(item.video) ? (
                  <div className="w-full h-full relative">
                    {(() => {
                      const videoInfo = getVideoEmbedUrl(item.video!);
                      return (
                        <iframe
                          src={videoInfo.embedUrl}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          style={{ border: 'none' }}
                          title={item.caption}
                        />
                      );
                    })()}
                  </div>
                ) : (
                  <video
                    src={imageUrl(item.video)}
                    poster={imageUrl(item.image)}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )
              ) : (
                <img
                  src={imageUrl(item.image)}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src = '/placeholder.svg';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => openEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => openDelete(item)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium line-clamp-2">{item.caption || 'No caption'}</p>
              <p className="text-xs text-muted-foreground mt-1">Grid position: {(item.order ?? index) + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="border rounded-lg p-12 text-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No photos yet. Click &quot;Add Photo&quot; to add items to the Vibe@Viet grid.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Vibe@Viet Item' : 'Add Photo to Vibe@Viet'}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update the image (upload file or paste Google Drive link), optional video, and caption. Leave image/video empty to keep current.'
                : 'Upload an image file or paste a Google Drive link (required), optional video, and caption.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Grid position in layout</Label>
              <p className="text-xs text-muted-foreground">
                The Vibe@Viet section has 12 grid slots. Choose which slot (1–12) this image or video should appear in.
              </p>
              <Select
                value={String(gridPosition ?? 1)}
                onValueChange={(v) => setGridPosition(parseInt(v, 10) || 1)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      Position {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={caption ?? ''}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short caption for this photo"
              />
            </div>
            <div className="space-y-2">
              <Label>{editingItem ? 'New Image (optional)' : 'Image (required)'}</Label>
              <RadioGroup value={imageInputType} onValueChange={(value) => {
                setImageInputType(value as 'file' | 'link');
                setImageFile(null);
                setImageLink('');
                setImagePreview('');
              }} className="flex gap-6 mb-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="image-file" />
                  <Label htmlFor="image-file" className="cursor-pointer">Upload Image File</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="image-link" />
                  <Label htmlFor="image-link" className="cursor-pointer">Paste Google Drive Link</Label>
                </div>
              </RadioGroup>
              
              {imageInputType === 'file' ? (
                <>
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                  {(imagePreview || imageFile) && (
                    <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                      <p className="text-sm font-medium mb-1">Preview:</p>
                      <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain rounded" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Input
                    type="url"
                    value={imageLink ?? ''}
                    onChange={handleImageLinkChange}
                    placeholder="https://drive.google.com/file/d/... or https://drive.google.com/open?id=..."
                    className="cursor-text"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a Google Drive public folder link or direct file link. Make sure the file/folder is set to "Anyone with the link can view".
                  </p>
                  {imagePreview && (
                    <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                      <p className="text-sm font-medium mb-1">Preview:</p>
                      <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain rounded" onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }} />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label>Video (optional – will play instead of image when set)</Label>
              <RadioGroup value={videoInputType} onValueChange={(value) => {
                setVideoInputType(value as 'file' | 'link');
                setVideoFile(null);
                setVideoLink('');
                setVideoPreview('');
              }} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="video-file" />
                  <Label htmlFor="video-file" className="cursor-pointer">Upload Video File</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="video-link" />
                  <Label htmlFor="video-link" className="cursor-pointer">Paste Video Link (YouTube, Instagram, etc.)</Label>
                </div>
              </RadioGroup>
              
              {videoInputType === 'file' ? (
                <>
                  <Input type="file" accept="video/*" onChange={handleVideoChange} className="cursor-pointer" />
                  {videoPreview && !isVideoUrl(videoPreview) && (
                    <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                      <p className="text-sm font-medium mb-1">Video preview:</p>
                      <video src={videoPreview} controls className="w-full max-h-48 rounded" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Input
                    type="url"
                    value={videoLink ?? ''}
                    onChange={handleVideoLinkChange}
                    placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/file/d/..."
                    className="cursor-text"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported platforms: YouTube, Instagram, Vimeo, or Google Drive. Paste the full URL of the video.
                  </p>
                  {videoPreview && isVideoUrl(videoPreview) && (
                    <div className="mt-2 border rounded-lg p-2 bg-muted/50">
                      <p className="text-sm font-medium mb-1">Link preview:</p>
                      <p className="text-xs text-muted-foreground break-all mb-2">{videoPreview}</p>
                      {(() => {
                        const videoInfo = getVideoEmbedUrl(videoPreview);
                        return (
                          <div className="aspect-video w-full rounded overflow-hidden">
                            <iframe
                              src={videoInfo.embedUrl}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              style={{ border: 'none' }}
                              title="Video preview"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || (!editingItem && !imageFile && !imageLink.trim())}>
              {submitting ? 'Saving...' : editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from the Vibe@Viet section. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VibeAtVietAdmin;
