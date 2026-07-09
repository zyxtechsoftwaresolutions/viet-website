import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeroMediaFields, { type HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import { ParagraphsEditor } from '@/components/admin/facility/AdminFieldHelpers';
import { pagesAPI } from '@/lib/api';
import { saveFacilityPageContent } from '@/lib/facilityAdminSave';
import { DEFAULT_CAFETERIA_CONTENT, normalizeCafeteriaContent, type CafeteriaContent } from '@/lib/facilityContent/cafeteriaContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SLUG = 'cafeteria';
const ROUTE = '/facilities/cafeteria';

const CafeteriaAdmin = () => {
  const [content, setContent] = useState<CafeteriaContent>(DEFAULT_CAFETERIA_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaFormState>({
    image: '',
    video: '',
    imageFile: null,
    videoFile: null,
  });

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      const normalized = normalizeCafeteriaContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
    } catch {
      setContent(DEFAULT_CAFETERIA_CONTENT);
      toast.error('Could not load Cafeteria content — showing defaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveFacilityPageContent(SLUG, 'Cafeteria', ROUTE, content as unknown as Record<string, unknown>, heroMedia);
      toast.success('Cafeteria page saved');
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateGalleryItem = (index: number, patch: Partial<CafeteriaContent['gallery'][number]>) => {
    setContent((p) => ({
      ...p,
      gallery: p.gallery.map((item, j) => (j === index ? { ...item, ...patch } : item)),
    }));
  };

  return (
    <FacilityAdminLayout
      title="Cafeteria Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Badge</Label><Input value={content.hero.badge} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))} /></div>
              <div><Label>Title</Label><Input value={content.hero.title} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.hero.description} onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))} rows={3} /></div>
              <HeroMediaFields value={heroMedia} onChange={(patch) => setHeroMedia((prev) => ({ ...prev, ...patch }))} imageSpec={IMAGE_SPECS.facilityHero} />
              <ImageUploadGuide spec={IMAGE_SPECS.facilityHero} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle>About Cafeteria</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.about.label} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.about.title} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))} /></div>
              <ParagraphsEditor label="Paragraphs" paragraphs={content.about.paragraphs} onChange={(paragraphs) => setContent((p) => ({ ...p, about: { ...p.about, paragraphs } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Gallery
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, gallery: [...p.gallery, { image: '', title: '', caption: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.gallery.map((item, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Image {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, gallery: p.gallery.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={item.image} onChange={(e) => updateGalleryItem(i, { image: e.target.value })} placeholder="Image URL" />
                  <Input value={item.title} onChange={(e) => updateGalleryItem(i, { title: e.target.value })} placeholder="Title" />
                  <Input value={item.caption} onChange={(e) => updateGalleryItem(i, { caption: e.target.value })} placeholder="Caption" />
                  <div className="flex flex-wrap gap-6 pt-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`gallery-large-${i}`}
                        checked={!!item.large}
                        onCheckedChange={(checked) => updateGalleryItem(i, { large: checked === true })}
                      />
                      <Label htmlFor={`gallery-large-${i}`} className="font-normal cursor-pointer">Large</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`gallery-wide-${i}`}
                        checked={!!item.wide}
                        onCheckedChange={(checked) => updateGalleryItem(i, { wide: checked === true })}
                      />
                      <Label htmlFor={`gallery-wide-${i}`} className="font-normal cursor-pointer">Wide</Label>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cafeteria Features
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, features: [...p.features, { title: '', description: '', icon: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.features.map((feature, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Feature {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, features: p.features.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={feature.title} onChange={(e) => setContent((p) => ({ ...p, features: p.features.map((f, j) => (j === i ? { ...f, title: e.target.value } : f)) }))} placeholder="Title" />
                  <Textarea value={feature.description} onChange={(e) => setContent((p) => ({ ...p, features: p.features.map((f, j) => (j === i ? { ...f, description: e.target.value } : f)) }))} placeholder="Description" rows={2} />
                  <Textarea value={feature.icon} onChange={(e) => setContent((p) => ({ ...p, features: p.features.map((f, j) => (j === i ? { ...f, icon: e.target.value } : f)) }))} placeholder="SVG path (advanced)" rows={2} className="font-mono text-xs" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader><CardTitle>Contact Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.contact.label} onChange={(e) => setContent((p) => ({ ...p, contact: { ...p.contact, label: e.target.value } }))} /></div>
              <div><Label>Title</Label><Input value={content.contact.title} onChange={(e) => setContent((p) => ({ ...p, contact: { ...p.contact, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.contact.description} onChange={(e) => setContent((p) => ({ ...p, contact: { ...p.contact, description: e.target.value } }))} rows={3} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>CTA button text</Label><Input value={content.contact.ctaText} onChange={(e) => setContent((p) => ({ ...p, contact: { ...p.contact, ctaText: e.target.value } }))} /></div>
                <div><Label>CTA link</Label><Input value={content.contact.ctaHref} onChange={(e) => setContent((p) => ({ ...p, contact: { ...p.contact, ctaHref: e.target.value } }))} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default CafeteriaAdmin;
