import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HeroMediaFields, { type HeroMediaFormState } from '@/components/admin/HeroMediaFields';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import { pagesAPI } from '@/lib/api';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { imgUrl } from '@/lib/imageUtils';
import {
  DEFAULT_ORGANIZATIONAL_CHART_CONTENT,
  normalizeOrganizationalChartContent,
  type OrganizationalChartContent,
} from '@/lib/organizationalChartContent';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';

const SLUG = 'organizational-chart';
const ROUTE = '/organizational-chart';

const OrganizationalChartAdmin = () => {
  const [content, setContent] = useState<OrganizationalChartContent>(DEFAULT_ORGANIZATIONAL_CHART_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaFormState>({
    image: '',
    video: '',
    imageFile: null,
    videoFile: null,
  });
  const [chartImageFile, setChartImageFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      const normalized = normalizeOrganizationalChartContent(page?.content || null);
      setContent(normalized);
      setHeroMedia({
        image: normalized.hero.heroImage || '',
        video: normalized.hero.video || '',
        imageFile: null,
        videoFile: null,
      });
      setChartImageFile(null);
    } catch {
      setContent(DEFAULT_ORGANIZATIONAL_CHART_CONTENT);
      toast.error('Could not load Organizational Chart — showing defaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const chartPreview = chartImageFile
    ? URL.createObjectURL(chartImageFile)
    : content.chartImage
      ? imgUrl(content.chartImage)
      : null;

  const handleSave = async () => {
    setSaving(true);
    try {
      let chartImage = content.chartImage;
      let heroImage = content.hero.heroImage || '';

      if (chartImageFile) {
        toast.info('Uploading organizational chart image…');
        chartImage = await uploadToSupabase(chartImageFile, 'organizational-chart', 'images');
      }
      if (heroMedia.imageFile) {
        toast.info('Uploading hero image…');
        heroImage = await uploadToSupabase(heroMedia.imageFile, 'organizational-chart', 'images');
      }

      await pagesAPI.saveBySlug(SLUG, {
        title: 'Organizational Chart',
        route: ROUTE,
        category: 'About',
        content: {
          ...content,
          hero: { ...content.hero, heroImage: heroImage || undefined, video: content.hero.video || undefined },
          chartImage,
        },
      });

      toast.success('Organizational Chart saved');
      setChartImageFile(null);
      setHeroMedia((prev) => ({ ...prev, imageFile: null, videoFile: null }));
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FacilityAdminLayout
      title="Organizational Chart"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Badge</Label>
              <Input
                value={content.hero.badge || ''}
                onChange={(e) =>
                  setContent((p) => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={content.hero.title}
                onChange={(e) =>
                  setContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))
                }
              />
            </div>
            <div>
              <Label>Subtitle / description</Label>
              <Textarea
                rows={3}
                value={content.hero.description || ''}
                onChange={(e) =>
                  setContent((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))
                }
              />
            </div>
            <HeroMediaFields
              value={heroMedia}
              onChange={(patch) => setHeroMedia((prev) => ({ ...prev, ...patch }))}
              imageSpec={IMAGE_SPECS.aboutHero}
              imageLabel="Hero background image"
              videoLabel="Hero video (optional — rarely used on this page)"
            />
            <ImageUploadGuide spec={IMAGE_SPECS.aboutHero} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizational chart image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload the full organizational chart (PNG or JPG). This image is shown on the public
              page below the hero section.
            </p>
            <div>
              <Label>Chart image file</Label>
              <Input
                type="file"
                accept="image/*"
                className="max-w-md"
                onChange={(e) => {
                  setChartImageFile(e.target.files?.[0] || null);
                  e.target.value = '';
                }}
              />
              <ImageUploadGuide spec={IMAGE_SPECS.orgChartImage} className="mt-2" />
            </div>
            <div>
              <Label>Alt text (accessibility)</Label>
              <Input
                value={content.chartAlt}
                onChange={(e) => setContent((p) => ({ ...p, chartAlt: e.target.value }))}
                placeholder="VIET Organizational Chart"
              />
            </div>
            {chartPreview && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-lg border bg-slate-50 p-4 inline-block max-w-full">
                  <img
                    src={chartPreview}
                    alt={content.chartAlt}
                    className="max-w-full h-auto max-h-[480px] object-contain rounded"
                  />
                </div>
                {!chartImageFile && content.chartImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setContent((p) => ({ ...p, chartImage: '' }))}
                  >
                    Remove saved chart image
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FacilityAdminLayout>
  );
};

export default OrganizationalChartAdmin;
