import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HeroMediaFields, { type HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import FacilityLeaderEditor from '@/components/admin/facility/FacilityLeaderEditor';
import { ParagraphsEditor, StatPairsEditor, StringListEditor } from '@/components/admin/facility/AdminFieldHelpers';
import { pagesAPI } from '@/lib/api';
import { saveFacilityPageContent } from '@/lib/facilityAdminSave';
import { uploadToSupabase } from '@/lib/storage';
import { DEFAULT_LIBRARY_CONTENT, normalizeLibraryContent, type LibraryContent } from '@/lib/facilityContent/libraryContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const SLUG = 'library';
const ROUTE = '/facilities/library';

const LIBRARY_ICONS = ['book-open', 'users', 'wifi', 'clock', 'coffee', 'map-pin'] as const;

const LibraryAdmin = () => {
  const [content, setContent] = useState<LibraryContent>(DEFAULT_LIBRARY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaFormState>({
    image: '',
    video: '',
    imageFile: null,
    videoFile: null,
  });
  const [librarianImageFile, setLibrarianImageFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      const normalized = normalizeLibraryContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
      setLibrarianImageFile(null);
    } catch {
      setContent(DEFAULT_LIBRARY_CONTENT);
      toast.error('Could not load Library content — showing defaults.');
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
      let librarianImage = content.librarian.image;
      if (librarianImageFile) {
        librarianImage = await uploadToSupabase(librarianImageFile, 'facilities', 'images');
      }
      const contentToSave = {
        ...content,
        librarian: { ...content.librarian, image: librarianImage },
      };
      await saveFacilityPageContent(
        SLUG,
        'Library',
        ROUTE,
        contentToSave as unknown as Record<string, unknown>,
        heroMedia
      );
      toast.success('Library page saved');
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
      title="Library Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="collection">Collection Stats</TabsTrigger>
          <TabsTrigger value="timings">Timings</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="librarian">Librarian</TabsTrigger>
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
            <CardHeader><CardTitle>About the Library</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.about.label} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.about.title} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))} /></div>
              <ParagraphsEditor label="Paragraphs" paragraphs={content.about.paragraphs} onChange={(paragraphs) => setContent((p) => ({ ...p, about: { ...p.about, paragraphs } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Library Features
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, features: [...p.features, { icon: 'book-open', title: '', description: '' }] }))}>
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
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={feature.icon}
                      onValueChange={(value) => setContent((p) => ({ ...p, features: p.features.map((f, j) => (j === i ? { ...f, icon: value } : f)) }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger>
                      <SelectContent>
                        {LIBRARY_ICONS.map((icon) => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input value={feature.title} onChange={(e) => setContent((p) => ({ ...p, features: p.features.map((f, j) => (j === i ? { ...f, title: e.target.value } : f)) }))} placeholder="Title" />
                  <Textarea value={feature.description} onChange={(e) => setContent((p) => ({ ...p, features: p.features.map((f, j) => (j === i ? { ...f, description: e.target.value } : f)) }))} placeholder="Description" rows={2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collection">
          <Card>
            <CardHeader><CardTitle>Collection Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Section label</Label><Input value={content.collection.label} onChange={(e) => setContent((p) => ({ ...p, collection: { ...p.collection, label: e.target.value } }))} /></div>
              <div><Label>Section title</Label><Input value={content.collection.title} onChange={(e) => setContent((p) => ({ ...p, collection: { ...p.collection, title: e.target.value } }))} /></div>
              <StatPairsEditor label="Stats" stats={content.collection.stats} onChange={(stats) => setContent((p) => ({ ...p, collection: { ...p.collection, stats } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Library Timings
                <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, timings: [...p.timings, { day: '', time: '' }] }))}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.timings.map((timing, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-2">
                  <Input value={timing.day} onChange={(e) => setContent((p) => ({ ...p, timings: p.timings.map((t, j) => (j === i ? { ...t, day: e.target.value } : t)) }))} placeholder="Day(s)" />
                  <div className="flex gap-2">
                    <Input value={timing.time} onChange={(e) => setContent((p) => ({ ...p, timings: p.timings.map((t, j) => (j === i ? { ...t, time: e.target.value } : t)) }))} placeholder="Time" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, timings: p.timings.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader><CardTitle>Library Rules</CardTitle></CardHeader>
            <CardContent>
              <StringListEditor label="Rules" items={content.rules} onChange={(rules) => setContent((p) => ({ ...p, rules }))} placeholder="Rule" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="librarian">
          <Card>
            <CardHeader><CardTitle>Librarian Profile</CardTitle></CardHeader>
            <CardContent>
              <FacilityLeaderEditor
                value={content.librarian}
                onChange={(librarian) => setContent((p) => ({ ...p, librarian }))}
                imageFile={librarianImageFile}
                onImageFileChange={setLibrarianImageFile}
                personLabel="Librarian"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default LibraryAdmin;
