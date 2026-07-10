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
import { DEFAULT_HOSTEL_CONTENT, normalizeHostelContent, type HostelContent } from '@/lib/facilityContent/hostelContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SLUG = 'hostel';
const ROUTE = '/facilities/hostel';

const HostelAdmin = () => {
  const [content, setContent] = useState<HostelContent>(DEFAULT_HOSTEL_CONTENT);
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
      const normalized = normalizeHostelContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
    } catch {
      setContent(DEFAULT_HOSTEL_CONTENT);
      toast.error('Could not load Hostel content — showing defaults.');
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
      await saveFacilityPageContent(SLUG, 'Hostel', ROUTE, content as unknown as Record<string, unknown>, heroMedia);
      toast.success('Hostel page saved');
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateHostelBlock = (key: 'boysHostel' | 'girlsHostel', field: 'title' | 'description', value: string) => {
    setContent((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const updateFacilityIcon = (index: number, field: 'title' | 'icon', value: string) => {
    setContent((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f, j) => (j === index ? { ...f, [field]: value } : f)),
    }));
  };

  return (
    <FacilityAdminLayout
      title="Hostel Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="intro">Intro</TabsTrigger>
          <TabsTrigger value="boys">Boys Hostel</TabsTrigger>
          <TabsTrigger value="girls">Girls Hostel</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="community">Community & Rules</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
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

        <TabsContent value="intro">
          <Card>
            <CardHeader><CardTitle>Intro Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.intro.label} onChange={(e) => setContent((p) => ({ ...p, intro: { ...p.intro, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.intro.title} onChange={(e) => setContent((p) => ({ ...p, intro: { ...p.intro, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.intro.description} onChange={(e) => setContent((p) => ({ ...p, intro: { ...p.intro, description: e.target.value } }))} rows={4} /></div>
              <StatPairsEditor label="Stats" stats={content.intro.stats} onChange={(stats) => setContent((p) => ({ ...p, intro: { ...p.intro, stats } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boys">
          <Card>
            <CardHeader><CardTitle>Boys Hostel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={content.boysHostel.title} onChange={(e) => updateHostelBlock('boysHostel', 'title', e.target.value)} /></div>
              <div><Label>Description</Label><Textarea value={content.boysHostel.description} onChange={(e) => updateHostelBlock('boysHostel', 'description', e.target.value)} rows={4} /></div>
              <StringListEditor label="Features" items={content.boysHostel.features} onChange={(features) => setContent((p) => ({ ...p, boysHostel: { ...p.boysHostel, features } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="girls">
          <Card>
            <CardHeader><CardTitle>Girls Hostel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={content.girlsHostel.title} onChange={(e) => updateHostelBlock('girlsHostel', 'title', e.target.value)} /></div>
              <div><Label>Description</Label><Textarea value={content.girlsHostel.description} onChange={(e) => updateHostelBlock('girlsHostel', 'description', e.target.value)} rows={4} /></div>
              <StringListEditor label="Features" items={content.girlsHostel.features} onChange={(features) => setContent((p) => ({ ...p, girlsHostel: { ...p.girlsHostel, features } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hostel Facilities
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, facilities: [...p.facilities, { title: '', icon: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.facilities.map((item, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Facility {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, facilities: p.facilities.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={item.title} onChange={(e) => updateFacilityIcon(i, 'title', e.target.value)} placeholder="Title" />
                  <Textarea value={item.icon} onChange={(e) => updateFacilityIcon(i, 'icon', e.target.value)} placeholder="SVG path (advanced)" rows={2} className="font-mono text-xs" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Room Types
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, rooms: [...p.rooms, { type: '', capacity: '', amenities: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.rooms.map((room, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Room {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, rooms: p.rooms.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={room.type} onChange={(e) => setContent((p) => ({ ...p, rooms: p.rooms.map((r, j) => (j === i ? { ...r, type: e.target.value } : r)) }))} placeholder="Type" />
                  <Input value={room.capacity} onChange={(e) => setContent((p) => ({ ...p, rooms: p.rooms.map((r, j) => (j === i ? { ...r, capacity: e.target.value } : r)) }))} placeholder="Capacity" />
                  <Input value={room.amenities} onChange={(e) => setContent((p) => ({ ...p, rooms: p.rooms.map((r, j) => (j === i ? { ...r, amenities: e.target.value } : r)) }))} placeholder="Amenities" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader><CardTitle>Community</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.community.label} onChange={(e) => setContent((p) => ({ ...p, community: { ...p.community, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.community.title} onChange={(e) => setContent((p) => ({ ...p, community: { ...p.community, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.community.description} onChange={(e) => setContent((p) => ({ ...p, community: { ...p.community, description: e.target.value } }))} rows={3} /></div>
              <StringListEditor label="Community items" items={content.community.items} onChange={(items) => setContent((p) => ({ ...p, community: { ...p.community, items } }))} />
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hostel Rules & Guidelines
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, rules: { ...p.rules, rules: [...p.rules.rules, { title: '', detail: '' }] } }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add rule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Rules section title</Label><Input value={content.rules.title} onChange={(e) => setContent((p) => ({ ...p, rules: { ...p.rules, title: e.target.value } }))} /></div>
              {content.rules.rules.map((rule, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Rule {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, rules: { ...p.rules, rules: p.rules.rules.filter((_, j) => j !== i) } }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={rule.title} onChange={(e) => setContent((p) => ({ ...p, rules: { ...p.rules, rules: p.rules.rules.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)) } }))} placeholder="Title" />
                  <Input value={rule.detail} onChange={(e) => setContent((p) => ({ ...p, rules: { ...p.rules, rules: p.rules.rules.map((r, j) => (j === i ? { ...r, detail: e.target.value } : r)) } }))} placeholder="Detail" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader><CardTitle>Call to Action</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={content.cta.title} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))} /></div>
              <div><Label>Description</Label><Textarea value={content.cta.description} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, description: e.target.value } }))} rows={3} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Button text</Label><Input value={content.cta.buttonText} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, buttonText: e.target.value } }))} /></div>
                <div><Label>Button link</Label><Input value={content.cta.buttonHref} onChange={(e) => setContent((p) => ({ ...p, cta: { ...p.cta, buttonHref: e.target.value } }))} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Contact Columns
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, contact: { columns: [...p.contact.columns, { title: '', lines: [''], email: '' }] } }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.contact.columns.map((col, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Column {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.filter((_, j) => j !== i) } }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={col.title} onChange={(e) => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)) } }))} placeholder="Title" />
                  <StringListEditor label="Lines" items={col.lines} onChange={(lines) => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.map((c, j) => (j === i ? { ...c, lines } : c)) } }))} />
                  <Input value={col.email ?? ''} onChange={(e) => setContent((p) => ({ ...p, contact: { columns: p.contact.columns.map((c, j) => (j === i ? { ...c, email: e.target.value } : c)) } }))} placeholder="Email (optional)" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default HostelAdmin;
