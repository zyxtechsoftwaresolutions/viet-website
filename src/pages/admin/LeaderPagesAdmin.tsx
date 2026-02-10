import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';
import { Edit, User, Award, GraduationCap, Lightbulb, Image as ImageIcon, X, Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Page {
  id: number;
  slug: string;
  title: string;
  content: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LEADER_SLUGS = ['principal', 'chairman', 'dean-academics', 'dean-innovation'] as const;
type LeaderSlug = (typeof LEADER_SLUGS)[number];

const getHeroImageUrl = (content: any): string => {
  const raw = content?.heroImage || content?.profileImage;
  if (!raw || typeof raw !== 'string') return '';
  if (raw.startsWith('http')) return raw;
  const base = (API_BASE_URL || 'http://localhost:3001').replace('/api', '');
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return `${base}${path}`;
};

const LeaderPagesAdmin = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    heroImage: '' as string | null,
    heroImageFile: null as File | null,
    badge: '',
    title: '',
    subline: '',
    qualification: '',
    buttonText: '',
    message: '',
    inspirationQuote: '',
    inspirationAuthor: '',
    greetingsText: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    try {
      const data = await pagesAPI.getAll();
      const raw = Array.isArray(data) ? data : (data?.pages ?? data?.data ?? []);
      const list = (Array.isArray(raw) ? raw : []).filter((p: any) =>
        LEADER_SLUGS.includes(p.slug)
      );
      setPages(
        list.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          content: p.content || {},
        }))
      );
    } catch (err: any) {
      console.error('Error fetching pages:', err);
      toast.error(err.message || 'Failed to fetch pages');
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openEdit = (page: Page) => {
    const c = page.content || {};
    const profile = c.profile || {};
    const hero = c.hero || {};
    const inspiration = c.inspiration || {};
    const greetings = c.greetings || {};

    setSelectedPage(page);
    setFormData({
      heroImage: c.heroImage || c.profileImage || '',
      heroImageFile: null,
      badge: profile.badge ?? profile.designation ?? '',
      title: profile.name ?? hero.title ?? '',
      subline: hero.description ?? '',
      qualification: profile.qualification ?? '',
      buttonText: hero.buttonText ?? 'Read message',
      message: c.message ?? '',
      inspirationQuote: inspiration.quote ?? '',
      inspirationAuthor: inspiration.author ?? '',
      greetingsText: greetings.text ?? 'Wish you all the best,',
    });
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, heroImageFile: file }));
      e.target.value = '';
    }
  };

  const removeHeroImage = () => {
    setFormData((prev) => ({ ...prev, heroImage: null, heroImageFile: null }));
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const content = { ...(selectedPage.content || {}) };

      // Hero image — set both heroImage and profileImage so the page finds it regardless of field order
      if (formData.heroImageFile) {
        const url = await uploadToSupabase(formData.heroImageFile, 'pages', 'images');
        if (url) {
          content.heroImage = url;
          content.profileImage = url;
        }
      } else if (formData.heroImage === null || formData.heroImage === '') {
        content.heroImage = null;
        content.profileImage = null;
      }

      // Hero & profile
      content.hero = {
        ...content.hero,
        description: formData.subline,
        buttonText: formData.buttonText,
      };
      content.profile = {
        ...content.profile,
        badge: formData.badge,
        name: formData.title,
        designation: formData.badge || content.profile?.designation,
        qualification: formData.qualification,
      };

      content.message = formData.message;
      content.inspiration = {
        quote: formData.inspirationQuote,
        author: formData.inspirationAuthor,
      };
      content.greetings = {
        text: formData.greetingsText,
      };

      // Remove preview keys
      Object.keys(content).forEach((k) => {
        if (k.endsWith('_preview')) delete content[k];
      });

      await pagesAPI.update(selectedPage.id, {
        ...selectedPage,
        content,
      });
      toast.success(`${selectedPage.title} page updated successfully`);
      setDialogOpen(false);
      fetchPages();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const heroImagePreview = () => {
    if (formData.heroImageFile) {
      return URL.createObjectURL(formData.heroImageFile);
    }
    if (formData.heroImage) {
      return formData.heroImage.startsWith('http')
        ? formData.heroImage
        : getHeroImageUrl({ heroImage: formData.heroImage });
    }
    return null;
  };

  const principalPage = pages.find((p) => p.slug === 'principal');
  const chairmanPage = pages.find((p) => p.slug === 'chairman');
  const deanAcademicsPage = pages.find((p) => p.slug === 'dean-academics');
  const deanInnovationPage = pages.find((p) => p.slug === 'dean-innovation');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pages</h1>
        <p className="text-muted-foreground mt-1">
          Edit Principal, Chairman, Dean Academics, and Dean Innovation page content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Principal
            </CardTitle>
            <CardDescription>Edit Principal page content and sections</CardDescription>
          </CardHeader>
          <CardContent>
            {principalPage ? (
              <Button onClick={() => openEdit(principalPage)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Principal Page
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Principal page not found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Chairman
            </CardTitle>
            <CardDescription>Edit Chairman page content and sections</CardDescription>
          </CardHeader>
          <CardContent>
            {chairmanPage ? (
              <Button onClick={() => openEdit(chairmanPage)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Chairman Page
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Chairman page not found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Dean Academics
            </CardTitle>
            <CardDescription>Edit Dean Academics page content and sections</CardDescription>
          </CardHeader>
          <CardContent>
            {deanAcademicsPage ? (
              <Button onClick={() => openEdit(deanAcademicsPage)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Dean Academics Page
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Dean Academics page not found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Dean Innovation
            </CardTitle>
            <CardDescription>Edit Dean Innovation & Student Projects page content</CardDescription>
          </CardHeader>
          <CardContent>
            {deanInnovationPage ? (
              <Button onClick={() => openEdit(deanInnovationPage)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Dean Innovation Page
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Dean Innovation page not found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit {selectedPage?.title} Page</DialogTitle>
            <DialogDescription>
              Update hero, message, inspiration, and greetings sections.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="hero" className="flex-1 overflow-hidden flex flex-col min-h-0">
            <TabsList className="shrink-0">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="message">Message</TabsTrigger>
              <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
              <TabsTrigger value="greetings">Greetings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto py-4 min-h-0">
              <TabsContent value="hero" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Hero Background Image
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="max-w-xs"
                      />
                      {(formData.heroImage || formData.heroImageFile) && (
                        <Button variant="ghost" size="sm" onClick={removeHeroImage} className="text-destructive">
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    {heroImagePreview() && (
                      <div className="mt-2">
                        <img
                          src={heroImagePreview()!}
                          alt="Hero preview"
                          className="w-full max-w-sm h-40 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Badge (small pill text above title)</Label>
                    <Input
                      placeholder="e.g. Principal, Chairman"
                      value={formData.badge}
                      onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Title (Name)</Label>
                    <Input
                      placeholder="e.g. Prof. G Vidya Pradeep Varma"
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Qualification</Label>
                    <Input
                      placeholder="e.g. M.Tech, Ph.D"
                      value={formData.qualification}
                      onChange={(e) => setFormData((p) => ({ ...p, qualification: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subline (intro text below qualification)</Label>
                    <Textarea
                      placeholder="Short introductory text displayed in the hero"
                      value={formData.subline}
                      onChange={(e) => setFormData((p) => ({ ...p, subline: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Read Message Button Text</Label>
                    <Input
                      placeholder="e.g. Read message"
                      value={formData.buttonText}
                      onChange={(e) => setFormData((p) => ({ ...p, buttonText: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="message" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label>{selectedPage?.title}'s Message Section</Label>
                  <Textarea
                    placeholder="Main message content (supports HTML: <p>, <strong>, etc.)"
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    rows={14}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use HTML tags for formatting: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="inspiration" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Quote className="h-4 w-4" />
                      Inspiration Quote
                    </Label>
                    <Textarea
                      placeholder='e.g. "The purpose of education is to make good human beings with skill and expertise."'
                      value={formData.inspirationQuote}
                      onChange={(e) => setFormData((p) => ({ ...p, inspirationQuote: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quote Author</Label>
                    <Input
                      placeholder="e.g. Dr. A.P.J. Abdul Kalam"
                      value={formData.inspirationAuthor}
                      onChange={(e) => setFormData((p) => ({ ...p, inspirationAuthor: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="greetings" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label>Greetings Section Text</Label>
                  <Input
                    placeholder="e.g. Wish you all the best,"
                    value={formData.greetingsText}
                    onChange={(e) => setFormData((p) => ({ ...p, greetingsText: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Displayed above the name and designation at the bottom. Name and designation are
                    taken from the Hero section.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaderPagesAdmin;
