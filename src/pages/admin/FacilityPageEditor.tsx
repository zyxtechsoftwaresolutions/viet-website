import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase, uploadVideoToSupabase } from '@/lib/storage';
import HeroMediaFields from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { toast } from 'sonner';
import { ArrowLeft, ExternalLink, Plus, Save, Trash2 } from 'lucide-react';
import { imgUrl } from '@/lib/imageUtils';
import { getFacilityBySlug } from '@/lib/facilityPagesRegistry';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';

type FacilityPageEditorProps = {
  slug: string;
};

const FacilityPageEditor = ({ slug }: FacilityPageEditorProps) => {
  const navigate = useNavigate();
  const facilityDef = getFacilityBySlug(slug);
  const [pageId, setPageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    heroTitle: '',
    heroDescription: '',
    heroImage: '' as string,
    heroImageFile: null as File | null,
    heroVideo: '' as string,
    heroVideoFile: null as File | null,
    mainContent: '',
    stats: [] as { value: string; label: string }[],
    features: [] as { title: string; description: string; icon: string; accent: string }[],
    gallery: [] as { url: string; alt: string }[],
    galleryFiles: [] as File[],
    mapEmbed: '',
  });

  const fetchPage = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(slug);
      if (page?.id) {
        setPageId(page.id);
        const c = (page.content || {}) as Record<string, unknown>;
        const hero = (c.hero || {}) as Record<string, string>;
        setFormData({
          title: page.title || facilityDef?.title || '',
          heroTitle: hero.title || '',
          heroDescription: hero.description || '',
          heroImage: hero.heroImage || (c.heroImage as string) || '',
          heroImageFile: null,
          heroVideo: hero.video || '',
          heroVideoFile: null,
          mainContent: (c.mainContent as string) || '',
          stats: Array.isArray(c.stats) ? (c.stats as { value: string; label: string }[]) : [],
          features: Array.isArray(c.features)
            ? (c.features as { title: string; description: string; icon: string; accent: string }[])
            : [],
          gallery: Array.isArray(c.gallery) ? (c.gallery as { url: string; alt: string }[]) : [],
          galleryFiles: [],
          mapEmbed: (c.mapEmbed as string) || '',
        });
      } else {
        setPageId(null);
        setFormData((prev) => ({
          ...prev,
          title: facilityDef?.title || slug,
          heroTitle: facilityDef?.title || slug,
          heroDescription: facilityDef?.description || '',
        }));
        toast.info('Page not in database yet — saving will create it.');
      }
    } catch {
      setPageId(null);
      setFormData((prev) => ({
        ...prev,
        title: facilityDef?.title || slug,
        heroTitle: facilityDef?.title || slug,
        heroDescription: facilityDef?.description || '',
      }));
      toast.error('Could not load page content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    const route = facilityDef?.route || `/facilities/${slug}`;
    setSaving(true);
    try {
      let heroImageUrl = formData.heroImage;
      if (formData.heroImageFile) {
        toast.info('Uploading hero image…');
        heroImageUrl = await uploadToSupabase(formData.heroImageFile, 'facilities', 'images');
      }

      let heroVideoUrl = formData.heroVideo.trim();
      if (formData.heroVideoFile) {
        toast.info('Uploading hero video…');
        heroVideoUrl = await uploadVideoToSupabase(formData.heroVideoFile, 'facilities');
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
          video: heroVideoUrl || undefined,
        },
        mainContent: formData.mainContent,
        stats: formData.stats.filter((s) => s.value || s.label),
        features: formData.features.filter((f) => f.title || f.description),
        gallery: galleryUrls,
        mapEmbed: formData.mapEmbed || undefined,
      };

      const saved = await pagesAPI.saveBySlug(slug, {
        title: formData.title.trim(),
        route,
        category: 'Facilities',
        content,
      });
      setPageId(saved?.id ?? pageId);
      toast.success(pageId || saved?.id ? 'Facility page updated' : 'Facility page created');
      setFormData((prev) => ({
        ...prev,
        galleryFiles: [],
        heroImageFile: null,
        heroVideoFile: null,
      }));
      fetchPage();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setFormData((prev) => ({ ...prev, stats: [...prev.stats, { value: '', label: '' }] }));
  };

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const removeStat = (index: number) => {
    setFormData((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
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
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
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

  const publicRoute = facilityDef?.route || `/facilities/${slug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/facilities')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{formData.title || facilityDef?.title}</h1>
            <p className="text-muted-foreground text-sm">{publicRoute}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(publicRoute, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-1" />
            View Page
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Saving…' : 'Save All Sections'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="content">Main Content</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Title, description, and hero background (image or video).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Library"
                />
              </div>
              <div>
                <Label>Hero Title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Hero heading"
                />
              </div>
              <div>
                <Label>Hero Description</Label>
                <Textarea
                  value={formData.heroDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroDescription: e.target.value }))}
                  placeholder="Short description under the hero title"
                  rows={3}
                />
              </div>
              <HeroMediaFields
                value={{
                  image: formData.heroImage,
                  video: formData.heroVideo,
                  imageFile: formData.heroImageFile,
                  videoFile: formData.heroVideoFile,
                }}
                onChange={(patch) =>
                  setFormData((prev) => ({
                    ...prev,
                    heroImage: patch.image ?? prev.heroImage,
                    heroVideo: patch.video ?? prev.heroVideo,
                    heroImageFile: patch.imageFile !== undefined ? patch.imageFile : prev.heroImageFile,
                    heroVideoFile: patch.videoFile !== undefined ? patch.videoFile : prev.heroVideoFile,
                  }))
                }
                imageSpec={IMAGE_SPECS.facilityHero}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
              <CardDescription>Primary text section. HTML is supported for formatting.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.mainContent}
                onChange={(e) => setFormData((prev) => ({ ...prev, mainContent: e.target.value }))}
                placeholder="<p>Description...</p>"
                rows={12}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stats</CardTitle>
                <CardDescription>Number highlights (e.g. 24+ Buses).</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStat}>
                <Plus className="h-4 w-4 mr-1" />
                Add Stat
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.stats.length === 0 && (
                <p className="text-sm text-muted-foreground">No stats yet. Click Add Stat to create one.</p>
              )}
              {formData.stats.map((stat, i) => (
                <div key={i} className="flex gap-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Features</CardTitle>
                <CardDescription>Highlight cards with title, description, and icon.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.length === 0 && (
                <p className="text-sm text-muted-foreground">No features yet. Click Add Feature to create one.</p>
              )}
              {formData.features.map((f, i) => (
                <div key={i} className="border p-4 rounded-lg space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={f.title}
                      onChange={(e) => updateFeature(i, 'title', e.target.value)}
                      placeholder="Title"
                      className="flex-1"
                    />
                    <Input
                      value={f.icon}
                      onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                      placeholder="Icon (shield, map, star)"
                      className="w-40"
                    />
                  </div>
                  <Textarea
                    value={f.description}
                    onChange={(e) => updateFeature(i, 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Photo gallery section for this facility page.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addGalleryImages}
                  className="max-w-xs"
                />
                <ImageUploadGuide {...IMAGE_SPECS.facilityGallery} inline />
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {formData.gallery.map((img, i) => (
                  <div key={`g-${i}`} className="relative">
                    <img src={imgUrl(img.url)} alt={img.alt} className="h-24 w-24 object-cover rounded" />
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
                      className="h-24 w-24 object-cover rounded"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Map Embed</CardTitle>
              <CardDescription>Optional map iframe (useful for Transport or location-based facilities).</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.mapEmbed}
                onChange={(e) => setFormData((prev) => ({ ...prev, mapEmbed: e.target.value }))}
                placeholder="<iframe src=...></iframe>"
                rows={5}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityPageEditor;
