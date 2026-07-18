import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeroMediaFields, { type HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import FacilityLeaderEditor from '@/components/admin/facility/FacilityLeaderEditor';
import {
  FacilityGalleryEditor,
  ParagraphsEditor,
  StringListEditor,
  type PendingGalleryFiles,
} from '@/components/admin/facility/AdminFieldHelpers';
import { pagesAPI } from '@/lib/api';
import { saveFacilityPageContent, uploadFacilityGalleryImages } from '@/lib/facilityAdminSave';
import { uploadToSupabase } from '@/lib/storage';
import {
  DEFAULT_SCOUTS_CONTENT,
  normalizeScoutsContent,
  type ScoutsContent,
} from '@/lib/facilityContent/scoutsContent';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';

const SLUG = 'scouts';
const ROUTE = '/facilities/scouts';

const ScoutsAdmin = () => {
  const [content, setContent] = useState<ScoutsContent>(DEFAULT_SCOUTS_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaFormState>({
    image: '',
    video: '',
    imageFile: null,
    videoFile: null,
  });
  const [eventFiles, setEventFiles] = useState<PendingGalleryFiles>({});
  const [leaderImageFile, setLeaderImageFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      const normalized = normalizeScoutsContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
      setEventFiles({});
      setLeaderImageFile(null);
    } catch {
      setContent(DEFAULT_SCOUTS_CONTENT);
      toast.error('Could not load Scouts content — showing defaults.');
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
      const events = await uploadFacilityGalleryImages(content.events, eventFiles);
      let leaderImage = content.leader.image;
      if (leaderImageFile) {
        leaderImage = await uploadToSupabase(leaderImageFile, 'facilities', 'images');
      }
      const contentToSave = {
        ...content,
        events,
        leader: { ...content.leader, image: leaderImage },
      };
      await saveFacilityPageContent(
        SLUG,
        'Scouts & Guides',
        ROUTE,
        contentToSave as unknown as Record<string, unknown>,
        heroMedia
      );
      toast.success('Scouts page saved');
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FacilityAdminLayout
      title="Scouts Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="events">Events & Images</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="leader">Scouts Leader</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge</Label>
                <Input
                  value={content.hero.badge}
                  onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={content.hero.description}
                  onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))}
                />
              </div>
              <HeroMediaFields
                value={heroMedia}
                onChange={(patch) => setHeroMedia((prev) => ({ ...prev, ...patch }))}
                imageSpec={IMAGE_SPECS.facilityHero}
              />
              <ImageUploadGuide spec={IMAGE_SPECS.facilityHero} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle>About Scouts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Section label</Label>
                <Input
                  value={content.about.label}
                  onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, label: e.target.value } }))}
                />
              </div>
              <div>
                <Label>Section title</Label>
                <Input
                  value={content.about.title}
                  onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))}
                />
              </div>
              <ParagraphsEditor
                label="Paragraphs"
                paragraphs={content.about.paragraphs}
                onChange={(paragraphs) => setContent((p) => ({ ...p, about: { ...p.about, paragraphs } }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader><CardTitle>Events and Image Grid</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Section label</Label>
                  <Input
                    value={content.eventsSection.label}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        eventsSection: { ...p.eventsSection, label: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Section title</Label>
                  <Input
                    value={content.eventsSection.title}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        eventsSection: { ...p.eventsSection, title: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={content.eventsSection.description}
                  onChange={(e) =>
                    setContent((p) => ({
                      ...p,
                      eventsSection: { ...p.eventsSection, description: e.target.value },
                    }))
                  }
                />
              </div>
              <FacilityGalleryEditor
                items={content.events}
                onChange={(events) => setContent((p) => ({ ...p, events }))}
                pendingFiles={eventFiles}
                onPendingFilesChange={setEventFiles}
                imageSpec={IMAGE_SPECS.facilityGallery}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader><CardTitle>Scouts Activities</CardTitle></CardHeader>
            <CardContent>
              <StringListEditor
                label="Activities"
                items={content.activities}
                onChange={(activities) => setContent((p) => ({ ...p, activities }))}
                placeholder="Activity"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leader">
          <Card>
            <CardHeader><CardTitle>Scouts Leader Profile</CardTitle></CardHeader>
            <CardContent>
              <FacilityLeaderEditor
                value={content.leader}
                onChange={(leader) => setContent((p) => ({ ...p, leader }))}
                imageFile={leaderImageFile}
                onImageFileChange={setLeaderImageFile}
                personLabel="Scouts leader"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default ScoutsAdmin;
