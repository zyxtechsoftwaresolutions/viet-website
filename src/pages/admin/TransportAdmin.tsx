import { useState, useEffect, useRef } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { pagesAPI, transportRoutesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { ExternalLink, ImagePlus, Trash2, Bus } from 'lucide-react';

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

const TransportAdmin = () => {
  const [pageId, setPageId] = useState<number | null>(null);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageForm, setPageForm] = useState({
    heroTitle: 'Transport',
    heroDescription: '',
    mainContent: '',
    mapEmbed: '',
    stats: [] as { value: string; label: string }[],
    features: [] as { title: string; description: string; icon: string; accent: string }[],
  });

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
  const [routeForm, setRouteForm] = useState({
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

  const loadAll = async () => {
    setLoading(true);
    try {
      const [page, routeData] = await Promise.all([
        pagesAPI.getBySlug('transport').catch(() => null),
        transportRoutesAPI.getAll().catch(() => []),
      ]);
      if (page?.id) {
        setPageId(page.id);
        const c = page.content || {};
        const hero = c.hero || {};
        setPageForm({
          heroTitle: hero.title || 'Transport',
          heroDescription: hero.description || '',
          mainContent: c.mainContent || '',
          mapEmbed: c.mapEmbed || '',
          stats: Array.isArray(c.stats) ? c.stats : [],
          features: Array.isArray(c.features) ? c.features : [],
        });
      }
      setRoutes(Array.isArray(routeData) ? routeData : []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load transport data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const savePage = async () => {
    setPageSaving(true);
    try {
      const existing = pageId ? await pagesAPI.getBySlug('transport').catch(() => null) : null;
      const prevContent = (existing?.content || {}) as Record<string, unknown>;
      const content = {
        ...prevContent,
        hero: {
          ...(typeof prevContent.hero === 'object' && prevContent.hero ? prevContent.hero : {}),
          title: pageForm.heroTitle,
          description: pageForm.heroDescription,
        },
        mainContent: pageForm.mainContent,
        mapEmbed: pageForm.mapEmbed || undefined,
        stats: pageForm.stats.filter((s) => s.value || s.label),
        features: pageForm.features.filter((f) => f.title || f.description),
      };
      const payload = {
        slug: 'transport',
        title: 'Transport',
        route: '/facilities/transport',
        category: 'Facilities',
        content,
      };
      if (pageId) {
        await pagesAPI.update(pageId, payload);
      } else {
        const created = await pagesAPI.create(payload);
        setPageId(created.id);
      }
      toast.success('Transport page content saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save page');
    } finally {
      setPageSaving(false);
    }
  };

  const addStat = () => setPageForm((p) => ({ ...p, stats: [...p.stats, { value: '', label: '' }] }));
  const updateStat = (i: number, field: 'value' | 'label', value: string) =>
    setPageForm((p) => ({ ...p, stats: p.stats.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)) }));
  const removeStat = (i: number) => setPageForm((p) => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }));

  const addFeature = () =>
    setPageForm((p) => ({
      ...p,
      features: [...p.features, { title: '', description: '', icon: 'shield', accent: 'indigo' }],
    }));
  const updateFeature = (i: number, field: 'title' | 'description' | 'icon', value: string) =>
    setPageForm((p) => ({
      ...p,
      features: p.features.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)),
    }));
  const removeFeature = (i: number) =>
    setPageForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));

  const openAddRoute = () => {
    setSelectedRoute(null);
    setRouteForm({
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
    setRouteDialogOpen(true);
  };

  const openEditRoute = (item: TransportRoute) => {
    setSelectedRoute(item);
    setRouteForm({
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
    const img = item.image;
    setImagePreview(img ? (img.startsWith('http') ? img : `${API_BASE}${img}`) : null);
    setRouteDialogOpen(true);
  };

  const saveRoute = async () => {
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadToSupabase(imageFile, 'transport-routes', 'images');
      }
      const payload = {
        ...routeForm,
        name: routeForm.name || 'Route',
        image: imageUrl ?? (selectedRoute?.image ?? null),
      };
      if (selectedRoute) {
        await transportRoutesAPI.update(selectedRoute.id, payload);
        toast.success('Route updated');
      } else {
        await transportRoutesAPI.create(payload);
        toast.success('Route added');
      }
      setRouteDialogOpen(false);
      const routeData = await transportRoutesAPI.getAll();
      setRoutes(Array.isArray(routeData) ? routeData : []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save route');
    }
  };

  const confirmDeleteRoute = async () => {
    if (!selectedRoute) return;
    try {
      await transportRoutesAPI.delete(selectedRoute.id);
      toast.success('Route deleted');
      setDeleteDialogOpen(false);
      const routeData = await transportRoutesAPI.getAll();
      setRoutes(Array.isArray(routeData) ? routeData : []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete route');
    }
  };

  const routeColumns = [
    {
      key: 'image',
      header: 'Image',
      render: (item: TransportRoute) =>
        item.image ? (
          <img
            src={item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`}
            alt=""
            className="h-12 w-16 rounded object-cover border"
          />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    { key: 'name', header: 'Route' },
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bus className="h-8 w-8" />
            Transport
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Manage the entire Transport page here — hero text, stats, features, map, and all bus routes in one place.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open('/facilities/transport', '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View public page
        </Button>
      </div>

      <Tabs defaultValue="page" className="space-y-4">
        <TabsList>
          <TabsTrigger value="page">Page content</TabsTrigger>
          <TabsTrigger value="routes">Bus routes ({routes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="page">
          <Card>
            <CardHeader>
              <CardTitle>Transport page content</CardTitle>
              <CardDescription>Hero, intro, stats, features, and map shown on /facilities/transport</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Hero title</Label>
                  <Input
                    value={pageForm.heroTitle}
                    onChange={(e) => setPageForm((p) => ({ ...p, heroTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Hero description</Label>
                  <Input
                    value={pageForm.heroDescription}
                    onChange={(e) => setPageForm((p) => ({ ...p, heroDescription: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Intro / main content (HTML)</Label>
                <Textarea
                  rows={6}
                  className="font-mono text-sm"
                  value={pageForm.mainContent}
                  onChange={(e) => setPageForm((p) => ({ ...p, mainContent: e.target.value }))}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Stats (e.g. 24+ Buses)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStat}>Add stat</Button>
                </div>
                {pageForm.stats.map((stat, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="24+" className="flex-1" />
                    <Input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Buses" className="flex-1" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Why transport features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>Add feature</Button>
                </div>
                {pageForm.features.map((f, i) => (
                  <div key={i} className="border rounded p-3 mb-2 space-y-2">
                    <div className="flex gap-2">
                      <Input value={f.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} placeholder="Title" />
                      <Input value={f.icon} onChange={(e) => updateFeature(i, 'icon', e.target.value)} placeholder="icon: shield, map, bus" className="w-40" />
                    </div>
                    <Textarea value={f.description} onChange={(e) => updateFeature(i, 'description', e.target.value)} rows={2} placeholder="Description" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)}>Remove</Button>
                  </div>
                ))}
              </div>
              <div>
                <Label>Google Maps embed (iframe HTML or URL)</Label>
                <Textarea
                  rows={3}
                  className="font-mono text-sm"
                  value={pageForm.mapEmbed}
                  onChange={(e) => setPageForm((p) => ({ ...p, mapEmbed: e.target.value }))}
                />
              </div>
              <Button onClick={savePage} disabled={pageSaving}>
                {pageSaving ? 'Saving…' : 'Save page content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <DataTable
            data={routes}
            columns={routeColumns}
            onAdd={openAddRoute}
            onEdit={openEditRoute}
            onDelete={(item) => { setSelectedRoute(item); setDeleteDialogOpen(true); }}
            addLabel="Add bus route"
            getId={(item) => item.id}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRoute ? 'Edit bus route' : 'Add bus route'}</DialogTitle>
            <DialogDescription>Shown as a card on the Transport page.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Route name</Label>
                <Input value={routeForm.name} onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })} placeholder="Route 1" />
              </div>
              <div className="space-y-2">
                <Label>Bus number</Label>
                <Input value={routeForm.busNo} onChange={(e) => setRouteForm({ ...routeForm, busNo: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>From</Label>
              <Input value={routeForm.from} onChange={(e) => setRouteForm({ ...routeForm, from: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input value={routeForm.to} onChange={(e) => setRouteForm({ ...routeForm, to: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver name</Label>
                <Input value={routeForm.driverName} onChange={(e) => setRouteForm({ ...routeForm, driverName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver contact</Label>
                <Input value={routeForm.driverContactNo} onChange={(e) => setRouteForm({ ...routeForm, driverContactNo: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stops</Label>
                <Input type="number" min={0} value={routeForm.stops || ''} onChange={(e) => setRouteForm({ ...routeForm, stops: parseInt(e.target.value, 10) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={routeForm.time} onChange={(e) => setRouteForm({ ...routeForm, time: e.target.value })} placeholder="25 min" />
              </div>
              <div className="space-y-2">
                <Label>Seats</Label>
                <Input type="number" min={0} value={routeForm.seatingCapacity || ''} onChange={(e) => setRouteForm({ ...routeForm, seatingCapacity: parseInt(e.target.value, 10) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Input value={routeForm.frequency} onChange={(e) => setRouteForm({ ...routeForm, frequency: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Route image (hover on card)</Label>
              <ImageUploadGuide {...IMAGE_SPECS.transportCard} />
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="" className="h-28 w-40 rounded-lg border object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white text-xs">×</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-28 w-40 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground hover:bg-muted">
                    <ImagePlus className="h-8 w-8" />
                    <span className="mt-1 text-xs">Add image</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRouteDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveRoute}>{selectedRoute ? 'Update route' : 'Add route'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete route</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{selectedRoute?.name}&quot; (Bus {selectedRoute?.busNo})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRoute} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransportAdmin;
