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
import { ParagraphsEditor, StatPairsEditor, StringListEditor } from '@/components/admin/facility/AdminFieldHelpers';
import { pagesAPI } from '@/lib/api';
import { saveFacilityPageContent } from '@/lib/facilityAdminSave';
import { DEFAULT_NSS_CONTENT, normalizeNssContent, type NssContent } from '@/lib/facilityContent/nssContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SLUG = 'nss';
const ROUTE = '/facilities/nss';

const NssAdmin = () => {
  const [content, setContent] = useState<NssContent>(DEFAULT_NSS_CONTENT);
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
      const normalized = normalizeNssContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
    } catch {
      setContent(DEFAULT_NSS_CONTENT);
      toast.error('Could not load NSS content — showing defaults.');
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
      await saveFacilityPageContent(SLUG, 'NSS', ROUTE, content as unknown as Record<string, unknown>, heroMedia);
      toast.success('NSS page saved');
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateIconList = (
    key: 'objectives' | 'activities',
    index: number,
    field: 'title' | 'icon',
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <FacilityAdminLayout
      title="NSS Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="activities">What We Do</TabsTrigger>
          <TabsTrigger value="camp">Annual Special Camp</TabsTrigger>
          <TabsTrigger value="involved">Get Involved</TabsTrigger>
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
            <CardHeader><CardTitle>About NSS</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.about.label} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.about.title} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))} /></div>
              <ParagraphsEditor label="Paragraphs" paragraphs={content.about.paragraphs} onChange={(paragraphs) => setContent((p) => ({ ...p, about: { ...p.about, paragraphs } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle>Stat Cards (About section)</CardTitle></CardHeader>
            <CardContent>
              <StatPairsEditor label="Stats" stats={content.stats} onChange={(stats) => setContent((p) => ({ ...p, stats }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                NSS Objectives
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, objectives: [...p.objectives, { title: '', icon: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.objectives.map((obj, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Objective {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, objectives: p.objectives.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={obj.title} onChange={(e) => updateIconList('objectives', i, 'title', e.target.value)} placeholder="Title" />
                  <Textarea value={obj.icon} onChange={(e) => updateIconList('objectives', i, 'icon', e.target.value)} placeholder="SVG path (advanced)" rows={2} className="font-mono text-xs" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Key Activities (What We Do)
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, activities: [...p.activities, { title: '', icon: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.activities.map((act, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Activity {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, activities: p.activities.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={act.title} onChange={(e) => updateIconList('activities', i, 'title', e.target.value)} placeholder="Title" />
                  <Textarea value={act.icon} onChange={(e) => updateIconList('activities', i, 'icon', e.target.value)} placeholder="SVG path (advanced)" rows={2} className="font-mono text-xs" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camp">
          <Card>
            <CardHeader><CardTitle>Annual Special Camp</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={content.specialCamp.title} onChange={(e) => setContent((p) => ({ ...p, specialCamp: { ...p.specialCamp, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.specialCamp.description} onChange={(e) => setContent((p) => ({ ...p, specialCamp: { ...p.specialCamp, description: e.target.value } }))} rows={4} /></div>
              <StatPairsEditor label="Camp stats" stats={content.specialCamp.stats} onChange={(stats) => setContent((p) => ({ ...p, specialCamp: { ...p.specialCamp, stats } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="involved">
          <Card>
            <CardHeader><CardTitle>Get Involved</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.getInvolved.label} onChange={(e) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, label: e.target.value } }))} /></div>
              <div><Label>Title</Label><Input value={content.getInvolved.title} onChange={(e) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.getInvolved.description} onChange={(e) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, description: e.target.value } }))} rows={3} /></div>
              <StringListEditor label="Eligibility" items={content.getInvolved.eligibility} onChange={(eligibility) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, eligibility } }))} />
              <StringListEditor label="Benefits" items={content.getInvolved.benefits} onChange={(benefits) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, benefits } }))} />
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>CTA button text</Label><Input value={content.getInvolved.ctaText} onChange={(e) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, ctaText: e.target.value } }))} /></div>
                <div><Label>CTA link</Label><Input value={content.getInvolved.ctaHref} onChange={(e) => setContent((p) => ({ ...p, getInvolved: { ...p.getInvolved, ctaHref: e.target.value } }))} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader><CardTitle>Contact Section</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {content.contact.columns.map((col, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Column {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.filter((_, j) => j !== i) } }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={col.title} onChange={(e) => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)) } }))} placeholder="Title" />
                  <StringListEditor label="Lines" items={col.lines} onChange={(lines) => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.map((c, j) => (j === i ? { ...c, lines } : c)) } }))} />
                  <Input value={col.email || ''} onChange={(e) => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.map((c, j) => (j === i ? { ...c, email: e.target.value } : c)) } }))} placeholder="Email (optional)" />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setContent((p) => ({ ...p, contact: { columns: [...p.contact.columns, { title: '', lines: [''] }] } }))}>
                <Plus className="h-4 w-4 mr-1" /> Add column
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default NssAdmin;
