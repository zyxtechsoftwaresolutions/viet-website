import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GripVertical, ChevronUp, ChevronDown, Plus, Pencil, Trash2, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { facultyAPI, facultySettingsAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';

interface Faculty {
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
  sort_order?: number;
  sortOrder?: number;
}

function SortableFacultyRow({
  item,
  index,
  sortBy,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: {
  item: Faculty;
  index: number;
  sortBy: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: (i: number) => void;
  onMoveDown: (i: number) => void;
  onEdit: (item: Faculty) => void;
  onDelete: (item: Faculty) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = transform ? { transform: CSS.Transform.toString(transform), transition } : undefined;
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 bg-muted' : ''}
    >
      <TableCell>
        <div className="flex flex-col items-center gap-1">
          {sortBy === 'custom' ? (
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-1">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          ) : (
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onMoveUp(index)}
              disabled={!canMoveUp || sortBy !== 'custom'}
              title={sortBy !== 'custom' ? 'Switch to Custom order to reorder' : 'Move up'}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onMoveDown(index)}
              disabled={!canMoveDown || sortBy !== 'custom'}
              title={sortBy !== 'custom' ? 'Switch to Custom order to reorder' : 'Move down'}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-full"
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
        />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.designation}</TableCell>
      <TableCell>{item.qualification}</TableCell>
      <TableCell>{item.experience || '—'}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

const Faculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    qualification: '',
    email: '',
    phone: '',
    experience: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [sortBy, setSortBy] = useState<'custom' | 'experience' | 'designation' | 'designation-experience'>('custom');
  const [customOrder, setCustomOrder] = useState<Faculty[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFaculty = async () => {
    try {
      const data = await facultyAPI.getAll();
      if (Array.isArray(data)) {
        setFaculty(data);
      } else {
        console.error('Faculty API returned non-array data:', data);
        setFaculty([]);
      }
    } catch (error: any) {
      console.error('Error fetching faculty:', error);
      toast.error(error.message || 'Failed to fetch faculty');
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultySettings = async () => {
    try {
      const settings = await facultySettingsAPI.get();
      const sb = settings?.sort_by;
      if (['custom', 'default', 'experience', 'designation', 'designation-experience'].includes(sb)) {
        setSortBy(sb === 'default' ? 'custom' : sb);
      }
    } catch {
      // Use default
    }
  };

  useEffect(() => {
    fetchFaculty();
    fetchFacultySettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep customOrder in sync with faculty when in custom mode (sorted by sort_order)
  useEffect(() => {
    if (sortBy === 'custom' && faculty.length > 0) {
      const ordered = [...faculty].sort((a, b) => {
        const soA = a.sort_order ?? a.sortOrder ?? 0;
        const soB = b.sort_order ?? b.sortOrder ?? 0;
        return soB - soA;
      });
      setCustomOrder(ordered);
    }
  }, [faculty, sortBy]);

  const handleSortByChange = async (value: 'custom' | 'experience' | 'designation' | 'designation-experience') => {
    setSortBy(value);
    try {
      await facultySettingsAPI.update({ sort_by: value });
      toast.success('Faculty sort order updated on website');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save sort preference');
    }
  };

  // Parse experience string to extract years (e.g. "13 years" -> 13, "10+ years" -> 10)
  const parseExperienceYears = (exp: string | undefined): number => {
    if (!exp || !exp.trim()) return 0;
    const match = exp.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Designation hierarchy (higher number = more senior)
  const getDesignationRank = (des: string | undefined): number => {
    const d = (des || '').toLowerCase();
    if (d.includes('principal')) return 100;
    if (d.includes('hod') || d.includes('head of department')) return 90;
    if (d.includes('professor') && !d.includes('assistant') && !d.includes('associate')) return 80;
    if (d.includes('associate professor')) return 70;
    if (d.includes('assistant professor')) return 60;
    if (d.includes('lecturer') || d.includes('senior lecturer')) return 50;
    if (d.includes('guest') || d.includes('visiting')) return 40;
    return 30;
  };

  const sortedFaculty = useMemo(() => {
    const list = [...faculty];
    if (sortBy === 'default') {
      return list.sort((a, b) => {
        const soA = a.sort_order ?? a.sortOrder ?? 0;
        const soB = b.sort_order ?? b.sortOrder ?? 0;
        if (soB !== soA) return soB - soA;
        return String(a.name ?? '').localeCompare(String(b.name ?? ''));
      });
    }
    if (sortBy === 'experience') {
      return list.sort((a, b) => {
        const expA = parseExperienceYears(a.experience);
        const expB = parseExperienceYears(b.experience);
        if (expB !== expA) return expB - expA;
        return String(a.name ?? '').localeCompare(String(b.name ?? ''));
      });
    }
    if (sortBy === 'designation') {
      return list.sort((a, b) => {
        const rankA = getDesignationRank(a.designation);
        const rankB = getDesignationRank(b.designation);
        if (rankB !== rankA) return rankB - rankA;
        return String(a.name ?? '').localeCompare(String(b.name ?? ''));
      });
    }
    if (sortBy === 'designation-experience') {
      return list.sort((a, b) => {
        const rankA = getDesignationRank(a.designation);
        const rankB = getDesignationRank(b.designation);
        if (rankB !== rankA) return rankB - rankA;
        const expA = parseExperienceYears(a.experience);
        const expB = parseExperienceYears(b.experience);
        if (expB !== expA) return expB - expA;
        return String(a.name ?? '').localeCompare(String(b.name ?? ''));
      });
    }
    return list;
  }, [faculty, sortBy]);

  const baseDisplayList = sortBy === 'custom' ? customOrder : sortedFaculty;

  const displayList = useMemo(() => {
    if (!searchQuery.trim()) return baseDisplayList;
    const q = searchQuery.trim().toLowerCase();
    return baseDisplayList.filter(
      (f) =>
        (f.name || '').toLowerCase().includes(q) ||
        (f.designation || '').toLowerCase().includes(q) ||
        (f.qualification || '').toLowerCase().includes(q) ||
        (f.department || '').toLowerCase().includes(q) ||
        (f.email || '').toLowerCase().includes(q)
    );
  }, [baseDisplayList, searchQuery]);

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      designation: '',
      qualification: '',
      email: '',
      phone: '',
      experience: '',
    });
    setImageFile(null);
    setResumeFile(null);
    setPreview('');
    setDialogOpen(true);
  };

  const handleEdit = (item: Faculty) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      designation: item.designation,
      qualification: item.qualification,
      email: item.email || '',
      phone: item.phone || '',
      experience: item.experience || '',
    });
    setImageFile(null);
    setResumeFile(null);
    setPreview(item.image || '');
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

  const handleDelete = (item: Faculty) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl: string | null = null;
      let resumeUrl: string | null = null;
      if (imageFile) {
        toast.info('Uploading image…');
        imageUrl = await uploadToSupabase(imageFile, 'faculty', 'images');
      }
      if (resumeFile) {
        toast.info('Uploading resume…');
        resumeUrl = await uploadToSupabase(resumeFile, 'faculty', 'images');
      }
      const payload = {
        ...formData,
        image: imageUrl ?? (selectedItem?.image ?? null),
        resume: resumeUrl ?? (selectedItem?.resume ?? null),
      };
      if (selectedItem) {
        await facultyAPI.update(selectedItem.id, payload);
        toast.success('Faculty updated successfully');
      } else {
        await facultyAPI.create(payload);
        toast.success('Faculty added successfully');
      }
      setDialogOpen(false);
      fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save faculty');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await facultyAPI.delete(selectedItem.id);
      toast.success('Faculty deleted successfully');
      setDeleteDialogOpen(false);
      fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete faculty');
    }
  };

  const handleSaveCustomOrder = async () => {
    const list = sortBy === 'custom' ? customOrder : sortedFaculty;
    const baseSortOrder = 10000;
    const orderUpdates = list.map((item, idx) => ({
      id: item.id,
      sortOrder: baseSortOrder - idx,
    }));
    setSavingOrder(true);
    try {
      await facultyAPI.reorder(orderUpdates);
      toast.success('Custom order saved. Faculty page will show this order.');
      fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || sortBy !== 'custom') return;
    const list = [...customOrder];
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    setCustomOrder(list);
  };

  const handleMoveDown = (index: number) => {
    if (index === customOrder.length - 1 || sortBy !== 'custom') return;
    const list = [...customOrder];
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    setCustomOrder(list);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = customOrder.findIndex((f) => f.id === active.id);
    const newIndex = customOrder.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setCustomOrder(arrayMove(customOrder, oldIndex, newIndex));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty</h1>
        <p className="text-muted-foreground mt-2">Manage faculty members and their display order</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, designation, qualification, department, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by (applies to website Faculty page):</span>
            <Select value={sortBy} onValueChange={(v: 'custom' | 'experience' | 'designation' | 'designation-experience') => handleSortByChange(v)}>
              <SelectTrigger className="w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom order (drag to reorder)</SelectItem>
                <SelectItem value="experience">Experience (highest first)</SelectItem>
                <SelectItem value="designation">Designation (senior first)</SelectItem>
                <SelectItem value="designation-experience">Designation & Experience (senior first)</SelectItem>
              </SelectContent>
            </Select>
            {sortBy === 'custom' && (
              <Button
                variant="outline"
                onClick={handleSaveCustomOrder}
                disabled={savingOrder || displayList.length === 0}
              >
                {savingOrder ? 'Saving…' : 'Save order'}
              </Button>
            )}
          </div>
        </div>

        <div className="border rounded-lg">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No faculty members available
                    </TableCell>
                  </TableRow>
                ) : sortBy === 'custom' ? (
                  <SortableContext
                    items={displayList.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {displayList.map((item, index) => (
                      <SortableFacultyRow
                        key={item.id}
                        item={item}
                        index={index}
                        sortBy={sortBy}
                        canMoveUp={index > 0}
                        canMoveDown={index < displayList.length - 1}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                ) : (
                displayList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled
                            title="Switch to Custom order to reorder"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled
                            title="Switch to Custom order to reorder"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.designation}</TableCell>
                    <TableCell>{item.qualification}</TableCell>
                    <TableCell>{item.experience || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Faculty' : 'Add Faculty'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update faculty details' : 'Add a new faculty member'}
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
                    src={preview.startsWith('/') ? preview : `http://localhost:3001${preview}`}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full mt-2"
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
            </div>
            <p className="text-sm text-muted-foreground">
              To show this faculty on department pages, go to <strong>Admin → Department Pages</strong>, select a department, and check the faculty in the Faculty section.
            </p>
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
            <AlertDialogTitle>Delete Faculty</AlertDialogTitle>
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

export default Faculty;



