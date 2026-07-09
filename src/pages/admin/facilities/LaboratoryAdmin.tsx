import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeroMediaFields, { type HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import { StatPairsEditor, StringListEditor } from '@/components/admin/facility/AdminFieldHelpers';
import { pagesAPI } from '@/lib/api';
import { saveFacilityPageContent } from '@/lib/facilityAdminSave';
import { DEFAULT_LABORATORY_CONTENT, normalizeLaboratoryContent, type LaboratoryContent } from '@/lib/facilityContent/laboratoryContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SLUG = 'laboratory';
const ROUTE = '/facilities/laboratory';

const LaboratoryAdmin = () => {
  const [content, setContent] = useState<LaboratoryContent>(DEFAULT_LABORATORY_CONTENT);
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
      const normalized = normalizeLaboratoryContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
    } catch {
      setContent(DEFAULT_LABORATORY_CONTENT);
      toast.error('Could not load Laboratory content — showing defaults.');
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
      await saveFacilityPageContent(SLUG, 'Laboratories', ROUTE, content as unknown as Record<string, unknown>, heroMedia);
      toast.success('Laboratory page saved');
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FacilityAdminLayout
      title="Laboratory Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="resources">Resources Stats</TabsTrigger>
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
            <CardHeader><CardTitle>About Laboratories</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.about.label} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.about.title} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))} /></div>
              <div><Label>Paragraph</Label><Textarea value={content.about.paragraph} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, paragraph: e.target.value } }))} rows={6} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Labs
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, labs: [...p.labs, { id: '', name: '', image: '', description: '', features: [''], hours: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add lab
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.labs.map((lab, i) => (
                <div key={i} className="grid gap-3 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Lab {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, labs: p.labs.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    <div><Label>ID (slug)</Label><Input value={lab.id} onChange={(e) => setContent((p) => ({ ...p, labs: p.labs.map((l, j) => (j === i ? { ...l, id: e.target.value } : l)) }))} placeholder="e.g. dbms" /></div>
                    <div><Label>Name</Label><Input value={lab.name} onChange={(e) => setContent((p) => ({ ...p, labs: p.labs.map((l, j) => (j === i ? { ...l, name: e.target.value } : l)) }))} placeholder="Lab name" /></div>
                  </div>
                  <div><Label>Image URL</Label><Input value={lab.image} onChange={(e) => setContent((p) => ({ ...p, labs: p.labs.map((l, j) => (j === i ? { ...l, image: e.target.value } : l)) }))} placeholder="https://..." /></div>
                  <div><Label>Description</Label><Textarea value={lab.description} onChange={(e) => setContent((p) => ({ ...p, labs: p.labs.map((l, j) => (j === i ? { ...l, description: e.target.value } : l)) }))} rows={3} /></div>
                  <StringListEditor label="Features" items={lab.features} onChange={(features) => setContent((p) => ({ ...p, labs: p.labs.map((l, j) => (j === i ? { ...l, features } : l)) }))} />
                  <div><Label>Hours</Label><Input value={lab.hours} onChange={(e) => setContent((p) => ({ ...p, labs: p.labs.map((l, j) => (j === i ? { ...l, hours: e.target.value } : l)) }))} placeholder="Mon–Sat: 9AM – 4PM" /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader><CardTitle>Resources Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.resources.label} onChange={(e) => setContent((p) => ({ ...p, resources: { ...p.resources, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.resources.title} onChange={(e) => setContent((p) => ({ ...p, resources: { ...p.resources, title: e.target.value } }))} /></div>
              <StatPairsEditor label="Stats" stats={content.resources.stats} onChange={(stats) => setContent((p) => ({ ...p, resources: { ...p.resources, stats } }))} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default LaboratoryAdmin;
