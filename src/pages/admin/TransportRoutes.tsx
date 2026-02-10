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
import { transportRoutesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { ImagePlus, X } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '') || 'http://localhost:3001';

interface TransportRoute {
  id: number;
  name: string;
  from: string;
  to: string;
  stops: number;
  time: string;
  frequency: string;
  busNo: string;
  driverName: string;
  driverContactNo: string;
  seatingCapacity: number;
  image?: string | null;
}

const TransportRoutes = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransportRoute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: 'VIET Campus, Narava',
    stops: 0,
    time: '',
    frequency: 'Morning & Evening',
    busNo: '',
    driverName: '',
    driverContactNo: '',
    seatingCapacity: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await transportRoutesAPI.getAll();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      toast.error((error as Error)?.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      from: '',
      to: 'VIET Campus, Narava',
      stops: 0,
      time: '',
      frequency: 'Morning & Evening',
      busNo: '',
      driverName: '',
      driverContactNo: '',
      seatingCapacity: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: TransportRoute) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      from: item.from,
      to: item.to,
      stops: item.stops ?? 0,
      time: item.time ?? '',
      frequency: item.frequency ?? 'Morning & Evening',
      busNo: item.busNo,
      driverName: item.driverName,
      driverContactNo: item.driverContactNo,
      seatingCapacity: item.seatingCapacity ?? 0,
    });
    setImageFile(null);
    setImagePreview(item.image ? `${API_BASE}${item.image}` : null);
    setDialogOpen(true);
  };

  const handleDelete = (item: TransportRoute) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(selectedItem?.image ? `${API_BASE}${selectedItem.image}` : null);
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
        imageUrl = await uploadToSupabase(imageFile, 'transport-routes', 'images');
      }
      const payload = {
        ...formData,
        name: formData.name || 'Route',
        busNo: formData.busNo,
        driverName: formData.driverName,
        driverContactNo: formData.driverContactNo,
        seatingCapacity: formData.seatingCapacity,
        image: imageUrl ?? (selectedItem?.image ?? null),
      };
      if (selectedItem) {
        await transportRoutesAPI.update(selectedItem.id, payload);
        toast.success('Route updated successfully');
      } else {
        await transportRoutesAPI.create(payload);
        toast.success('Route added successfully');
      }
      setDialogOpen(false);
      fetchRoutes();
    } catch (error: unknown) {
      toast.error((error as Error)?.message || 'Failed to save route');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await transportRoutesAPI.delete(selectedItem.id);
      toast.success('Route deleted successfully');
      setDeleteDialogOpen(false);
      fetchRoutes();
    } catch (error: unknown) {
      toast.error((error as Error)?.message || 'Failed to delete route');
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (item: TransportRoute) =>
        item.image ? (
          <img
            src={`${API_BASE}${item.image}`}
            alt=""
            className="h-12 w-16 rounded object-cover border"
          />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    { key: 'name', header: 'Route Name' },
    { key: 'busNo', header: 'Bus No' },
    { key: 'driverName', header: 'Driver' },
    { key: 'driverContactNo', header: 'Contact' },
    { key: 'seatingCapacity', header: 'Seats' },
    {
      key: 'from',
      header: 'From → To',
      render: (item: TransportRoute) => (
        <span className="text-xs">{item.from} → {item.to}</span>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bus Routes (Transport)</h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, or delete bus route cards shown on the Transport page. Upload an image for the hover overlay (driver/bus photo).
        </p>
      </div>

      <DataTable
        data={routes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Route"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Route' : 'Add Route'}</DialogTitle>
            <DialogDescription>
              Route details and image are shown on the Transport page. Image appears on card hover with glass effect.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Route Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Route 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="busNo">Bus No</Label>
                <Input
                  id="busNo"
                  value={formData.busNo}
                  onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
                  placeholder="e.g. AP 31 TB 1234"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from">Start Point (From)</Label>
              <Input
                id="from"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                placeholder="e.g. Dwaraka Nagar / NAD Kotha Road"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">End Point (To)</Label>
              <Input
                id="to"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                placeholder="e.g. VIET Campus, Narava"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="e.g. K. Venkata Rao"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverContactNo">Driver Contact No</Label>
                <Input
                  id="driverContactNo"
                  value={formData.driverContactNo}
                  onChange={(e) => setFormData({ ...formData, driverContactNo: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stops">Stops</Label>
                <Input
                  id="stops"
                  type="number"
                  min={0}
                  value={formData.stops || ''}
                  onChange={(e) => setFormData({ ...formData, stops: parseInt(e.target.value, 10) || 0 })}
                  placeholder="8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Duration</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g. 25 min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                <Input
                  id="seatingCapacity"
                  type="number"
                  min={0}
                  value={formData.seatingCapacity || ''}
                  onChange={(e) => setFormData({ ...formData, seatingCapacity: parseInt(e.target.value, 10) || 0 })}
                  placeholder="45"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="e.g. Morning & Evening"
              />
            </div>
            <div className="space-y-2">
              <Label>Route / Bus image (hover overlay)</Label>
              <p className="text-xs text-muted-foreground">
                Shown when user hovers over the card. Recommended: bus or driver photo.
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
            <AlertDialogTitle>Delete Route</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedItem?.name}&quot; (Bus {selectedItem?.busNo})? This action cannot be undone.
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

export default TransportRoutes;
