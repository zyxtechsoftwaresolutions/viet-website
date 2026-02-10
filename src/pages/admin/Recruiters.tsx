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
import { Textarea } from '@/components/ui/textarea';
import { recruitersAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';

interface Recruiter {
  id: number;
  name: string;
  logo: string;
  description: string;
}

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Recruiter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const data = await recruitersAPI.getAll();
      setRecruiters(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ name: '', description: '' });
    setLogoFile(null);
    setPreview('');
    setDialogOpen(true);
  };

  const handleEdit = (item: Recruiter) => {
    setSelectedItem(item);
    setFormData({ name: item.name, description: item.description });
    setLogoFile(null);
    setPreview(item.logo);
    setDialogOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (item: Recruiter) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let logoUrl: string | undefined;
      if (logoFile) {
        toast.info('Uploading logo…');
        logoUrl = await uploadToSupabase(logoFile, 'recruiters', 'images');
      }
      const logo = logoUrl ?? (selectedItem?.logo);
      if (!logo) {
        toast.error('Please select a logo');
        return;
      }
      if (selectedItem) {
        await recruitersAPI.update(selectedItem.id, { logo, name: formData.name, description: formData.description });
        toast.success('Recruiter updated successfully');
      } else {
        await recruitersAPI.create({ logo, name: formData.name, description: formData.description });
        toast.success('Recruiter added successfully');
      }
      setDialogOpen(false);
      fetchRecruiters();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save recruiter');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await recruitersAPI.delete(selectedItem.id);
      toast.success('Recruiter deleted successfully');
      setDeleteDialogOpen(false);
      fetchRecruiters();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete recruiter');
    }
  };

  const columns = [
    {
      key: 'logo',
      header: 'Logo',
      render: (item: Recruiter) => (
        <img
          src={item.logo.startsWith('/') ? item.logo : `http://localhost:3001${item.logo}`}
          alt={item.name}
          className="w-20 h-12 object-contain rounded"
        />
      ),
    },
    { key: 'name', header: 'Name' },
    {
      key: 'description',
      header: 'Description',
      render: (item: Recruiter) => (
        <span className="line-clamp-2 max-w-md">{item.description}</span>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recruiters</h1>
        <p className="text-muted-foreground mt-2">Manage recruiter companies</p>
      </div>

      <DataTable
        data={recruiters}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Recruiter"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Recruiter' : 'Add Recruiter'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update recruiter details' : 'Add a new recruiter company'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
                {preview && (
                  <img
                    src={preview.startsWith('/') ? preview : `http://localhost:3001${preview}`}
                    alt="Preview"
                    className="w-32 h-20 object-contain rounded bg-gray-100 p-2"
                  />
                )}
              </div>
              {selectedItem && (
                <p className="text-sm text-muted-foreground">
                  Leave empty to keep current logo
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter company description"
                rows={3}
              />
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
            <AlertDialogTitle>Delete Recruiter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
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

export default Recruiters;







