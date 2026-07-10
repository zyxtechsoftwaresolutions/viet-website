import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import HeroMediaFields, { type HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { galleryAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { imgUrl } from '@/lib/imageUtils';
import {
  DEFAULT_GALLERY_SETTINGS,
  normalizeGalleryPageData,
  photosForEvent,
  type GalleryEvent,
  type GalleryPageData,
  type GalleryPhoto,
} from '@/lib/galleryContent';
import { toast } from 'sonner';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';

const GalleryAdmin = () => {
  const [data, setData] = useState<GalleryPageData>(() =>
    normalizeGalleryPageData({ settings: DEFAULT_GALLERY_SETTINGS, events: [], images: [] })
  );
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaFormState>({
    image: '',
    video: '',
    imageFile: null,
    videoFile: null,
  });

  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<GalleryEvent | null>(null);
  const [eventForm, setEventForm] = useState({ name: '', badge: '', description: '' });
  const [deleteEvent, setDeleteEvent] = useState<GalleryEvent | null>(null);

  const [photoEventId, setPhotoEventId] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [deletePhoto, setDeletePhoto] = useState<GalleryPhoto | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await galleryAPI.getPage();
      const normalized = normalizeGalleryPageData(page);
      setData(normalized);
      setHeroMedia({
        image: normalized.settings.hero.heroImage || '',
        video: normalized.settings.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
      if (!photoEventId && normalized.events[0]) {
        setPhotoEventId(String(normalized.events[0].id));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectedEvent = useMemo(
    () => data.events.find((e) => String(e.id) === photoEventId),
    [data.events, photoEventId]
  );

  const eventPhotos = useMemo(() => {
    if (!selectedEvent) return [];
    return photosForEvent(data.images, selectedEvent);
  }, [data.images, selectedEvent]);

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      let heroImage = heroMedia.image || data.settings.hero.heroImage || '';
      if (heroMedia.imageFile) {
        heroImage = await uploadToSupabase(heroMedia.imageFile, 'gallery', 'hero');
      }
      await galleryAPI.updateSettings({
        hero: {
          badge: data.settings.hero.badge,
          title: data.settings.hero.title,
          description: data.settings.hero.description,
          heroImage: heroImage || undefined,
          video: data.settings.hero.video || undefined,
        },
        eventsSectionLabel: data.settings.eventsSectionLabel,
        eventsSectionTitle: data.settings.eventsSectionTitle,
      });
      toast.success('Gallery page settings saved');
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSavingHero(false);
    }
  };

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ name: '', badge: '', description: '' });
    setEventDialogOpen(true);
  };

  const openEditEvent = (event: GalleryEvent) => {
    setEditingEvent(event);
    setEventForm({ name: event.name, badge: event.badge, description: event.description });
    setEventDialogOpen(true);
  };

  const saveEvent = async () => {
    if (!eventForm.name.trim()) {
      toast.error('Event name is required');
      return;
    }
    try {
      if (editingEvent) {
        await galleryAPI.updateEvent(editingEvent.id, eventForm);
        toast.success('Event updated');
      } else {
        const created = await galleryAPI.createEvent(eventForm);
        setPhotoEventId(String(created.id));
        toast.success('Event created');
      }
      setEventDialogOpen(false);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save event');
    }
  };

  const confirmDeleteEvent = async () => {
    if (!deleteEvent) return;
    try {
      await galleryAPI.deleteEvent(deleteEvent.id);
      toast.success('Event and its photos deleted');
      setDeleteEvent(null);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length > 0) {
      setPhotoFiles((prev) => [...prev, ...picked]);
    }
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const removePhotoFile = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    if (!selectedEvent) {
      toast.error('Select an event first');
      return;
    }
    if (photoFiles.length === 0) {
      toast.error('Choose at least one photo');
      return;
    }
    setUploadingPhotos(true);
    try {
      for (const file of photoFiles) {
        const src = await uploadToSupabase(file, 'gallery', 'images');
        await galleryAPI.create({
          src,
          eventId: selectedEvent.id,
          eventName: selectedEvent.name,
          caption: photoCaption || file.name.replace(/\.[^.]+$/, ''),
        });
      }
      toast.success(`${photoFiles.length} photo(s) uploaded`);
      setPhotoFiles([]);
      setPhotoCaption('');
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const confirmDeletePhoto = async () => {
    if (!deletePhoto) return;
    try {
      await galleryAPI.delete(deletePhoto.id);
      toast.success('Photo deleted');
      setDeletePhoto(null);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete photo');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Manage the public gallery page — customize the hero, create events, and upload photos event-wise.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open('/gallery', '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View public page
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Page hero</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="photos">Event photos</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Gallery page hero</CardTitle>
              <CardDescription>Badge, title, description, and hero background shown at the top of /gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Badge</Label><Input value={data.settings.hero.badge} onChange={(e) => setData((p) => ({ ...p, settings: { ...p.settings, hero: { ...p.settings.hero, badge: e.target.value } } }))} /></div>
                <div><Label>Title</Label><Input value={data.settings.hero.title} onChange={(e) => setData((p) => ({ ...p, settings: { ...p.settings, hero: { ...p.settings.hero, title: e.target.value } } }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={data.settings.hero.description} onChange={(e) => setData((p) => ({ ...p, settings: { ...p.settings, hero: { ...p.settings.hero, description: e.target.value } } }))} rows={3} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Events section label</Label><Input value={data.settings.eventsSectionLabel} onChange={(e) => setData((p) => ({ ...p, settings: { ...p.settings, eventsSectionLabel: e.target.value } }))} /></div>
                <div><Label>Events section title</Label><Input value={data.settings.eventsSectionTitle} onChange={(e) => setData((p) => ({ ...p, settings: { ...p.settings, eventsSectionTitle: e.target.value } }))} /></div>
              </div>
              <HeroMediaFields
                value={heroMedia}
                onChange={(patch) => setHeroMedia((prev) => ({ ...prev, ...patch }))}
                imageSpec={IMAGE_SPECS.galleryPhoto}
                imageLabel="Hero background image"
                videoLabel="Hero video URL (optional)"
              />
              <ImageUploadGuide spec={IMAGE_SPECS.galleryPhoto} />
              <Button onClick={handleSaveHero} disabled={savingHero}>
                {savingHero ? 'Saving…' : 'Save page settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Events</CardTitle>
                <CardDescription>Create events such as AURA FEST, Sports Day, Convocation, etc.</CardDescription>
              </div>
              <Button onClick={openAddEvent}><Plus className="h-4 w-4 mr-1" /> Add event</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events yet. Add your first event to start uploading photos.</p>
              ) : (
                data.events.map((event) => (
                  <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                    <div className="min-w-0">
                      {event.badge && <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{event.badge}</p>}
                      <p className="font-semibold">{event.name}</p>
                      {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                      <p className="text-xs text-muted-foreground mt-2">{photosForEvent(data.images, event).length} photos</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditEvent(event)}>Edit</Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteEvent(event)} aria-label="Delete event">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Upload event photos</CardTitle>
              <CardDescription>Select an event and upload one or more photos. They appear grouped under that event on the public gallery page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event</Label>
                  <Select value={photoEventId} onValueChange={setPhotoEventId}>
                    <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                    <SelectContent>
                      {data.events.map((event) => (
                        <SelectItem key={event.id} value={String(event.id)}>{event.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Caption (optional, applied to all uploads in this batch)</Label>
                  <Input value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="e.g. Prize distribution" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="max-w-md cursor-pointer"
                    onChange={handlePhotoFilesChange}
                  />
                  <ImageUploadGuide {...IMAGE_SPECS.galleryPhoto} inline />
                </div>
                {photoFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm text-muted-foreground">{photoFiles.length} file(s) selected</p>
                      <Button type="button" variant="outline" size="sm" onClick={() => setPhotoFiles([])}>
                        Clear selection
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {photoFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative rounded-lg border overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full aspect-[4/3] object-cover"
                            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7"
                            onClick={() => removePhotoFile(index)}
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <p className="p-1.5 text-[10px] text-muted-foreground truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={uploadPhotos} disabled={uploadingPhotos || !selectedEvent}>
                {uploadingPhotos ? 'Uploading…' : 'Upload photos'}
              </Button>

              {selectedEvent && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Photos in {selectedEvent.name}</h3>
                  {eventPhotos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No photos for this event yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {eventPhotos.map((photo) => (
                        <div key={photo.id} className="relative group rounded-lg border overflow-hidden">
                          <img src={imgUrl(photo.src)} alt={photo.caption || selectedEvent.name} className="w-full aspect-[4/3] object-cover" />
                          <div className="p-2 text-xs text-muted-foreground line-clamp-2">{photo.caption || '—'}</div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setDeletePhoto(photo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit event' : 'Add event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Event name</Label><Input value={eventForm.name} onChange={(e) => setEventForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. AURA FEST" /></div>
            <div><Label>Badge (optional)</Label><Input value={eventForm.badge} onChange={(e) => setEventForm((p) => ({ ...p, badge: e.target.value }))} placeholder="e.g. Cultural" /></div>
            <div><Label>Description (optional)</Label><Textarea value={eventForm.description} onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEvent}>{editingEvent ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteEvent} onOpenChange={(open) => !open && setDeleteEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &quot;{deleteEvent?.name}&quot; and all photos linked to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletePhoto} onOpenChange={(open) => !open && setDeletePhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete photo?</AlertDialogTitle>
            <AlertDialogDescription>This photo will be removed from the gallery.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePhoto} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryAdmin;
