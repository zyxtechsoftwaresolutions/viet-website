import { useState, useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { eventsAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { ImagePlus, X } from 'lucide-react';

const eventImageUrl = (path: string | undefined) => (path && path.startsWith('http') ? path : path || null);

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  link?: string;
  image?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      setEvents(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      link: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: Event) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      time: item.time,
      location: item.location || '',
      link: item.link || '',
    });
    setImageFile(null);
    setImagePreview(eventImageUrl(item.image) ?? null);
    setDialogOpen(true);
  };

  const handleDelete = (item: Event) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImageFile(null);
      setImagePreview(eventImageUrl(selectedItem?.image) ?? null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        toast.info('Uploading image…');
        imageUrl = await uploadToSupabase(imageFile, 'events', 'images');
      }
      const payload = { ...formData, image: imageUrl ?? (selectedItem?.image ?? null) };
      if (selectedItem) {
        await eventsAPI.update(selectedItem.id, payload);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(payload);
        toast.success('Event created successfully');
      }
      setDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await eventsAPI.delete(selectedItem.id);
      toast.success('Event deleted successfully');
      setDeleteDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (item: Event) =>
        item.image ? (
          <img
            src={eventImageUrl(item.image) ?? ''}
            alt=""
            className="h-12 w-16 rounded object-cover border"
          />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    { key: 'title', header: 'Title' },
    {
      key: 'description',
      header: 'Description',
      render: (item: Event) => (
        <span className="line-clamp-2 max-w-md">{item.description}</span>
      ),
    },
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
    { key: 'location', header: 'Location' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events (Happenings)</h1>
        <p className="text-muted-foreground mt-2">
          Manage events shown as cards in the Happenings section. Add a cover image so they match the style of featured events.
        </p>
      </div>

      <DataTable
        data={events}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Event"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Event' : 'Add Event'}</DialogTitle>
            <DialogDescription>
              Events appear as cards on the Happenings section with title, date, description, and cover image (like New Year, Sankranthi, Republic Day).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. NEW YEAR CELEBRATIONS 2K26"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description for the card"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover image (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Shown on the event card. Recommended size similar to other Happenings cards.
              </p>
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-28 w-40 rounded-lg border object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-28 w-40 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground hover:bg-muted"
                    >
                      <ImagePlus className="h-8 w-8" />
                      <span className="mt-1 text-xs">Add image</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {!imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose file
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Seminar Hall"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link (optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedItem?.title}&quot;? This action cannot be undone.
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

export default Events;
