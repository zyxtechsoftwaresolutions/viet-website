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
import { FacilityGalleryEditor, ParagraphsEditor, type PendingGalleryFiles } from '@/components/admin/facility/AdminFieldHelpers';
import { pagesAPI } from '@/lib/api';
import { saveFacilityPageContent, uploadFacilityGalleryImages } from '@/lib/facilityAdminSave';
import { DEFAULT_SPORTS_CONTENT, normalizeSportsContent, type SportsContent } from '@/lib/facilityContent/sportsContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SLUG = 'sports';
const ROUTE = '/facilities/sports';

const SportsAdmin = () => {
  const [content, setContent] = useState<SportsContent>(DEFAULT_SPORTS_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaFormState>({
    image: '',
    video: '',
    imageFile: null,
    videoFile: null,
  });
  const [galleryFiles, setGalleryFiles] = useState<PendingGalleryFiles>({});

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      const normalized = normalizeSportsContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
      setGalleryFiles({});
    } catch {
      setContent(DEFAULT_SPORTS_CONTENT);
      toast.error('Could not load Sports content — showing defaults.');
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
      const gallery = await uploadFacilityGalleryImages(content.gallery, galleryFiles);
      const contentToSave = { ...content, gallery };
      await saveFacilityPageContent(SLUG, 'Sports', ROUTE, contentToSave as unknown as Record<string, unknown>, heroMedia);
      toast.success('Sports page saved');
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      setGalleryFiles({});
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FacilityAdminLayout
      title="Sports Page"
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
          <TabsTrigger value="hall">Hall of Fame</TabsTrigger>
          <TabsTrigger value="sports">Sports Offered</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
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
            <CardHeader><CardTitle>About Sports</CardTitle></CardHeader>
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
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityGalleryEditor
                items={content.gallery}
                onChange={(gallery) => setContent((p) => ({ ...p, gallery }))}
                pendingFiles={galleryFiles}
                onPendingFilesChange={setGalleryFiles}
                imageSpec={IMAGE_SPECS.facilityGallery}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hall">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hall of Fame
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, hallOfFame: [...p.hallOfFame, { name: '', achievement: '', sport: '', year: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.hallOfFame.map((entry, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Entry {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, hallOfFame: p.hallOfFame.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={entry.name} onChange={(e) => setContent((p) => ({ ...p, hallOfFame: p.hallOfFame.map((h, j) => (j === i ? { ...h, name: e.target.value } : h)) }))} placeholder="Name" />
                  <Textarea value={entry.achievement} onChange={(e) => setContent((p) => ({ ...p, hallOfFame: p.hallOfFame.map((h, j) => (j === i ? { ...h, achievement: e.target.value } : h)) }))} placeholder="Achievement" rows={2} />
                  <div className="grid md:grid-cols-2 gap-2">
                    <Input value={entry.sport} onChange={(e) => setContent((p) => ({ ...p, hallOfFame: p.hallOfFame.map((h, j) => (j === i ? { ...h, sport: e.target.value } : h)) }))} placeholder="Sport" />
                    <Input value={entry.year} onChange={(e) => setContent((p) => ({ ...p, hallOfFame: p.hallOfFame.map((h, j) => (j === i ? { ...h, year: e.target.value } : h)) }))} placeholder="Year" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sports Offered
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, sportsOffered: [...p.sportsOffered, { name: '', category: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.sportsOffered.map((sport, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-2">
                  <Input value={sport.name} onChange={(e) => setContent((p) => ({ ...p, sportsOffered: p.sportsOffered.map((s, j) => (j === i ? { ...s, name: e.target.value } : s)) }))} placeholder="Sport name" />
                  <div className="flex gap-2">
                    <Input value={sport.category} onChange={(e) => setContent((p) => ({ ...p, sportsOffered: p.sportsOffered.map((s, j) => (j === i ? { ...s, category: e.target.value } : s)) }))} placeholder="Category (Indoor/Outdoor)" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, sportsOffered: p.sportsOffered.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sports Facilities
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, facilities: [...p.facilities, { title: '', description: '', icon: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.facilities.map((facility, i) => (
                <div key={i} className="grid gap-2 border rounded-lg p-4">
                  <div className="flex justify-between"><Label>Facility {i + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, facilities: p.facilities.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={facility.title} onChange={(e) => setContent((p) => ({ ...p, facilities: p.facilities.map((f, j) => (j === i ? { ...f, title: e.target.value } : f)) }))} placeholder="Title" />
                  <Textarea value={facility.description} onChange={(e) => setContent((p) => ({ ...p, facilities: p.facilities.map((f, j) => (j === i ? { ...f, description: e.target.value } : f)) }))} placeholder="Description" rows={2} />
                  <Textarea value={facility.icon} onChange={(e) => setContent((p) => ({ ...p, facilities: p.facilities.map((f, j) => (j === i ? { ...f, icon: e.target.value } : f)) }))} placeholder="SVG path (advanced)" rows={2} className="font-mono text-xs" />
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

export default SportsAdmin;
