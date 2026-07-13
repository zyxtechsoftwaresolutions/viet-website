import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { pagesAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { imgUrl } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { ExternalLink, Plus, Trash2, Save, RefreshCw, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import {
  DEFAULT_UG_PG_EXAMINATIONS_CONTENT,
  normalizeUgPgExaminationsContent,
  createEmptyNotice,
  createEmptyDocument,
  createEmptyDocumentGroup,
  createEmptyResultPortal,
  createEmptyContact,
  createEmptyStat,
  type UgPgExaminationsContent,
  type ExamDocument,
  type ExamDocumentGroup,
  type ExamContact,
  type ExamSectionMeta,
} from '@/lib/ugPgExaminationsContent';

const SLUG = 'ug-pg-examinations';
const UPLOAD_FOLDER = 'examinations';

const SectionMetaFields = ({
  value,
  onChange,
}: {
  value: ExamSectionMeta;
  onChange: (patch: Partial<ExamSectionMeta>) => void;
}) => (
  <div className="grid gap-3 md:grid-cols-3">
    <div className="space-y-2">
      <Label>Section label</Label>
      <Input value={value.label} onChange={(e) => onChange({ label: e.target.value })} />
    </div>
    <div className="space-y-2 md:col-span-2">
      <Label>Title</Label>
      <Input value={value.title} onChange={(e) => onChange({ title: e.target.value })} />
    </div>
    <div className="space-y-2 md:col-span-3">
      <Label>Description</Label>
      <Textarea rows={2} value={value.description} onChange={(e) => onChange({ description: e.target.value })} />
    </div>
  </div>
);

const DocumentEditor = ({
  doc,
  onChange,
  onRemove,
  onUpload,
  uploading,
}: {
  doc: ExamDocument;
  onChange: (patch: Partial<ExamDocument>) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
  uploading?: boolean;
}) => (
  <div className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-end">
    <div className="flex-1 space-y-2">
      <Label>Document title</Label>
      <Input value={doc.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Document name" />
    </div>
    <div className="flex-1 space-y-2">
      <Label>File URL / link</Label>
      <Input value={doc.href || ''} onChange={(e) => onChange({ href: e.target.value })} placeholder="https://… or upload PDF" />
    </div>
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
        <label className="cursor-pointer">
          <Upload className="h-4 w-4 mr-1" />
          PDF
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  </div>
);

const DocumentGroupEditor = ({
  group,
  onChange,
  onRemove,
  onUploadDoc,
  uploadingKey,
}: {
  group: ExamDocumentGroup;
  onChange: (patch: Partial<ExamDocumentGroup>) => void;
  onRemove: () => void;
  onUploadDoc: (docId: string, file: File) => void;
  uploadingKey?: string | null;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Label>Group title</Label>
            <Input value={group.title} onChange={(e) => onChange({ title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Empty message (when no documents)</Label>
            <Input
              value={group.emptyMessage || ''}
              onChange={(e) => onChange({ emptyMessage: e.target.value })}
              placeholder="Documents will be published here shortly."
            />
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      {group.documents.map((doc) => (
        <DocumentEditor
          key={doc.id}
          doc={doc}
          uploading={uploadingKey === doc.id}
          onChange={(patch) =>
            onChange({
              documents: group.documents.map((d) => (d.id === doc.id ? { ...d, ...patch } : d)),
            })
          }
          onRemove={() => onChange({ documents: group.documents.filter((d) => d.id !== doc.id) })}
          onUpload={(file) => onUploadDoc(doc.id, file)}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange({ documents: [...group.documents, createEmptyDocument()] })}
      >
        <Plus className="h-4 w-4 mr-1" /> Add document
      </Button>
    </CardContent>
  </Card>
);

const UGPGExaminationsAdmin = () => {
  const [content, setContent] = useState<UgPgExaminationsContent>(DEFAULT_UG_PG_EXAMINATIONS_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [coeImageFile, setCoeImageFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await pagesAPI.getBySlug(SLUG);
      if (page?.content) {
        setContent(normalizeUgPgExaminationsContent(page.content));
      } else {
        setContent(structuredClone(DEFAULT_UG_PG_EXAMINATIONS_CONTENT));
        toast.info('Exam Cell page not in database yet — saving will create it.');
      }
      setHeroImageFile(null);
      setCoeImageFile(null);
    } catch {
      setContent(structuredClone(DEFAULT_UG_PG_EXAMINATIONS_CONTENT));
      toast.error('Could not load Exam Cell. Defaults shown — Save will create the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const uploadPdf = async (file: File): Promise<string> => {
    toast.info(`Uploading ${file.name}…`);
    return uploadToSupabase(file, UPLOAD_FOLDER, 'images');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let heroImage = content.hero.image || '';
      if (heroImageFile) {
        toast.info('Uploading hero image…');
        heroImage = await uploadToSupabase(heroImageFile, UPLOAD_FOLDER, 'images');
      }

      let coeImage = content.controllerOfExaminations.image || '';
      if (coeImageFile) {
        toast.info('Uploading Controller of Examinations photo…');
        coeImage = await uploadToSupabase(coeImageFile, UPLOAD_FOLDER, 'images');
      }

      const payloadContent: UgPgExaminationsContent = {
        ...content,
        hero: { ...content.hero, image: heroImage || undefined },
        controllerOfExaminations: {
          ...content.controllerOfExaminations,
          image: coeImage || undefined,
        },
      };

      await pagesAPI.saveBySlug(SLUG, {
        slug: SLUG,
        title: 'UG & PG Examinations',
        route: '/examinations/ug-pg',
        category: 'Examinations',
        content: payloadContent,
      });

      setContent(payloadContent);
      setHeroImageFile(null);
      setCoeImageFile(null);
      toast.success('Exam Cell updated successfully');
      await load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save Exam Cell';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const moveItem = <T,>(list: T[], index: number, direction: -1 | 1): T[] => {
    const next = index + direction;
    if (next < 0 || next >= list.length) return list;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    return copy;
  };

  const updateGroupedSection = (
    key: 'academicCalendar' | 'academicRegulation' | 'circulars' | 'syllabus',
    patch: Partial<ExamSectionMeta & { groups?: ExamDocumentGroup[]; placeholderText?: string }>
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const uploadDocInGroups = async (
    key: 'academicCalendar' | 'academicRegulation' | 'circulars' | 'syllabus',
    groupId: string,
    docId: string,
    file: File
  ) => {
    setUploadingKey(docId);
    try {
      const url = await uploadPdf(file);
      setContent((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          groups: prev[key].groups.map((g) =>
            g.id !== groupId
              ? g
              : {
                  ...g,
                  documents: g.documents.map((d) => (d.id === docId ? { ...d, href: url } : d)),
                }
          ),
        },
      }));
      toast.success('PDF uploaded — click Save Changes to publish');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
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
          <h1 className="text-3xl font-bold">Exam Cell (UG &amp; PG)</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Fully edit notices, documents, results portals, and contacts. Changes appear on{' '}
            <code className="text-xs bg-muted px-1 rounded">/examinations/ug-pg</code> after you save.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.open('/examinations/ug-pg', '_blank')}>
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

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero & Stats</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="controller">Controller of Examinations</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="regulation">Regulation</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="timetable">Time Table</TabsTrigger>
          <TabsTrigger value="circulars">Circulars</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Top banner on the Exam Cell page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Input
                    value={content.hero.badge}
                    onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.hero.title}
                    onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary CTA label</Label>
                  <Input
                    value={content.hero.primaryCtaLabel}
                    onChange={(e) =>
                      setContent((p) => ({ ...p, hero: { ...p.hero, primaryCtaLabel: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA label</Label>
                  <Input
                    value={content.hero.secondaryCtaLabel}
                    onChange={(e) =>
                      setContent((p) => ({ ...p, hero: { ...p.hero, secondaryCtaLabel: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Hero image URL</Label>
                  <Input
                    value={content.hero.image || ''}
                    onChange={(e) => setContent((p) => ({ ...p, hero: { ...p.hero, image: e.target.value } }))}
                    placeholder="/campus-hero.jpg or upload"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files?.[0] ?? null)}
                  />
                  {heroImageFile && (
                    <p className="text-xs text-muted-foreground">New image selected — Save to upload.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats strip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        setContent((p) => ({
                          ...p,
                          stats: p.stats.map((s, i) => (i === index ? { ...s, value: e.target.value } : s)),
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        setContent((p) => ({
                          ...p,
                          stats: p.stats.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)),
                        }))
                      }
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, stats: moveItem(p.stats, index, -1) }))}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, stats: moveItem(p.stats, index, 1) }))}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setContent((p) => ({ ...p, stats: p.stats.filter((_, i) => i !== index) }))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, stats: [...p.stats, createEmptyStat()] }))}>
                <Plus className="h-4 w-4 mr-1" /> Add stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notice board heading</CardTitle>
            </CardHeader>
            <CardContent>
              <SectionMetaFields
                value={content.noticesHeading}
                onChange={(patch) => setContent((p) => ({ ...p, noticesHeading: { ...p.noticesHeading, ...patch } }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notices</CardTitle>
              <CardDescription>Add, edit, reorder, or remove notice board items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.notices.map((notice, index) => (
                <div key={notice.id} className="rounded-lg border p-3 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={notice.title}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            notices: p.notices.map((n) => (n.id === notice.id ? { ...n, title: e.target.value } : n)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        value={notice.date}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            notices: p.notices.map((n) => (n.id === notice.id ? { ...n, date: e.target.value } : n)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Input
                        value={notice.type}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            notices: p.notices.map((n) => (n.id === notice.id ? { ...n, type: e.target.value } : n)),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Link / PDF URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={notice.link}
                          onChange={(e) =>
                            setContent((p) => ({
                              ...p,
                              notices: p.notices.map((n) => (n.id === notice.id ? { ...n, link: e.target.value } : n)),
                            }))
                          }
                        />
                        <Button type="button" variant="outline" size="sm" disabled={uploadingKey === notice.id} asChild>
                          <label className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-1" />
                            PDF
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (!file) return;
                                setUploadingKey(notice.id);
                                try {
                                  const url = await uploadPdf(file);
                                  setContent((p) => ({
                                    ...p,
                                    notices: p.notices.map((n) => (n.id === notice.id ? { ...n, link: url } : n)),
                                  }));
                                  toast.success('PDF uploaded — click Save Changes to publish');
                                } catch (err: unknown) {
                                  toast.error(err instanceof Error ? err.message : 'Upload failed');
                                } finally {
                                  setUploadingKey(null);
                                }
                              }}
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={Boolean(notice.isNew)}
                        onCheckedChange={(checked) =>
                          setContent((p) => ({
                            ...p,
                            notices: p.notices.map((n) =>
                              n.id === notice.id ? { ...n, isNew: checked === true } : n
                            ),
                          }))
                        }
                      />
                      Mark as New
                    </label>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, notices: moveItem(p.notices, index, -1) }))}>
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, notices: moveItem(p.notices, index, 1) }))}>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setContent((p) => ({ ...p, notices: p.notices.filter((n) => n.id !== notice.id) }))}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setContent((p) => ({ ...p, notices: [...p.notices, createEmptyNotice()] }))}>
                <Plus className="h-4 w-4 mr-1" /> Add notice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result viewing instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.resultInstructionsTitle}
                  onChange={(e) => setContent((p) => ({ ...p, resultInstructionsTitle: e.target.value }))}
                />
              </div>
              {content.resultInstructions.map((line, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={line}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        resultInstructions: p.resultInstructions.map((x, i) => (i === index ? e.target.value : x)),
                      }))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setContent((p) => ({
                        ...p,
                        resultInstructions: p.resultInstructions.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContent((p) => ({ ...p, resultInstructions: [...p.resultInstructions, ''] }))}
              >
                <Plus className="h-4 w-4 mr-1" /> Add instruction
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Controller of Examinations</CardTitle>
              <CardDescription>
                Profile photo, details, and message — similar to Principal / Chairman pages. Appears before Academic
                Calendar on the Exam Cell page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Section label</Label>
                  <Input
                    value={content.controllerOfExaminations.label}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, label: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section title</Label>
                  <Input
                    value={content.controllerOfExaminations.title}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, title: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input
                    value={content.controllerOfExaminations.designation}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, designation: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={content.controllerOfExaminations.name}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Input
                    value={content.controllerOfExaminations.qualification}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, qualification: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={content.controllerOfExaminations.phone || ''}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, phone: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={content.controllerOfExaminations.email || ''}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, email: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Short intro</Label>
                  <Textarea
                    rows={2}
                    value={content.controllerOfExaminations.intro}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, intro: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Photo URL</Label>
                  <Input
                    value={content.controllerOfExaminations.image || ''}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, image: e.target.value },
                      }))
                    }
                    placeholder="Upload a photo or paste image URL"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoeImageFile(e.target.files?.[0] ?? null)}
                  />
                  {coeImageFile && (
                    <p className="text-xs text-muted-foreground">New photo selected — Save to upload.</p>
                  )}
                  {content.controllerOfExaminations.image && (
                    <img
                      src={imgUrl(content.controllerOfExaminations.image)}
                      alt={content.controllerOfExaminations.name}
                      className="mt-2 h-40 w-auto rounded-lg object-cover border"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Message eyebrow</Label>
                  <Input
                    value={content.controllerOfExaminations.messageLabel}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, messageLabel: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message title</Label>
                  <Input
                    value={content.controllerOfExaminations.messageTitle}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, messageTitle: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Message</Label>
                  <Textarea
                    rows={8}
                    value={content.controllerOfExaminations.message}
                    onChange={(e) =>
                      setContent((p) => ({
                        ...p,
                        controllerOfExaminations: { ...p.controllerOfExaminations, message: e.target.value },
                      }))
                    }
                    placeholder="Write the Controller of Examinations message…"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {([
          ['calendar', 'academicCalendar', 'Academic Calendar'],
          ['regulation', 'academicRegulation', 'Academic Regulation'],
          ['circulars', 'circulars', 'Circulars'],
        ] as const).map(([tab, key, title]) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <SectionMetaFields
                  value={content[key]}
                  onChange={(patch) => updateGroupedSection(key, patch)}
                />
              </CardContent>
            </Card>
            {content[key].groups.map((group) => (
              <DocumentGroupEditor
                key={group.id}
                group={group}
                uploadingKey={uploadingKey}
                onChange={(patch) =>
                  updateGroupedSection(key, {
                    groups: content[key].groups.map((g) => (g.id === group.id ? { ...g, ...patch } : g)),
                  })
                }
                onRemove={() =>
                  updateGroupedSection(key, {
                    groups: content[key].groups.filter((g) => g.id !== group.id),
                  })
                }
                onUploadDoc={(docId, file) => uploadDocInGroups(key, group.id, docId, file)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                updateGroupedSection(key, {
                  groups: [...content[key].groups, createEmptyDocumentGroup()],
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> Add document group
            </Button>
          </TabsContent>
        ))}

        <TabsContent value="syllabus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Syllabus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SectionMetaFields
                value={content.syllabus}
                onChange={(patch) => updateGroupedSection('syllabus', patch)}
              />
              <div className="space-y-2">
                <Label>Placeholder text (shown when no document groups)</Label>
                <Textarea
                  rows={3}
                  value={content.syllabus.placeholderText}
                  onChange={(e) => updateGroupedSection('syllabus', { placeholderText: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
          {content.syllabus.groups.map((group) => (
            <DocumentGroupEditor
              key={group.id}
              group={group}
              uploadingKey={uploadingKey}
              onChange={(patch) =>
                updateGroupedSection('syllabus', {
                  groups: content.syllabus.groups.map((g) => (g.id === group.id ? { ...g, ...patch } : g)),
                })
              }
              onRemove={() =>
                updateGroupedSection('syllabus', {
                  groups: content.syllabus.groups.filter((g) => g.id !== group.id),
                })
              }
              onUploadDoc={(docId, file) => uploadDocInGroups('syllabus', group.id, docId, file)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              updateGroupedSection('syllabus', {
                groups: [...content.syllabus.groups, createEmptyDocumentGroup()],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add document group
          </Button>
        </TabsContent>

        <TabsContent value="timetable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Table</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SectionMetaFields
                value={content.timeTable}
                onChange={(patch) => setContent((p) => ({ ...p, timeTable: { ...p.timeTable, ...patch } }))}
              />
              {content.timeTable.documents.map((doc) => (
                <DocumentEditor
                  key={doc.id}
                  doc={doc}
                  uploading={uploadingKey === doc.id}
                  onChange={(patch) =>
                    setContent((p) => ({
                      ...p,
                      timeTable: {
                        ...p.timeTable,
                        documents: p.timeTable.documents.map((d) => (d.id === doc.id ? { ...d, ...patch } : d)),
                      },
                    }))
                  }
                  onRemove={() =>
                    setContent((p) => ({
                      ...p,
                      timeTable: {
                        ...p.timeTable,
                        documents: p.timeTable.documents.filter((d) => d.id !== doc.id),
                      },
                    }))
                  }
                  onUpload={async (file) => {
                    setUploadingKey(doc.id);
                    try {
                      const url = await uploadPdf(file);
                      setContent((p) => ({
                        ...p,
                        timeTable: {
                          ...p.timeTable,
                          documents: p.timeTable.documents.map((d) => (d.id === doc.id ? { ...d, href: url } : d)),
                        },
                      }));
                      toast.success('PDF uploaded — click Save Changes to publish');
                    } catch (err: unknown) {
                      toast.error(err instanceof Error ? err.message : 'Upload failed');
                    } finally {
                      setUploadingKey(null);
                    }
                  }}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent((p) => ({
                    ...p,
                    timeTable: { ...p.timeTable, documents: [...p.timeTable.documents, createEmptyDocument()] },
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SectionMetaFields
                value={content.results}
                onChange={(patch) => setContent((p) => ({ ...p, results: { ...p.results, ...patch } }))}
              />
              <div className="space-y-2">
                <Label>Login notice</Label>
                <Textarea
                  rows={2}
                  value={content.results.notice}
                  onChange={(e) => setContent((p) => ({ ...p, results: { ...p.results, notice: e.target.value } }))}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Result portals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.results.portals.map((portal, index) => (
                <div key={portal.id} className="rounded-lg border p-3 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={portal.title}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            results: {
                              ...p.results,
                              portals: p.results.portals.map((x) =>
                                x.id === portal.id ? { ...x, title: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={portal.subtitle}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            results: {
                              ...p.results,
                              portals: p.results.portals.map((x) =>
                                x.id === portal.id ? { ...x, subtitle: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Portal URL</Label>
                      <Input
                        value={portal.href || ''}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            results: {
                              ...p.results,
                              portals: p.results.portals.map((x) =>
                                x.id === portal.id ? { ...x, href: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, results: { ...p.results, portals: moveItem(p.results.portals, index, -1) } }))}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, results: { ...p.results, portals: moveItem(p.results.portals, index, 1) } }))}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setContent((p) => ({
                          ...p,
                          results: {
                            ...p.results,
                            portals: p.results.portals.filter((x) => x.id !== portal.id),
                          },
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent((p) => ({
                    ...p,
                    results: { ...p.results, portals: [...p.results.portals, createEmptyResultPortal()] },
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add portal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contacts section</CardTitle>
            </CardHeader>
            <CardContent>
              <SectionMetaFields
                value={content.contacts}
                onChange={(patch) => setContent((p) => ({ ...p, contacts: { ...p.contacts, ...patch } }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Officials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.contacts.people.map((person, index) => (
                <div key={person.id} className="rounded-lg border p-3 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    {(
                      [
                        ['role', 'Role'],
                        ['name', 'Name'],
                        ['qualification', 'Qualification'],
                        ['phone', 'Phone'],
                        ['email', 'Email'],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          value={(person[field as keyof ExamContact] as string) || ''}
                          onChange={(e) =>
                            setContent((p) => ({
                              ...p,
                              contacts: {
                                ...p.contacts,
                                people: p.contacts.people.map((x) =>
                                  x.id === person.id ? { ...x, [field]: e.target.value } : x
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Textarea
                        rows={2}
                        value={person.address}
                        onChange={(e) =>
                          setContent((p) => ({
                            ...p,
                            contacts: {
                              ...p.contacts,
                              people: p.contacts.people.map((x) =>
                                x.id === person.id ? { ...x, address: e.target.value } : x
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, contacts: { ...p.contacts, people: moveItem(p.contacts.people, index, -1) } }))}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setContent((p) => ({ ...p, contacts: { ...p.contacts, people: moveItem(p.contacts.people, index, 1) } }))}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setContent((p) => ({
                          ...p,
                          contacts: {
                            ...p.contacts,
                            people: p.contacts.people.filter((x) => x.id !== person.id),
                          },
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent((p) => ({
                    ...p,
                    contacts: { ...p.contacts, people: [...p.contacts.people, createEmptyContact()] },
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UGPGExaminationsAdmin;
