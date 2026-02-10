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
import { Switch } from '@/components/ui/switch';
import { tickerAPI } from '@/lib/api';
import { toast } from 'sonner';
import { ScrollText, Edit, Trash2, Plus } from 'lucide-react';

interface TickerItem {
  id: number;
  text: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const Ticker = () => {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TickerItem | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    isActive: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await tickerAPI.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching scrolling text items:', error);
      setItems([]);
      if (!error.message?.includes('404') && !error.message?.includes('not found')) {
        toast.error(error.message || 'Failed to fetch scrolling text items');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      text: '',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: TickerItem) => {
    setSelectedItem(item);
    setFormData({
      text: item.text,
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: TickerItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.text.trim()) {
      toast.error('Please enter scrolling text');
      return;
    }
    try {
      if (selectedItem) {
        await tickerAPI.update(selectedItem.id, formData);
        toast.success('Ticker item updated successfully');
      } else {
        await tickerAPI.create(formData);
        toast.success('Scrolling text item created successfully');
      }
      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save scrolling text item');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await tickerAPI.delete(selectedItem.id);
      toast.success('Scrolling text item deleted successfully');
      setDeleteDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete scrolling text item');
    }
  };

  const columns = [
    {
      key: 'text',
      header: 'Text',
      render: (item: TickerItem) => (
        <span className="line-clamp-2 max-w-2xl">{item.text}</span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: TickerItem) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (item: TickerItem) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : 'N/A',
    },
  ];

  if (loading) return <div className="py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ScrollText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">SCROLLING TEXT Management</h1>
      </div>
      <p className="text-muted-foreground">
        Manage scrolling text displayed at the top of the website. Only active items will be shown.
      </p>

      <DataTable
        data={items}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Scrolling Text Item"
        getId={(item) => item.id}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Scrolling Text Item' : 'Add Scrolling Text Item'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? 'Update scrolling text and status'
                : 'Create a new scrolling text item to display on the website'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticker-text">Scrolling Text</Label>
              <Input
                id="ticker-text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Enter text to display in the scrolling text"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {formData.text.length}/500 characters
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="ticker-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Only active items will be displayed in the scrolling text
                </p>
              </div>
              <Switch
                id="ticker-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
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
            <AlertDialogTitle>Delete Scrolling Text Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scrolling text item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Ticker;
