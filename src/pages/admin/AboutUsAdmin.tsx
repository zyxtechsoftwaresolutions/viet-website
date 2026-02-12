import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { FileText, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface AboutPage {
  id: number;
  slug: string;
  title: string;
  content: Record<string, unknown>;
}

const defaultStats = [
  { number: '15', label: 'Programs', suffix: '+', isLetter: false },
  { number: '4900', label: 'Students', suffix: '+', isLetter: false },
  { number: '200', label: 'Faculty Members', suffix: '+', isLetter: false },
  { number: 'A', label: 'NAAC Grade', suffix: '', isLetter: true },
];

const defaultContent = {
  hero: { title: 'About VIET', description: '', heroImage: '' },
  mainContent: '',
  rankings: {
    intro: '',
    accreditation: '',
    governance: '',
    logos: [] as { src: string; alt: string; name: string; description: string }[],
  },
  vision: '',
  visionImage: '',
  mission: '',
  missionSections: [] as { title: string; body: string; image: string }[],
  stats: defaultStats,
  quote: { text: '', author: '' },
  findUs: { intro: '', address: '', phone: '', email: '' },
};

const AboutUsAdmin = () => {
  const [page, setPage] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Record<string, unknown>>(defaultContent);
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [deleteLogoIndex, setDeleteLogoIndex] = useState<number | null>(null);
  const [deleteSectionIndex, setDeleteSectionIndex] = useState<number | null>(null);

  const fetchPage = async () => {
    try {
      const data = await pagesAPI.getBySlug('about');
      if (data?.id) {
        setPage({ id: data.id, slug: data.slug, title: data.title || 'About Us', content: data.content || {} });
        const merged = { ...defaultContent, ...(data.content || {}) };
        if (!Array.isArray(merged.stats) || (merged.stats as any[]).length === 0) (merged as any).stats = defaultStats;
        setContent(merged);
      } else {
        setPage(null);
        setContent(defaultContent);
      }
    } catch (err: any) {
      console.error('Error fetching about page:', err);
      toast.error(err.message || 'Failed to load About Us page');
      setPage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const updateContent = (path: string, value: unknown) => {
    setContent((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in cur)) cur[k] = {};
        cur[k] = { ...cur[k] };
        cur = cur[k];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const getContent = (path: string): unknown => {
    const keys = path.split('.');
    let cur: any = content;
    for (const k of keys) {
      cur = cur?.[k];
    }
    return cur;
  };

  const handleImageChange = (field: string, file: File | null) => {
    setImageFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleSave = async () => {
    if (!page) {
      toast.error('About page not found. Ensure the about page exists in the database.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...content } as any;

      if (imageFiles.heroImage && payload.hero) {
        const url = await uploadToSupabase(imageFiles.heroImage, 'about', 'images');
        payload.hero = { ...payload.hero, heroImage: url };
      }
      if (imageFiles.visionImage && payload.visionImage !== undefined) {
        const url = await uploadToSupabase(imageFiles.visionImage, 'about', 'images');
        payload.visionImage = url;
      }
      if (payload.missionSections?.length) {
        for (let i = 0; i < payload.missionSections.length; i++) {
          const key = `missionSectionImage${i}`;
          if (imageFiles[key]) {
            const url = await uploadToSupabase(imageFiles[key]!, 'about', 'images');
            payload.missionSections[i] = { ...payload.missionSections[i], image: url };
          }
        }
      }

      setImageFiles({});

      await pagesAPI.update(page.id, {
        ...page,
        content: payload,
      });
      toast.success('About Us page saved successfully');
      fetchPage();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addRankingLogo = () => {
    const logos = (getContent('rankings.logos') as any[]) || [];
    updateContent('rankings.logos', [...logos, { src: '', alt: '', name: '', description: '' }]);
  };

  const removeRankingLogo = (index: number) => {
    const logos = [...((getContent('rankings.logos') as any[]) || [])];
    logos.splice(index, 1);
    updateContent('rankings.logos', logos);
    setDeleteLogoIndex(null);
  };

  const addMissionSection = () => {
    const sections = (getContent('missionSections') as any[]) || [];
    updateContent('missionSections', [...sections, { title: '', body: '', image: '' }]);
  };

  const removeMissionSection = (index: number) => {
    const sections = [...((getContent('missionSections') as any[]) || [])];
    sections.splice(index, 1);
    updateContent('missionSections', sections);
    setDeleteSectionIndex(null);
  };

  const rankings = (content.rankings as any) || defaultContent.rankings;
  const logos = Array.isArray(rankings.logos) ? rankings.logos : [];
  const missionSections = Array.isArray(content.missionSections) ? content.missionSections : [];
  const stats = Array.isArray(content.stats) ? content.stats : defaultContent.stats;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Pages – About Us</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              About Us page not found. Ensure a page with slug <code>about</code> exists in the database (e.g. run migrations or create it via API).
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages – About Us</h1>
          <p className="text-muted-foreground mt-1">Edit all content, images, and sections on the About Us page.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save all changes'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="content">About content</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="quote">Quote</TabsTrigger>
          <TabsTrigger value="findus">Find Us</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hero section
              </CardTitle>
              <CardDescription>Title, description, and background image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero title</Label>
                <Input
                  value={((content.hero as any)?.title as string) || ''}
                  onChange={(e) => updateContent('hero.title', e.target.value)}
                  placeholder="About VIET"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero description</Label>
                <Textarea
                  value={((content.hero as any)?.description as string) || ''}
                  onChange={(e) => updateContent('hero.description', e.target.value)}
                  rows={3}
                  placeholder="Excellence in Technical Education Since 2008"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero background image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('heroImage', e.target.files?.[0] ?? null)}
                />
                {((content.hero as any)?.heroImage as string) && (
                  <p className="text-xs text-muted-foreground">Current: {(content.hero as any).heroImage}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Main about content
              </CardTitle>
              <CardDescription>HTML content shown in the About us section (supports &lt;p&gt;, &lt;strong&gt;, etc.)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={(content.mainContent as string) || ''}
                onChange={(e) => updateContent('mainContent', e.target.value)}
                rows={16}
                className="font-mono text-sm"
                placeholder="<p>First paragraph...</p><p>Second paragraph...</p>"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rankings section</CardTitle>
              <CardDescription>Intro text and accreditation/governance blurbs; add/remove ranking logos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rankings intro</Label>
                <Textarea
                  value={rankings.intro || ''}
                  onChange={(e) => updateContent('rankings.intro', e.target.value)}
                  rows={2}
                  placeholder="VIET has been recognized as one of the leading institutions..."
                />
              </div>
              <div className="space-y-2">
                <Label>Accreditation text</Label>
                <Textarea
                  value={rankings.accreditation || ''}
                  onChange={(e) => updateContent('rankings.accreditation', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Governance text</Label>
                <Textarea
                  value={rankings.governance || ''}
                  onChange={(e) => updateContent('rankings.governance', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Ranking logos (image URL or upload path)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRankingLogo}>
                    <Plus className="h-4 w-4 mr-1" /> Add logo
                  </Button>
                </div>
                {logos.map((logo: any, index: number) => (
                  <div key={index} className="flex flex-wrap items-start gap-4 p-4 border rounded-lg mb-2">
                    <Input
                      placeholder="Image URL or path"
                      value={logo?.src || ''}
                      onChange={(e) => {
                        const next = [...logos];
                        next[index] = { ...next[index], src: e.target.value, alt: next[index]?.alt || '', name: next[index]?.name || '', description: next[index]?.description || '' };
                        updateContent('rankings.logos', next);
                      }}
                      className="max-w-xs"
                    />
                    <Input
                      placeholder="Name"
                      value={logo?.name || ''}
                      onChange={(e) => {
                        const next = [...logos];
                        next[index] = { ...next[index], name: e.target.value };
                        updateContent('rankings.logos', next);
                      }}
                      className="max-w-[140px]"
                    />
                    <Input
                      placeholder="Description"
                      value={logo?.description || ''}
                      onChange={(e) => {
                        const next = [...logos];
                        next[index] = { ...next[index], description: e.target.value };
                        updateContent('rankings.logos', next);
                      }}
                      className="max-w-[200px]"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setDeleteLogoIndex(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
              <CardDescription>Vision text and optional image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Vision text</Label>
                <Textarea
                  value={(content.vision as string) || ''}
                  onChange={(e) => updateContent('vision', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Vision image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('visionImage', e.target.files?.[0] ?? null)}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
              <CardDescription>Mission intro and subsections (Education for Life, Excellence Driven Research, Global Impact)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mission intro</Label>
                <Textarea
                  value={(content.mission as string) || ''}
                  onChange={(e) => updateContent('mission', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Mission subsections</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMissionSection}>
                    <Plus className="h-4 w-4 mr-1" /> Add section
                  </Button>
                </div>
                {missionSections.map((sec: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 space-y-2">
                    <Input
                      placeholder="Section title"
                      value={sec?.title || ''}
                      onChange={(e) => {
                        const next = [...missionSections];
                        next[index] = { ...next[index], title: e.target.value };
                        updateContent('missionSections', next);
                      }}
                    />
                    <Textarea
                      placeholder="Section body (HTML allowed)"
                      value={sec?.body || ''}
                      onChange={(e) => {
                        const next = [...missionSections];
                        next[index] = { ...next[index], body: e.target.value };
                        updateContent('missionSections', next);
                      }}
                      rows={4}
                    />
                    <div>
                      <Label className="text-xs">Section image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(`missionSectionImage${index}`, e.target.files?.[0] ?? null)}
                      />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteSectionIndex(index)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove section
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics (at a glance)</CardTitle>
              <CardDescription>Programs, Students, Faculty, NAAC Grade. Edit numbers and labels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Number (e.g. 15+ or A)"
                    value={(stats[i] as any)?.number ?? ''}
                    onChange={(e) => {
                      const next = [...stats];
                      if (!next[i]) next[i] = { number: '', label: '', suffix: '', isLetter: false };
                      next[i] = { ...next[i], number: e.target.value };
                      updateContent('stats', next);
                    }}
                  />
                  <Input
                    placeholder="Label"
                    value={(stats[i] as any)?.label ?? ''}
                    onChange={(e) => {
                      const next = [...stats];
                      if (!next[i]) next[i] = { number: '', label: '', suffix: '', isLetter: false };
                      next[i] = { ...next[i], label: e.target.value };
                      updateContent('stats', next);
                    }}
                  />
                  <Input
                    placeholder="Suffix (e.g. +)"
                    value={(stats[i] as any)?.suffix ?? ''}
                    onChange={(e) => {
                      const next = [...stats];
                      if (!next[i]) next[i] = { number: '', label: '', suffix: '', isLetter: false };
                      next[i] = { ...next[i], suffix: e.target.value };
                      updateContent('stats', next);
                    }}
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!(stats[i] as any)?.isLetter}
                      onChange={(e) => {
                        const next = [...stats];
                        if (!next[i]) next[i] = { number: '', label: '', suffix: '', isLetter: false };
                        next[i] = { ...next[i], isLetter: e.target.checked };
                        updateContent('stats', next);
                      }}
                    />
                    Letter (e.g. NAAC A)
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quote" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote / testimonial</CardTitle>
              <CardDescription>Quote text and author shown on About Us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quote text</Label>
                <Textarea
                  value={((content.quote as any)?.text as string) || ''}
                  onChange={(e) => updateContent('quote.text', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={((content.quote as any)?.author as string) || ''}
                  onChange={(e) => updateContent('quote.author', e.target.value)}
                  placeholder="Swami Vivekananda"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find Us</CardTitle>
              <CardDescription>Address, phone, email, and intro text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Intro paragraph</Label>
                <Textarea
                  value={((content.findUs as any)?.intro as string) || ''}
                  onChange={(e) => updateContent('findUs.intro', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Address (multiline)</Label>
                <Textarea
                  value={((content.findUs as any)?.address as string) || ''}
                  onChange={(e) => updateContent('findUs.address', e.target.value)}
                  rows={3}
                  placeholder="88th Division, Narava..."
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Textarea
                  value={((content.findUs as any)?.phone as string) || ''}
                  onChange={(e) => updateContent('findUs.phone', e.target.value)}
                  rows={2}
                  placeholder="+91-9959617476"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={((content.findUs as any)?.email as string) || ''}
                  onChange={(e) => updateContent('findUs.email', e.target.value)}
                  placeholder="website@viet.edu.in"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save all changes'}
        </Button>
      </div>

      <AlertDialog open={deleteLogoIndex !== null} onOpenChange={(open) => !open && setDeleteLogoIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove logo?</AlertDialogTitle>
            <AlertDialogDescription>This will remove this ranking logo from the list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteLogoIndex !== null && removeRankingLogo(deleteLogoIndex)}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteSectionIndex !== null} onOpenChange={(open) => !open && setDeleteSectionIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove section?</AlertDialogTitle>
            <AlertDialogDescription>This will remove this mission subsection.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteSectionIndex !== null && removeMissionSection(deleteSectionIndex)}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AboutUsAdmin;
