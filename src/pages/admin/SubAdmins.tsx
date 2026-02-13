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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';
import { UserPlus, Pencil, Trash2, Shield } from 'lucide-react';

// Section keys must match backend API_TO_SECTION and AdminLayout menuItems path
export const ADMIN_SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'hero-videos', label: 'Hero Videos' },
  { key: 'intro-video', label: 'Intro Video' },
  { key: 'ticker', label: 'Scrolling Text' },
  { key: 'news-announcements', label: 'News & Announcements' },
  { key: 'events', label: 'Events' },
  { key: 'departments', label: 'Departments' },
  { key: 'department-pages', label: 'Department Pages' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'hods', label: 'HODs' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'vibe-at-viet', label: 'Vibe@Viet' },
  { key: 'recruiters', label: 'Recruiters' },
  { key: 'placement-section', label: 'Placement Section' },
  { key: 'transport-routes', label: 'Transport Routes' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'accreditations', label: 'Accreditations' },
  { key: 'pages', label: 'Pages' },
  { key: 'authorities', label: 'Authorities' },
];

interface SubAdmin {
  id: number;
  username: string;
  email: string;
  role: string;
  allowedSections: string[];
  createdAt?: string;
}

const SubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubAdmin | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    allowedSections: [] as string[],
  });

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const data = await authAPI.getSubAdmins();
      setSubAdmins(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch sub-admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      allowedSections: [],
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: SubAdmin) => {
    setSelectedItem(item);
    setFormData({
      username: item.username,
      email: item.email,
      password: '',
      allowedSections: item.allowedSections || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: SubAdmin) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSectionToggle = (key: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allowedSections: checked
        ? [...prev.allowedSections, key]
        : prev.allowedSections.filter((s) => s !== key),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (!selectedItem && !formData.password) {
      toast.error('Password is required for new sub-admin');
      return;
    }
    try {
      if (selectedItem) {
        await authAPI.updateSubAdmin(selectedItem.id, {
          username: formData.username.trim(),
          email: formData.email.trim() || undefined,
          password: formData.password || undefined,
          allowedSections: formData.allowedSections,
        });
        toast.success('Sub-admin updated successfully');
      } else {
        await authAPI.createSubAdmin({
          username: formData.username.trim(),
          email: formData.email.trim() || undefined,
          password: formData.password,
          allowedSections: formData.allowedSections,
        });
        toast.success('Sub-admin created successfully');
      }
      setDialogOpen(false);
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await authAPI.deleteSubAdmin(selectedItem.id);
      toast.success('Sub-admin deleted');
      setDeleteDialogOpen(false);
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub-Admins</h1>
          <p className="text-gray-600 mt-1">
            Create and manage sub-admins with restricted access to specific sections.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Sub-Admin
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : subAdmins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No sub-admins yet.</p>
            <p className="text-sm mt-1">Create one to delegate access to specific sections.</p>
            <Button onClick={handleAdd} className="mt-4">
              Add Sub-Admin
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Allowed Sections</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subAdmins.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.username}</TableCell>
                  <TableCell>{item.email || '—'}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {item.allowedSections?.length
                        ? item.allowedSections
                            .map(
                              (k) => ADMIN_SECTIONS.find((s) => s.key === k)?.label || k
                            )
                            .join(', ')
                        : 'None (locked)'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Sub-Admin' : 'Add Sub-Admin'}</DialogTitle>
            <DialogDescription>
              {selectedItem
                ? 'Update sub-admin details and allowed sections.'
                : 'Create a new sub-admin. They will only access the sections you allot.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. hod_cse"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hod_cse@viet.edu.in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {selectedItem ? '(leave blank to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={selectedItem ? '••••••••' : 'Min 6 characters'}
                required={!selectedItem}
              />
            </div>
            <div className="space-y-3">
              <Label>Allowed Sections</Label>
              <p className="text-sm text-muted-foreground">
                Select the sections this sub-admin can access. Other sections will be locked.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-lg p-4 max-h-48 overflow-y-auto">
                {ADMIN_SECTIONS.filter((s) => s.key !== 'dashboard').map((section) => (
                  <div
                    key={section.key}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={section.key}
                      checked={formData.allowedSections.includes(section.key)}
                      onCheckedChange={(checked) =>
                        handleSectionToggle(section.key, !!checked)
                      }
                    />
                    <label
                      htmlFor={section.key}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {section.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sub-Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedItem?.username}</strong>?
              They will no longer be able to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubAdmins;
