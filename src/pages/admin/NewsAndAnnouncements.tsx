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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { newsAPI, announcementsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Newspaper, Bell } from 'lucide-react';

interface News {
  id: number;
  title: string;
  description: string;
  date: string;
  link?: string;
}

interface Announcement {
  id: number;
  title: string;
  date: string;
  type: 'result' | 'notification' | 'study';
  link: string;
  isExternal?: boolean;
}

const NewsTab = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    link: '',
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await newsAPI.getAll();
      setNews(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      link: '',
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: News) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      link: item.link || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: News) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedItem) {
        await newsAPI.update(selectedItem.id, formData);
        toast.success('News updated successfully');
      } else {
        await newsAPI.create(formData);
        toast.success('News created successfully');
      }
      setDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save news');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await newsAPI.delete(selectedItem.id);
      toast.success('News deleted successfully');
      setDeleteDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete news');
    }
  };

  const columns = [
    { key: 'title', header: 'Title' },
    {
      key: 'description',
      header: 'Description',
      render: (item: News) => (
        <span className="line-clamp-2 max-w-md">{item.description}</span>
      ),
    },
    { key: 'date', header: 'Date' },
  ];

  if (loading) return <div className="py-8">Loading...</div>;

  return (
    <div className="space-y-6">
        <DataTable
        data={news}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add News"
        getId={(item) => item.id}
        headerClassName="bg-emerald-200 [&>th]:bg-emerald-200"
        bodyClassName="bg-emerald-100"
        bodyRowClassName="hover:bg-emerald-200/80 [&:hover>td]:bg-emerald-200/80"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit News' : 'Add News'}</DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update news details' : 'Create a new news article'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Title</Label>
              <Input
                id="news-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter news title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-description">Description</Label>
              <Textarea
                id="news-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter news description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="news-date">Date</Label>
                <Input
                  id="news-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-link">Link (Optional)</Label>
                <Input
                  id="news-link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="Enter link URL"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{selectedItem ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete News</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedItem?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const AnnouncementsTab = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'notification' as 'result' | 'notification' | 'study',
    link: '',
    isExternal: false,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementsAPI.getAll();
      setAnnouncements(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'notification',
      link: '',
      isExternal: false,
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: Announcement) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      date: item.date,
      type: item.type,
      link: item.link,
      isExternal: item.isExternal || false,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: Announcement) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedItem) {
        await announcementsAPI.update(selectedItem.id, formData);
        toast.success('Announcement updated successfully');
      } else {
        await announcementsAPI.create(formData);
        toast.success('Announcement created successfully');
      }
      setDialogOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save announcement');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await announcementsAPI.delete(selectedItem.id);
      toast.success('Announcement deleted successfully');
      setDeleteDialogOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  const columns = [
    { key: 'title', header: 'Title' },
    {
      key: 'type',
      header: 'Type',
      render: (item: Announcement) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.type === 'result' ? 'bg-green-100 text-green-700' :
            item.type === 'notification' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}
        >
          {item.type}
        </span>
      ),
    },
    { key: 'date', header: 'Date' },
    { key: 'link', header: 'Link' },
  ];

  if (loading) return <div className="py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <DataTable
        data={announcements}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Announcement"
        getId={(item) => item.id}
        headerClassName="bg-sky-200 [&>th]:bg-sky-200"
        bodyClassName="bg-sky-100"
        bodyRowClassName="hover:bg-sky-200/80 [&:hover>td]:bg-sky-200/80"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Update announcement details' : 'Create a new announcement'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ann-date">Date</Label>
                <Input
                  id="ann-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'result' | 'notification' | 'study') => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="result">Result</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="study">Study Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-link">Link</Label>
              <Input
                id="ann-link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="Enter link URL"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ann-isExternal"
                checked={formData.isExternal}
                onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="ann-isExternal">External Link</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{selectedItem ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedItem?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const NewsAndAnnouncements = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">News &amp; Announcements</h1>
        <p className="text-muted-foreground mt-2">Manage news articles and announcements. Use the tabs below to add, edit, or delete entries in each table.</p>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="mt-6">
          <NewsTab />
        </TabsContent>
        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsAndAnnouncements;
