import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import FacilityAdminLayout from '@/components/admin/facility/FacilityAdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import {
  DEFAULT_RD_CONTENT,
  normalizeRdContent,
  type RdContent,
  type RdCommitteeMember,
  type RdCoordinator,
  type RdPersonWithMeta,
  type RdRoleItem,
} from '@/lib/rdContent';

const SLUG = 'research-development';
const ROUTE = '/research-development';

const ResearchDevelopmentAdmin = () => {
  const [content, setContent] = useState<RdContent>(DEFAULT_RD_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [galleryBatchDepartment, setGalleryBatchDepartment] = useState<string>('General');
  const [galleryBatchTitlePrefix, setGalleryBatchTitlePrefix] = useState<string>('');

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.resolveBySlug(SLUG);
      setContent(normalizeRdContent(page?.content));
    } catch {
      setContent(DEFAULT_RD_CONTENT);
      toast.error('Could not load R&D page. Showing defaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      await pagesAPI.saveBySlug(SLUG, {
        title: 'Research & Development',
        route: ROUTE,
        category: 'Academics',
        content,
      });
      toast.success('Research & Development page saved');
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateCommittee = (idx: number, patch: Partial<RdCommitteeMember>) =>
    setContent((p) => ({
      ...p,
      committee: p.committee.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));

  const updateCoordinator = (idx: number, patch: Partial<RdCoordinator>) =>
    setContent((p) => ({
      ...p,
      coordinators: p.coordinators.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));

  const uploadCoordinatorPhoto = async (idx: number, file: File) => {
    const key = `coordinator-${idx}`;
    if (uploadingKey) return;
    setUploadingKey(key);
    try {
      const url = await uploadToSupabase(file, 'research-development', 'images');
      updateCoordinator(idx, { photo: url });
      toast.success(`Uploaded photo — remember to Save changes.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  const uploadGalleryImages = async (files: File[]) => {
    if (files.length === 0) return;
    if (uploadingKey) return;
    const key = 'gallery-batch';
    setUploadingKey(key);
    try {
      const newItems = [];
      for (const file of files) {
        const url = await uploadToSupabase(file, 'research-development', 'images');
        const stem = (file.name || '').replace(/\.[^/.]+$/, '');
        const title =
          `${galleryBatchTitlePrefix ? galleryBatchTitlePrefix.trim() + ' ' : ''}${stem}`.trim();
        newItems.push({
          image: url,
          title,
          department: galleryBatchDepartment.trim() || 'General',
        });
      }
      setContent((p) => ({ ...p, gallery: [...p.gallery, ...newItems] }));
      toast.success(`Uploaded ${newItems.length} gallery image(s) — remember to Save changes.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  const updateGalleryItem = (idx: number, patch: Partial<{ title: string; department: string; image: string }>) =>
    setContent((p) => ({
      ...p,
      gallery: p.gallery.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));

  const removeGalleryItem = (idx: number) =>
    setContent((p) => ({
      ...p,
      gallery: p.gallery.filter((_, i) => i !== idx),
    }));

  const updatePhdList = (
    key: 'phdHolders' | 'phdPursuing',
    idx: number,
    patch: Partial<RdPersonWithMeta>
  ) =>
    setContent((p) => ({
      ...p,
      [key]: p[key].map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));

  return (
    <FacilityAdminLayout
      title="Research & Development Page"
      publicRoute={ROUTE}
      loading={loading}
      saving={saving}
      onSave={onSave}
    >
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="vision">Vision / Roles</TabsTrigger>
          <TabsTrigger value="data">Committee / Tables</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="other">Policy / Others</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Hero content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge</Label>
                <Input
                  value={content.hero.badge}
                  onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Title (light)</Label>
                  <Input
                    value={content.hero.titleLight}
                    onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, titleLight: e.target.value } }))}
                  />
                </div>
                <div>
                  <Label>Title (bold)</Label>
                  <Input
                    value={content.hero.titleBold}
                    onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, titleBold: e.target.value } }))}
                  />
                </div>
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hero stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {content.hero.stats.map((item, idx) => (
                <div key={idx} className="grid md:grid-cols-[1fr_2fr_auto] gap-3 items-end border rounded-lg p-3">
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={item.val}
                      onChange={(e) =>
                        setContent((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            stats: p.hero.stats.map((x, i) => (i === idx ? { ...x, val: e.target.value } : x)),
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={item.desc}
                      onChange={(e) =>
                        setContent((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            stats: p.hero.stats.map((x, i) => (i === idx ? { ...x, desc: e.target.value } : x)),
                          },
                        }))
                      }
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-red-500"
                    onClick={() => setContent((p) => ({ ...p, hero: { ...p.hero, stats: p.hero.stats.filter((_, i) => i !== idx) } }))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => setContent((p) => ({ ...p, hero: { ...p.hero, stats: [...p.hero.stats, { val: '', desc: '' }] } }))}
              >
                <Plus className="h-4 w-4 mr-1" /> Add stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>About section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Intro title</Label><Input value={content.about.introTitle} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, introTitle: e.target.value } }))} /></div>
              <div><Label>Intro paragraph 1</Label><Textarea rows={4} value={content.about.introParagraph1} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, introParagraph1: e.target.value } }))} /></div>
              <div><Label>Intro paragraph 2</Label><Textarea rows={4} value={content.about.introParagraph2} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, introParagraph2: e.target.value } }))} /></div>
              <div><Label>Cell title</Label><Input value={content.about.cellTitle} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, cellTitle: e.target.value } }))} /></div>
              <div><Label>Cell description</Label><Textarea rows={3} value={content.about.cellDescription} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, cellDescription: e.target.value } }))} /></div>
              <div><Label>Tagline</Label><Input value={content.about.tagline} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, tagline: e.target.value } }))} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Objectives</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Objectives heading</Label><Input value={content.about.objectivesTitle} onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, objectivesTitle: e.target.value } }))} /></div>
              {content.about.objectives.map((obj, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <Input value={obj.title} placeholder="Title" onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, objectives: p.about.objectives.map((x, i) => i === idx ? { ...x, title: e.target.value } : x) } }))} />
                  <Textarea rows={2} value={obj.text} placeholder="Description" onChange={(e) => setContent((p) => ({ ...p, about: { ...p.about, objectives: p.about.objectives.map((x, i) => i === idx ? { ...x, text: e.target.value } : x) } }))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Director</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={content.director.name} onChange={(e) => setContent((p) => ({ ...p, director: { ...p.director, name: e.target.value } }))} /></div>
              <div><Label>Role label</Label><Input value={content.director.roleLabel} onChange={(e) => setContent((p) => ({ ...p, director: { ...p.director, roleLabel: e.target.value } }))} /></div>
              <div><Label>Designation</Label><Input value={content.director.designation} onChange={(e) => setContent((p) => ({ ...p, director: { ...p.director, designation: e.target.value } }))} /></div>
              <div><Label>Department</Label><Input value={content.director.department} onChange={(e) => setContent((p) => ({ ...p, director: { ...p.director, department: e.target.value } }))} /></div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} value={content.director.description} onChange={(e) => setContent((p) => ({ ...p, director: { ...p.director, description: e.target.value } }))} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Vision and mission</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Vision</Label><Textarea rows={3} value={content.visionMission.vision} onChange={(e) => setContent((p) => ({ ...p, visionMission: { ...p.visionMission, vision: e.target.value } }))} /></div>
              {content.visionMission.missionPoints.map((m, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={m} onChange={(e) => setContent((p) => ({ ...p, visionMission: { ...p.visionMission, missionPoints: p.visionMission.missionPoints.map((x, i) => i === idx ? e.target.value : x) } }))} />
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => setContent((p) => ({ ...p, visionMission: { ...p.visionMission, missionPoints: p.visionMission.missionPoints.filter((_, i) => i !== idx) } }))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, visionMission: { ...p.visionMission, missionPoints: [...p.visionMission.missionPoints, ''] } }))}><Plus className="h-4 w-4 mr-1" />Add mission point</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Roles cards</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {content.roles.map((item: RdRoleItem, idx) => (
                <div key={idx} className="grid md:grid-cols-[1fr_2fr_auto] gap-3 items-end border rounded-lg p-3">
                  <Input value={item.role} placeholder="Role title" onChange={(e) => setContent((p) => ({ ...p, roles: p.roles.map((x, i) => i === idx ? { ...x, role: e.target.value } : x) }))} />
                  <Input value={item.desc} placeholder="Description" onChange={(e) => setContent((p) => ({ ...p, roles: p.roles.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x) }))} />
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => setContent((p) => ({ ...p, roles: p.roles.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, roles: [...p.roles, { role: '', desc: '' }] }))}><Plus className="h-4 w-4 mr-1" />Add role</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>R&D Committee</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {content.committee.map((item, idx) => (
                <div key={idx} className="grid md:grid-cols-5 gap-3 border rounded-lg p-3">
                  <Input value={item.name} placeholder="Name" onChange={(e) => updateCommittee(idx, { name: e.target.value })} />
                  <Input value={item.designation} placeholder="Designation" onChange={(e) => updateCommittee(idx, { designation: e.target.value })} />
                  <Input value={item.role} placeholder="Role" onChange={(e) => updateCommittee(idx, { role: e.target.value })} />
                  <Input value={item.responsibility} placeholder="Responsibility" onChange={(e) => updateCommittee(idx, { responsibility: e.target.value })} />
                  <Input type="number" value={item.sno} placeholder="S.No" onChange={(e) => updateCommittee(idx, { sno: Number(e.target.value || 0) })} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Department coordinators</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {content.coordinators.map((item, idx) => (
                <div key={idx} className="grid md:grid-cols-5 gap-3 border rounded-lg p-3">
                  <Input value={item.name} placeholder="Name" onChange={(e) => updateCoordinator(idx, { name: e.target.value })} />
                  <Input value={item.department} placeholder="Department" onChange={(e) => updateCoordinator(idx, { department: e.target.value })} />
                  <Input value={item.position} placeholder="Position" onChange={(e) => updateCoordinator(idx, { position: e.target.value })} />

                  <div className="space-y-2">
                    <Label>Photo</Label>
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full aspect-[4/5] object-cover rounded-lg border bg-slate-50"
                      />
                    ) : (
                      <div className="w-full aspect-[4/5] rounded-lg border bg-slate-50 flex items-center justify-center text-xs text-muted-foreground">
                        No photo
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadCoordinatorPhoto(idx, file);
                        e.target.value = '';
                      }}
                      disabled={uploadingKey === `coordinator-${idx}`}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 px-2"
                        onClick={() => updateCoordinator(idx, { photo: '' })}
                        disabled={!item.photo}
                      >
                        Remove
                      </Button>
                      {uploadingKey === `coordinator-${idx}` && (
                        <span className="text-xs text-slate-500">Uploading...</span>
                      )}
                    </div>
                  </div>

                  <Input
                    type="number"
                    value={item.sno}
                    placeholder="S.No"
                    onChange={(e) => updateCoordinator(idx, { sno: Number(e.target.value || 0) })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ph.D holders</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-[360px] overflow-y-auto">
              {content.phdHolders.map((item, idx) => (
                <div key={idx} className="grid md:grid-cols-5 gap-2">
                  <Input value={item.name} onChange={(e) => updatePhdList('phdHolders', idx, { name: e.target.value })} />
                  <Input value={item.designation} onChange={(e) => updatePhdList('phdHolders', idx, { designation: e.target.value })} />
                  <Input value={item.department} onChange={(e) => updatePhdList('phdHolders', idx, { department: e.target.value })} />
                  <Input type="number" value={item.experience} onChange={(e) => updatePhdList('phdHolders', idx, { experience: Number(e.target.value || 0) })} />
                  <Input type="number" value={item.sno} onChange={(e) => updatePhdList('phdHolders', idx, { sno: Number(e.target.value || 0) })} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ph.D pursuing</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-[360px] overflow-y-auto">
              {content.phdPursuing.map((item, idx) => (
                <div key={idx} className="grid md:grid-cols-5 gap-2">
                  <Input value={item.name} onChange={(e) => updatePhdList('phdPursuing', idx, { name: e.target.value })} />
                  <Input value={item.designation} onChange={(e) => updatePhdList('phdPursuing', idx, { designation: e.target.value })} />
                  <Input value={item.department} onChange={(e) => updatePhdList('phdPursuing', idx, { department: e.target.value })} />
                  <Input type="number" value={item.experience} onChange={(e) => updatePhdList('phdPursuing', idx, { experience: Number(e.target.value || 0) })} />
                  <Input type="number" value={item.sno} onChange={(e) => updatePhdList('phdPursuing', idx, { sno: Number(e.target.value || 0) })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Upload R&amp;D gallery images</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Department (applies to all uploaded images)</Label>
                  <Input value={galleryBatchDepartment} onChange={(e) => setGalleryBatchDepartment(e.target.value)} />
                </div>
                <div>
                  <Label>Title prefix (optional)</Label>
                  <Input
                    value={galleryBatchTitlePrefix}
                    onChange={(e) => setGalleryBatchTitlePrefix(e.target.value)}
                    placeholder="e.g. Workshop"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    uploadGalleryImages(files);
                    e.target.value = '';
                  }}
                  disabled={uploadingKey === 'gallery-batch'}
                />
                {uploadingKey === 'gallery-batch' && <p className="text-xs text-muted-foreground">Uploading...</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Current gallery</CardTitle></CardHeader>
            <CardContent>
              {content.gallery.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                  No gallery images yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.gallery.map((item, idx) => (
                    <div key={`${item.image}-${idx}`} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || 'R&D work'}
                            className="w-full aspect-[4/3] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeGalleryItem(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="space-y-1">
                          <Label>Title</Label>
                          <Input value={item.title} onChange={(e) => updateGalleryItem(idx, { title: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label>Department</Label>
                          <Input
                            value={item.department}
                            onChange={(e) => updateGalleryItem(idx, { department: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Policy section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input value={content.policy.title} onChange={(e) => setContent((p) => ({ ...p, policy: { ...p.policy, title: e.target.value } }))} placeholder="Title" />
              <Textarea rows={3} value={content.policy.description} onChange={(e) => setContent((p) => ({ ...p, policy: { ...p.policy, description: e.target.value } }))} />
              <div className="grid md:grid-cols-2 gap-3">
                <Input value={content.policy.buttonText} onChange={(e) => setContent((p) => ({ ...p, policy: { ...p.policy, buttonText: e.target.value } }))} placeholder="Button text" />
                <Input value={content.policy.buttonUrl} onChange={(e) => setContent((p) => ({ ...p, policy: { ...p.policy, buttonUrl: e.target.value } }))} placeholder="Button URL" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Research areas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {content.researchAreas.map((area, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={area} onChange={(e) => setContent((p) => ({ ...p, researchAreas: p.researchAreas.map((x, i) => i === idx ? e.target.value : x) }))} />
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => setContent((p) => ({ ...p, researchAreas: p.researchAreas.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, researchAreas: [...p.researchAreas, ''] }))}><Plus className="h-4 w-4 mr-1" />Add research area</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FacilityAdminLayout>
  );
};

export default ResearchDevelopmentAdmin;
