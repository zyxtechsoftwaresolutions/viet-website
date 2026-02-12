import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { imgUrl } from '@/lib/imageUtils';

interface FacilityPage {
  id: number;
  slug: string;
  title: string;
  route: string;
  category: string;
  content: Record<string, unknown>;
}

const FacilitiesAdmin = () => {
  const [pages, setPages] = useState<FacilityPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<FacilityPage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    heroTitle: '',
    heroDescription: '',
    heroImage: '' as string,
    heroImageFile: null as File | null,
    mainContent: '',
    stats: [] as { value: string; label: string }[],
    features: [] as { title: string; description: string; icon: string; accent: string }[],
    gallery: [] as { url: string; alt: string }[],
    galleryFiles: [] as File[],
    mapEmbed: '',
  });

  const fetchPages = async () => {
    try {
      const data = await pagesAPI.getAll();
      const raw = Array.isArray(data) ? data : (data?.pages ?? data?.data ?? []);
      const list = (Array.isArray(raw) ? raw : []).filter(
        (p: any) => (p.category || '').toLowerCase() === 'facilities'
      );
      setPages(
        list.map((p: any) => ({
          id: p.id,
          slug: p.slug || '',
          title: p.title || '',
          route: p.route || `/facilities/${p.slug || ''}`,
          category: p.category || 'Facilities',
          content: p.content || {},
        }))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch facilities');
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openAdd = () => {
    setIsNew(true);
    setSelectedPage(null);
    setFormData({
      slug: '',
      title: '',
      heroTitle: '',
      heroDescription: '',
      heroImage: '',
      heroImageFile: null,
      mainContent: '',
      stats: [],
      features: [],
      gallery: [],
      galleryFiles: [],
      mapEmbed: '',
    });
    setDialogOpen(true);
  };

  const openEdit = (page: FacilityPage) => {
    setIsNew(false);
    setSelectedPage(page);
    const c = (page.content || {}) as any;
    const hero = c.hero || {};
    setFormData({
      slug: page.slug,
      title: page.title,
      heroTitle: hero.title || '',
      heroDescription: hero.description || '',
      heroImage: hero.heroImage || c.heroImage || '',
      heroImageFile: null,
      mainContent: c.mainContent || '',
      stats: Array.isArray(c.stats) ? c.stats : [],
      features: Array.isArray(c.features) ? c.features : [],
      gallery: Array.isArray(c.gallery) ? c.gallery : [],
      galleryFiles: [],
      mapEmbed: c.mapEmbed || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.slug.trim() || !formData.title.trim()) {
      toast.error('Slug and title are required');
      return;
    }
    const slug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-');
    const route = `/facilities/${slug}`;

    setSaving(true);
    try {
      let heroImageUrl = formData.heroImage;
      if (formData.heroImageFile) {
        heroImageUrl = await uploadToSupabase(formData.heroImageFile, 'facilities', 'images');
      }

      const galleryUrls = [...formData.gallery];
      for (const file of formData.galleryFiles) {
        const url = await uploadToSupabase(file, 'facilities', 'gallery');
        galleryUrls.push({ url, alt: file.name });
      }

      const content: Record<string, unknown> = {
        hero: {
          title: formData.heroTitle || formData.title,
          description: formData.heroDescription,
          heroImage: heroImageUrl || undefined,
        },
        mainContent: formData.mainContent,
        stats: formData.stats.filter((s) => s.value || s.label),
        features: formData.features.filter((f) => f.title || f.description),
        gallery: galleryUrls,
        mapEmbed: formData.mapEmbed || undefined,
      };
      // Preserve existing fields we don't edit (e.g. tables, additional for transport)
      if (!isNew && selectedPage?.content && typeof selectedPage.content === 'object') {
        const existing = selectedPage.content as Record<string, unknown>;
        for (const k of Object.keys(existing)) {
          if (!Object.prototype.hasOwnProperty.call(content, k)) {
            content[k] = existing[k];
          }
        }
      }

      if (isNew) {
        await pagesAPI.create({
          slug,
          title: formData.title.trim(),
          route,
          category: 'Facilities',
          content,
        });
        toast.success('Facility page created. Add it to the Facilities menu in the header if needed.');
      } else if (selectedPage) {
        await pagesAPI.update(selectedPage.id, {
          slug,
          title: formData.title.trim(),
          route,
          category: 'Facilities',
          content,
        });
        toast.success('Facility page updated');
      }
      setDialogOpen(false);
      fetchPages();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (page: FacilityPage) => {
    setSelectedPage(page);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPage) return;
    try {
      await pagesAPI.delete(selectedPage.id);
      toast.success('Facility page deleted');
      setDeleteDialogOpen(false);
      fetchPages();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }],
    }));
  };

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const removeStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', icon: 'star', accent: 'blue' }],
    }));
  };

  const updateFeature = (
    index: number,
    field: 'title' | 'description' | 'icon' | 'accent',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        galleryFiles: [...prev.galleryFiles, ...Array.from(files)],
      }));
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index: number, isFile: boolean) => {
    if (isFile) {
      setFormData((prev) => ({
        ...prev,
        galleryFiles: prev.galleryFiles.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      }));
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
      <div>
        <h1 className="text-3xl font-bold">Facilities</h1>
        <p className="text-muted-foreground mt-2">
          Manage facility pages (Library, Transport, Hostel, Sports, etc.) shown in the Facilities menu.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Facility Page
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5" />
                {page.title}
              </CardTitle>
              <CardDescription>
                /facilities/{page.slug}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(page)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/facilities/${page.slug}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(page)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {(page.content as any)?.hero?.heroImage && (
                <img
                  src={imgUrl((page.content as any).hero.heroImage)}
                  alt={page.title}
                  className="w-full h-24 object-cover rounded"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No facility pages yet. Click &quot;Add Facility Page&quot; to create Library, Transport, Hostel, etc.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Facility Page' : 'Edit Facility Page'}</DialogTitle>
            <DialogDescription>
              {isNew
                ? 'Create a new facility page. Slug will be used in the URL: /facilities/slug'
                : 'Update facility page content, images, and sections.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Slug (URL part)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    }))
                  }
                  placeholder="e.g. library, transport"
                  disabled={!isNew}
                />
                {!isNew && (
                  <p className="text-xs text-muted-foreground mt-1">Slug cannot be changed after creation</p>
                )}
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Library, Transport"
                />
              </div>
            </div>

            <div>
              <Label>Hero Section</Label>
              <div className="space-y-3 mt-2">
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Hero title"
                />
                <Input
                  value={formData.heroDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroDescription: e.target.value }))}
                  placeholder="Hero description"
                />
                <div>
                  <Label className="text-sm">Hero image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFormData((prev) => ({ ...prev, heroImageFile: f }));
                    }}
                  />
                  {formData.heroImage && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={imgUrl(formData.heroImage)}
                        alt="Hero"
                        className="h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, heroImage: '', heroImageFile: null }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>Main content (HTML)</Label>
              <Textarea
                value={formData.mainContent}
                onChange={(e) => setFormData((prev) => ({ ...prev, mainContent: e.target.value }))}
                placeholder="<p>Description...</p>"
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Stats</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStat}>
                  Add stat
                </Button>
              </div>
              {formData.stats.map((stat, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                    placeholder="Value (e.g. 24+)"
                    className="flex-1"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                    placeholder="Label (e.g. Buses)"
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeStat(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  Add feature
                </Button>
              </div>
              {formData.features.map((f, i) => (
                <div key={i} className="border p-3 rounded mb-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={f.title}
                      onChange={(e) => updateFeature(i, 'title', e.target.value)}
                      placeholder="Title"
                    />
                    <Input
                      value={f.icon}
                      onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                      placeholder="Icon name"
                    />
                  </div>
                  <Textarea
                    value={f.description}
                    onChange={(e) => updateFeature(i, 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label>Gallery images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={addGalleryImages}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.gallery.map((img, i) => (
                  <div key={`g-${i}`} className="relative">
                    <img src={imgUrl(img.url)} alt={img.alt} className="h-20 w-20 object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 h-6 w-6 p-0"
                      onClick={() => removeGalleryImage(i, false)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {formData.galleryFiles.map((f, i) => (
                  <div key={`f-${i}`} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 h-6 w-6 p-0"
                      onClick={() => removeGalleryImage(i, true)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Map embed (optional, for Transport)</Label>
              <Textarea
                value={formData.mapEmbed}
                onChange={(e) => setFormData((prev) => ({ ...prev, mapEmbed: e.target.value }))}
                placeholder="<iframe src=...></iframe>"
                rows={3}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : isNew ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Facility Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedPage?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FacilitiesAdmin;
