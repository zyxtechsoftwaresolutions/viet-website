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
import { hodsAPI, departmentsAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';

interface HOD {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  email?: string;
  phone?: string;
  experience?: string;
  department?: string;
  image?: string;
  resume?: string;
}

interface Department {
  id: number;
  name: string;
  stream: string;
  level: string;
  image: string;
}

const HODs = () => {
  const [hods, setHODs] = useState<HOD[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HOD | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    qualification: '',
    email: '',
    phone: '',
    experience: '',
    department: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const fetchHODs = async () => {
    try {
      const data = await hodsAPI.getAll();
      console.log('Fetched HODs:', data);
      if (Array.isArray(data)) {
        setHODs(data);
        if (data.length === 0) {
          console.log('No HODs found in database');
        }
      } else {
        console.error('HODs API returned non-array data:', data);
        setHODs([]);
      }
    } catch (error: any) {
      console.error('Error fetching HODs:', error);
      toast.error(error.message || 'Failed to fetch HODs');
      setHODs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await departmentsAPI.getAll();
      console.log('Fetched departments:', data);
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
    fetchHODs();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      designation: '',
      qualification: '',
      email: '',
      phone: '',
      experience: '',
      department: '',
    });
    setImageFile(null);
    setResumeFile(null);
    setPreview('');
    // Refetch departments when opening the dialog to ensure we have the latest list
    fetchDepartments();
    setDialogOpen(true);
  };

  const handleEdit = (item: HOD) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      designation: item.designation,
      qualification: item.qualification,
      email: item.email || '',
      phone: item.phone || '',
      experience: item.experience || '',
      department: item.department || '',
    });
    setImageFile(null);
    setResumeFile(null);
    // Set preview with full URL if image exists
    if (item.image) {
      const imageUrl = item.image.startsWith('http') 
        ? item.image 
        : item.image.startsWith('/') 
            ? `http://localhost:3001${item.image}` 
            : `http://localhost:3001/${item.image}`;
      setPreview(imageUrl);
    } else {
      setPreview('');
    }
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

  const handleDelete = (item: HOD) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl: string | null = null;
      let resumeUrl: string | null = null;
      if (imageFile) {
        toast.info('Uploading image…');
        imageUrl = await uploadToSupabase(imageFile, 'hods', 'images');
      }
      if (resumeFile) {
        toast.info('Uploading resume…');
        resumeUrl = await uploadToSupabase(resumeFile, 'hods', 'images');
      }
      const payload = {
        ...formData,
        image: imageUrl ?? (selectedItem?.image ?? null),
        resume: resumeUrl ?? (selectedItem?.resume ?? null),
      };
      if (selectedItem) {
        await hodsAPI.update(selectedItem.id, payload);
        toast.success('HOD updated successfully');
      } else {
        await hodsAPI.create(payload);
        toast.success('HOD added successfully');
      }
      setDialogOpen(false);
      setTimeout(() => fetchHODs(), 100);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save HOD');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await hodsAPI.delete(selectedItem.id);
      toast.success('HOD deleted successfully');
      setDeleteDialogOpen(false);
      fetchHODs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete HOD');
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (item: HOD) => {
        const imageUrl = item.image 
          ? (item.image.startsWith('http') 
              ? item.image 
              : item.image.startsWith('/') 
                  ? `http://localhost:3001${item.image}` 
                  : `http://localhost:3001/${item.image}`)
          : '/placeholder.svg';
        console.log(`HOD ${item.name} image URL:`, imageUrl, 'Original image path:', item.image);
        return (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-full"
            onError={(e) => {
              console.error(`Failed to load image for ${item.name}:`, imageUrl);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        );
      },
    },
    { key: 'name', header: 'Name' },
    { key: 'designation', header: 'Designation' },
    { key: 'qualification', header: 'Qualification' },
    { key: 'department', header: 'Department' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Heads of Department (HODs)</h1>
        <p className="text-muted-foreground mt-2">Manage Heads of Department</p>
      </div>

      <DataTable
        data={hods}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add HOD"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit HOD' : 'Add HOD'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update HOD details' : 'Add a new Head of Department'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {preview && (
                  <img
                    src={preview.startsWith('data:') || preview.startsWith('http') ? preview : (preview.startsWith('/') ? `http://localhost:3001${preview}` : `http://localhost:3001/${preview}`)}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full mt-2"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF/DOC)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                {selectedItem?.resume && !resumeFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {selectedItem.resume.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g., Professor & HOD"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., M.Tech., Ph.D"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g., 13 years"
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
            <AlertDialogTitle>Delete HOD</AlertDialogTitle>
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

export default HODs;

