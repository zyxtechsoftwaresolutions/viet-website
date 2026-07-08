import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { pagesAPI } from '@/lib/api';
import {
  compressImageForUpload,
  formatFileSize,
  imageTooLargeMessage,
  isImageTooLargeForUpload,
} from '@/lib/compressImage';
import { uploadToSupabase } from '@/lib/storage';
import { imgUrl } from '@/lib/imageUtils';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import { ExternalLink, Plus, Trash2, Save, RefreshCw, ImagePlus } from 'lucide-react';
import {
  DEFAULT_CAMPUS_LIFE_CONTENT,
  normalizeCampusLifeContent,
  createEmptyHighlight,
  type CampusLifeContent,
  type CampusHighlight,
} from '@/lib/campusLifeContent';

const SLUG = 'campus-life';

const CampusLifeAdmin = () => {
  const [pageId, setPageId] = useState<number | null>(null);
  const [content, setContent] = useState<CampusLifeContent>(DEFAULT_CAMPUS_LIFE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [highlightFiles, setHighlightFiles] = useState<Record<string, File | null>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [deleteHighlightId, setDeleteHighlightId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.getBySlug(SLUG);
      if (page?.id) {
        setPageId(page.id);
        setContent(normalizeCampusLifeContent(page.content));
      } else {
        setPageId(null);
        setContent(DEFAULT_CAMPUS_LIFE_CONTENT);
        toast.info('Campus Life page not in database yet — saving will create it.');
      }
      setHighlightFiles({});
      setPreviewUrls((prev) => {
        Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
        return {};
      });
    } catch {
      setPageId(null);
      setContent(DEFAULT_CAMPUS_LIFE_CONTENT);
      toast.error('Could not load Campus Life. Defaults shown — Save will create the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setHighlightFile = async (id: string, file: File | null) => {
    if (!file) {
      setPreviewUrls((prev) => {
        if (prev[id]) URL.revokeObjectURL(prev[id]);
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setHighlightFiles((prev) => ({ ...prev, [id]: null }));
      return;
    }

    try {
      toast.info('Optimizing image…');
      const optimized = await compressImageForUpload(file, 1600, 0.85);
      if (isImageTooLargeForUpload(optimized)) {
        toast.error(imageTooLargeMessage(optimized));
        return;
      }

      setPreviewUrls((prev) => {
        if (prev[id]) URL.revokeObjectURL(prev[id]);
        return { ...prev, [id]: URL.createObjectURL(optimized) };
      });
      setHighlightFiles((prev) => ({ ...prev, [id]: optimized }));

      if (optimized.size < file.size) {
        toast.success(
          `Photo ready (${formatFileSize(file.size)} → ${formatFileSize(optimized.size)}). Click Save Changes to publish.`
        );
      } else {
        toast.success('Photo ready — click Save Changes to publish.');
      }
    } catch {
      toast.error('Could not process this image. Try a JPG or PNG under 10 MB.');
    }
  };

  const updateHighlight = (id: string, patch: Partial<CampusHighlight>) => {
    setContent((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  };

  const addHighlight = () => {
    setContent((prev) => ({
      ...prev,
      highlights: [...prev.highlights, createEmptyHighlight()],
    }));
  };

  const confirmDeleteHighlight = () => {
    if (!deleteHighlightId) return;
    setContent((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h.id !== deleteHighlightId),
    }));
    setHighlightFiles((prev) => {
      const next = { ...prev };
      delete next[deleteHighlightId];
      return next;
    });
    setPreviewUrls((prev) => {
      if (prev[deleteHighlightId]) URL.revokeObjectURL(prev[deleteHighlightId]);
      const next = { ...prev };
      delete next[deleteHighlightId];
      return next;
    });
    setDeleteHighlightId(null);
    toast.success('Photo removed — click Save Changes to publish');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const highlights = [...content.highlights];
      for (let i = 0; i < highlights.length; i++) {
        const file = highlightFiles[highlights[i].id];
        if (file) {
          const label = highlights[i].title || `Photo ${i + 1}`;
          toast.info(`Uploading ${label}…`);
          try {
            const url = await uploadToSupabase(file, 'campus-life', 'images');
            highlights[i] = { ...highlights[i], image: url };
          } catch (uploadErr: unknown) {
            const msg =
              uploadErr instanceof Error ? uploadErr.message : 'Upload failed';
            toast.error(`Failed to upload ${label}: ${msg}`);
            throw uploadErr;
          }
        }
      }

      const missingImage = highlights.find((h) => !h.image?.trim());
      if (missingImage) {
        toast.error(`"${missingImage.title || 'Untitled'}" needs an image before saving`);
        setSaving(false);
        return;
      }

      const payloadContent: CampusLifeContent = {
        ...content,
        highlights,
      };

      const pagePayload = {
        slug: SLUG,
        title: 'Campus Life',
        route: '/campus-life',
        category: 'Campus',
        content: payloadContent,
      };

      if (pageId) {
        await pagesAPI.update(pageId, pagePayload);
      } else {
        const created = await pagesAPI.create(pagePayload);
        if (created?.id) setPageId(created.id);
      }

      setContent(payloadContent);
      setHighlightFiles({});
      setPreviewUrls((prev) => {
        Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
        return {};
      });
      toast.success('Campus Life updated successfully');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save Campus Life');
    } finally {
      setSaving(false);
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campus Life</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Update hero text and campus highlight photos. Changes appear on{' '}
            <code className="text-xs bg-muted px-1 rounded">/campus-life</code> after you save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.open('/campus-life', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View page
          </Button>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Top banner text on the Campus Life page</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input
              value={content.hero.badge}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={content.hero.description}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, description: e.target.value },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Campus highlight photos</CardTitle>
            <CardDescription>
              Add, replace, or delete magazine-grid images. Layout size controls how each tile looks on
              the public page.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={addHighlight}>
            <Plus className="h-4 w-4 mr-2" />
            Add photo
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploadGuide {...IMAGE_SPECS.campusLifeHighlight} inline />

          {content.highlights.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
              No photos yet. Click “Add photo” to upload the first highlight.
            </p>
          ) : (
            content.highlights.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">Photo {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteHighlightId(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted border">
                    {item.image || previewUrls[item.id] ? (
                      <img
                        src={previewUrls[item.id] || imgUrl(item.image)}
                        alt={item.alt || item.title || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImagePlus className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Replace / upload image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setHighlightFile(item.id, file);
                          e.target.value = '';
                        }}
                      />
                      {item.image && !highlightFiles[item.id] && (
                        <p className="text-xs text-muted-foreground break-all">Current: {item.image}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateHighlight(item.id, { title: e.target.value })}
                        placeholder="e.g. Academic Excellence"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Layout size</Label>
                      <Select
                        value={item.size}
                        onValueChange={(v) =>
                          updateHighlight(item.id, { size: v as CampusHighlight['size'] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="large">Large (8 cols, 2 rows)</SelectItem>
                          <SelectItem value="medium">Medium (4 cols)</SelectItem>
                          <SelectItem value="wide">Wide (6 cols)</SelectItem>
                          <SelectItem value="full">Full width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Description (optional)</Label>
                      <Textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => updateHighlight(item.id, { description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Alt text</Label>
                      <Input
                        value={item.alt || ''}
                        onChange={(e) => updateHighlight(item.id, { alt: e.target.value })}
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pb-8">
        <Button variant="outline" onClick={load}>
          Discard unsaved
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      <AlertDialog open={!!deleteHighlightId} onOpenChange={(open) => !open && setDeleteHighlightId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the Campus Life grid after you save. This cannot be undone from the
              admin panel once saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteHighlight}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampusLifeAdmin;
