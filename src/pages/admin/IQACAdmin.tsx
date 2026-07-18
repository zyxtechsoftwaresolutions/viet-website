import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import {
  DEFAULT_IQAC_CONTENT,
  initialsFromName,
  normalizeIqacContent,
  type IqacContent,
  type IqacDocGroup,
  type IqacDocItem,
  type IqacMember,
} from '@/lib/iqacContent';
import { Plus, Trash2, Upload, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const SLUG = 'iqac';
const ROUTE = '/iqac';

const emptyDocItem = (): IqacDocItem => ({
  title: '',
  year: String(new Date().getFullYear()),
  size: '',
  latest: false,
  fileUrl: '',
});

const emptyDocGroup = (): IqacDocGroup => ({
  category: '',
  label: '',
  tag: '',
  items: [emptyDocItem()],
});

const emptyMember = (): IqacMember => ({ name: '', role: '', dept: '', initials: '' });

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const IQACAdmin = () => {
  const [content, setContent] = useState<IqacContent>(DEFAULT_IQAC_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      setContent(normalizeIqacContent(page?.content || null));
    } catch {
      setContent(DEFAULT_IQAC_CONTENT);
      toast.error('Could not load IQAC page — showing defaults.');
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
      await pagesAPI.saveBySlug(SLUG, {
        title: 'IQAC',
        route: ROUTE,
        category: 'About',
        content: { ...content },
      });
      toast.success('IQAC page saved');
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  /* ── hero helpers ── */
  const setHero = (patch: Partial<IqacContent['hero']>) =>
    setContent((p) => ({ ...p, hero: { ...p.hero, ...patch } }));

  const setStat = (i: number, patch: Partial<IqacContent['hero']['stats'][number]>) =>
    setContent((p) => {
      const stats = p.hero.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
      return { ...p, hero: { ...p.hero, stats } };
    });

  /* ── documents helpers ── */
  const setGroup = (gi: number, patch: Partial<IqacDocGroup>) =>
    setContent((p) => ({
      ...p,
      documents: p.documents.map((g, idx) => (idx === gi ? { ...g, ...patch } : g)),
    }));

  const setDocItem = (gi: number, ii: number, patch: Partial<IqacDocItem>) =>
    setContent((p) => ({
      ...p,
      documents: p.documents.map((g, idx) =>
        idx === gi
          ? { ...g, items: g.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) }
          : g
      ),
    }));

  const handlePdfUpload = async (gi: number, ii: number, file: File) => {
    if (uploadingKey) return;
    const key = `${gi}-${ii}`;
    setUploadingKey(key);
    try {
      const url = await uploadToSupabase(file, 'iqac', 'images');
      setDocItem(gi, ii, { fileUrl: url, size: formatFileSize(file.size) });
      toast.success(`Uploaded ${file.name} — remember to Save changes.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  /* ── committee helpers ── */
  const setMember = (i: number, patch: Partial<IqacMember>) =>
    setContent((p) => ({
      ...p,
      committee: p.committee.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    }));

  /* ── about helpers ── */
  const setAbout = (patch: Partial<IqacContent['about']>) =>
    setContent((p) => ({ ...p, about: { ...p.about, ...patch } }));

  const setAboutContact = (patch: Partial<IqacContent['about']['contact']>) =>
    setContent((p) => ({
      ...p,
      about: { ...p.about, contact: { ...p.about.contact, ...patch } },
    }));

  return (
    <FacilityAdminLayout
      title="IQAC Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={handleSave}
    >
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="hero">Hero & Stats</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="committee">Committee</TabsTrigger>
          <TabsTrigger value="about">About & Contact</TabsTrigger>
        </TabsList>

        {/* ===== HERO ===== */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge (small text above title)</Label>
                <Input
                  value={content.hero.badge}
                  onChange={(e) => setHero({ badge: e.target.value })}
                  placeholder="Est. 2004 · NAAC Accredited"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Title — light part</Label>
                  <Input
                    value={content.hero.titleLight}
                    onChange={(e) => setHero({ titleLight: e.target.value })}
                    placeholder="Internal Quality"
                  />
                </div>
                <div>
                  <Label>Title — bold part</Label>
                  <Input
                    value={content.hero.titleBold}
                    onChange={(e) => setHero({ titleBold: e.target.value })}
                    placeholder="Assurance Cell"
                  />
                </div>
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setHero({ subtitle: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.hero.stats.map((s, i) => (
                <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
                  <div className="w-32">
                    <Label>Value</Label>
                    <Input value={s.val} onChange={(e) => setStat(i, { val: e.target.value })} placeholder="A+" />
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <Label>Description</Label>
                    <Input
                      value={s.desc}
                      onChange={(e) => setStat(i, { desc: e.target.value })}
                      placeholder="NAAC Grade"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() =>
                      setHero({ stats: content.hero.stats.filter((_, idx) => idx !== i) })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setHero({ stats: [...content.hero.stats, { val: '', desc: '' }] })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== DOCUMENTS ===== */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intro text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Text shown above the document list</Label>
                <Textarea
                  rows={2}
                  value={content.documentsIntro}
                  onChange={(e) => setContent((p) => ({ ...p, documentsIntro: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Contact notice — email</Label>
                  <Input
                    value={content.contactNotice.email}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        contactNotice: { ...p.contactNotice, email: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Contact notice — location</Label>
                  <Input
                    value={content.contactNotice.location}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        contactNotice: { ...p.contactNotice, location: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {content.documents.map((grp, gi) => (
            <Card key={gi}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">
                  {grp.category || `Category ${gi + 1}`}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => {
                    if (window.confirm(`Delete the whole "${grp.category || 'untitled'}" category and its files?`)) {
                      setContent((p) => ({
                        ...p,
                        documents: p.documents.filter((_, idx) => idx !== gi),
                      }));
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete category
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Category name</Label>
                    <Input
                      value={grp.category}
                      onChange={(e) => setGroup(gi, { category: e.target.value })}
                      placeholder="NAAC"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={grp.label}
                      onChange={(e) => setGroup(gi, { label: e.target.value })}
                      placeholder="National Assessment & Accreditation"
                    />
                  </div>
                  <div>
                    <Label>Badge tag (short)</Label>
                    <Input
                      value={grp.tag}
                      onChange={(e) => setGroup(gi, { tag: e.target.value.toUpperCase().slice(0, 5) })}
                      placeholder="NAAC"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {grp.items.map((item, ii) => {
                    const key = `${gi}-${ii}`;
                    return (
                      <div key={ii} className="rounded-lg border p-3 space-y-3">
                        <div className="grid gap-3 md:grid-cols-[1fr_110px_110px]">
                          <div>
                            <Label>Document title</Label>
                            <Input
                              value={item.title}
                              onChange={(e) => setDocItem(gi, ii, { title: e.target.value })}
                              placeholder="Self Study Report (SSR) 2024"
                            />
                          </div>
                          <div>
                            <Label>Year</Label>
                            <Input
                              value={item.year}
                              onChange={(e) => setDocItem(gi, ii, { year: e.target.value })}
                              placeholder="2024"
                            />
                          </div>
                          <div>
                            <Label>Size</Label>
                            <Input
                              value={item.size}
                              onChange={(e) => setDocItem(gi, ii, { size: e.target.value })}
                              placeholder="4.2 MB"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={item.latest}
                              onCheckedChange={(checked) => setDocItem(gi, ii, { latest: checked })}
                            />
                            Show "NEW" badge
                          </label>
                          <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" asChild>
                              <label className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-1" />
                                {uploadingKey === key ? 'Uploading…' : item.fileUrl ? 'Replace PDF' : 'Upload PDF'}
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePdfUpload(gi, ii, file);
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                            </Button>
                            {item.fileUrl ? (
                              <>
                                <a
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                >
                                  <FileText className="h-4 w-4" />
                                  View file
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => setDocItem(gi, ii, { fileUrl: '' })}
                                >
                                  Remove file
                                </Button>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">No PDF uploaded yet</span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 ml-auto"
                            onClick={() =>
                              setGroup(gi, { items: grp.items.filter((_, j) => j !== ii) })
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete document
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGroup(gi, { items: [...grp.items, emptyDocItem()] })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add document
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setContent((p) => ({ ...p, documents: [...p.documents, emptyDocGroup()] }))
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add category
          </Button>
        </TabsContent>

        {/* ===== COMMITTEE ===== */}
        <TabsContent value="committee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Committee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Intro text</Label>
                <Textarea
                  rows={2}
                  value={content.committeeIntro}
                  onChange={(e) => setContent((p) => ({ ...p, committeeIntro: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                {content.committee.map((m, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_90px_auto] items-end">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={m.name}
                          onChange={(e) =>
                            setMember(i, {
                              name: e.target.value,
                              initials: initialsFromName(e.target.value),
                            })
                          }
                          placeholder="Dr. Rajesh Kumar"
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          value={m.role}
                          onChange={(e) => setMember(i, { role: e.target.value })}
                          placeholder="IQAC Coordinator"
                        />
                      </div>
                      <div>
                        <Label>Department / office</Label>
                        <Input
                          value={m.dept}
                          onChange={(e) => setMember(i, { dept: e.target.value })}
                          placeholder="Dept. of Computer Science"
                        />
                      </div>
                      <div>
                        <Label>Initials</Label>
                        <Input
                          value={m.initials}
                          onChange={(e) => setMember(i, { initials: e.target.value.toUpperCase().slice(0, 2) })}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() =>
                          setContent((p) => ({
                            ...p,
                            committee: p.committee.filter((_, idx) => idx !== i),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent((p) => ({ ...p, committee: [...p.committee, emptyMember()] }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ABOUT & CONTACT ===== */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the cell</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Heading</Label>
                <Input
                  value={content.about.heading}
                  onChange={(e) => setAbout({ heading: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label>Paragraphs</Label>
                {content.about.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Textarea
                      rows={3}
                      value={p}
                      onChange={(e) =>
                        setAbout({
                          paragraphs: content.about.paragraphs.map((x, idx) =>
                            idx === i ? e.target.value : x
                          ),
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 flex-shrink-0"
                      onClick={() =>
                        setAbout({ paragraphs: content.about.paragraphs.filter((_, idx) => idx !== i) })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAbout({ paragraphs: [...content.about.paragraphs, ''] })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add paragraph
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Core functions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.about.coreFunctions.map((fn, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground w-6">{String(i + 1).padStart(2, '0')}</span>
                  <Input
                    value={fn}
                    onChange={(e) =>
                      setAbout({
                        coreFunctions: content.about.coreFunctions.map((x, idx) =>
                          idx === i ? e.target.value : x
                        ),
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 flex-shrink-0"
                    onClick={() =>
                      setAbout({ coreFunctions: content.about.coreFunctions.filter((_, idx) => idx !== i) })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAbout({ coreFunctions: [...content.about.coreFunctions, ''] })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add function
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact details (About tab)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Address</Label>
                <Textarea
                  rows={2}
                  value={content.about.contact.address}
                  onChange={(e) => setAboutContact({ address: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={content.about.contact.phone}
                    onChange={(e) => setAboutContact({ phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.about.contact.email}
                    onChange={(e) => setAboutContact({ email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Office hours</Label>
                  <Input
                    value={content.about.contact.hours}
                    onChange={(e) => setAboutContact({ hours: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default IQACAdmin;
