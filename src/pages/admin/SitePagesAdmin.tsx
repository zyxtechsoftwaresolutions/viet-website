import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pagesAPI } from '@/lib/api';
import {
  EXPECTED_SITE_PAGES,
  getAdminEditorPath,
  getPageEditorKind,
} from '@/lib/sitePagesRegistry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ExternalLink,
  FileText,
  Pencil,
  RefreshCw,
  Building2,
  GraduationCap,
  Users,
} from 'lucide-react';

type DbPage = {
  id: number;
  slug: string;
  title: string;
  route: string;
  category: string;
  content?: Record<string, unknown>;
};

const CATEGORY_ORDER = ['About', 'Facilities', 'Placements', 'Academics', 'Campus', 'Examinations'];

const SitePagesAdmin = () => {
  const navigate = useNavigate();
  const [dbPages, setDbPages] = useState<DbPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<(typeof EXPECTED_SITE_PAGES)[number] | null>(null);
  const [selectedDb, setSelectedDb] = useState<DbPage | null>(null);
  const [form, setForm] = useState({ heroTitle: '', heroDescription: '', mainContent: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await pagesAPI.getAll();
      const raw = Array.isArray(data) ? data : [];
      setDbPages(
        raw.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          route: p.route,
          category: p.category || 'About',
          content: p.content || {},
        }))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to load pages');
      setDbPages([]);
    } finally {
      setLoading(false);
    }
  };

  const runSeed = async () => {
    setSeeding(true);
    try {
      const result = await pagesAPI.seed();
      toast.success(`Pages ready: ${result.created} created, ${result.skipped} already existed`);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const runRestore = async () => {
    if (!window.confirm('Restore page content from server backup (pages.json)? This replaces empty or smaller database rows with the saved backup.')) {
      return;
    }
    setRestoring(true);
    try {
      const result = await pagesAPI.restoreBackup(false);
      toast.success(`Restored ${result.restored} page(s), skipped ${result.skipped}`);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Restore failed');
    } finally {
      setRestoring(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const bySlug = useMemo(() => {
    const map = new Map<string, DbPage>();
    dbPages.forEach((p) => map.set(p.slug, p));
    return map;
  }, [dbPages]);

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof EXPECTED_SITE_PAGES>();
    EXPECTED_SITE_PAGES.forEach((meta) => {
      const cat = meta.category;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(meta);
    });
    return CATEGORY_ORDER.filter((c) => groups.has(c)).map((c) => ({
      category: c,
      pages: groups.get(c)!,
    }));
  }, []);

  const openGenericEdit = (meta: (typeof EXPECTED_SITE_PAGES)[number]) => {
    const db = bySlug.get(meta.slug) || null;
    setSelected(meta);
    setSelectedDb(db);
    const content = (db?.content || {}) as Record<string, any>;
    const hero = content.hero || {};
    setForm({
      heroTitle: hero.title || meta.title,
      heroDescription: hero.description || '',
      mainContent: content.mainContent || content.message || '',
    });
    setEditOpen(true);
  };

  const handleEdit = (meta: (typeof EXPECTED_SITE_PAGES)[number]) => {
    const kind = getPageEditorKind(meta.slug, meta.category);
    if (kind === 'generic') {
      openGenericEdit(meta);
      return;
    }
    navigate(getAdminEditorPath(meta.slug, meta.category));
  };

  const saveGeneric = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const payload = {
        slug: selected.slug,
        title: selected.title,
        route: selected.route,
        category: selected.category,
        content: {
          ...(selectedDb?.content || {}),
          hero: {
            ...((selectedDb?.content as any)?.hero || {}),
            title: form.heroTitle,
            description: form.heroDescription,
          },
          mainContent: form.mainContent,
        },
      };
      if (selectedDb?.id) {
        await pagesAPI.update(selectedDb.id, payload);
      } else {
        await pagesAPI.create(payload);
      }
      toast.success(`${selected.title} saved`);
      setEditOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const categoryIcon = (cat: string) => {
    if (cat === 'Facilities') return Building2;
    if (cat === 'Placements') return GraduationCap;
    if (cat === 'About') return Users;
    return FileText;
  };

  if (loading && dbPages.length === 0) {
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
          <h1 className="text-2xl font-bold text-slate-900">All Site Pages</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Every public page is listed here. Content is stored in the database and updates live on the website.
            Facilities and leader pages open their dedicated editors; other pages edit inline.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={runRestore} disabled={restoring}>
            <RefreshCw className={`h-4 w-4 mr-2 ${restoring ? 'animate-spin' : ''}`} />
            Restore from backup
          </Button>
          <Button variant="outline" onClick={runSeed} disabled={seeding}>
            <RefreshCw className={`h-4 w-4 mr-2 ${seeding ? 'animate-spin' : ''}`} />
            Sync missing pages
          </Button>
        </div>
      </div>

      {grouped.map(({ category, pages }) => {
        const Icon = categoryIcon(category);
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="h-5 w-5" />
                {category}
              </CardTitle>
              <CardDescription>{pages.length} page(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pages.map((meta) => {
                const db = bySlug.get(meta.slug);
                const kind = getPageEditorKind(meta.slug, meta.category);
                return (
                  <div
                    key={meta.slug}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-900">{meta.title}</span>
                        {db ? (
                          <Badge variant="secondary" className="text-xs">In database</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">Missing — click Sync</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{kind}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{meta.route}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(meta.route, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleEdit(meta)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Also managed elsewhere</CardTitle>
          <CardDescription>Department pages, faculty, homepage sections, and accreditations</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/organizational-chart')}>Organizational Chart</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/department-pages')}>Department Pages</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/campus-life')}>Campus Life</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/facilities/center-of-excellence')}>Center of Excellence</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/examinations')}>Examinations</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/faculty')}>Faculty</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/accreditations')}>Accreditations PDFs</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/placement-section')}>Home Placement Section</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/recruiters')}>Recruiter Logos</Button>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Hero title</Label>
              <Input
                value={form.heroTitle}
                onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label>Hero description</Label>
              <Textarea
                rows={2}
                value={form.heroDescription}
                onChange={(e) => setForm((f) => ({ ...f, heroDescription: e.target.value }))}
              />
            </div>
            <div>
              <Label>Main content (HTML allowed)</Label>
              <Textarea
                rows={12}
                className="font-mono text-sm"
                value={form.mainContent}
                onChange={(e) => setForm((f) => ({ ...f, mainContent: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveGeneric} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SitePagesAdmin;
