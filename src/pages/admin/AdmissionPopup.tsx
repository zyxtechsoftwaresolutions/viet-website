import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DataTable } from '@/components/admin/DataTable';
import {
  admissionPopupSettingsAPI,
  admissionLeadsAPI,
  type AdmissionPopupSettings,
  type AdmissionLead,
} from '@/lib/api';
import ImageUploadGuide from '@/components/admin/ImageUploadGuide';
import { IMAGE_SPECS } from '@/lib/adminImageSpecs';
import { toast } from 'sonner';
import {
  GraduationCap,
  Download,
  ExternalLink,
  Trash2,
  Save,
  Sheet,
  ImagePlus,
  X,
} from 'lucide-react';
import { uploadToSupabase } from '@/lib/storage';
import { compressAdmissionPopupImage } from '@/lib/admissionPopupImages';

const AdmissionPopupAdmin = () => {
  const [settings, setSettings] = useState<AdmissionPopupSettings | null>(null);
  const [leads, setLeads] = useState<AdmissionLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [testingSheets, setTestingSheets] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdmissionLead | null>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    delay_seconds: '2',
    spreadsheet_url: '',
    sheets_webhook_url: '',
  });
  const [popupImages, setPopupImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchAll = async () => {
    try {
      const [settingsData, leadsData] = await Promise.all([
        admissionPopupSettingsAPI.getAdmin(),
        admissionLeadsAPI.getAll(),
      ]);
      setSettings(settingsData);
      setLeads(leadsData);
      setForm({
        title: settingsData.title || '',
        subtitle: settingsData.subtitle || '',
        delay_seconds: String(settingsData.delay_seconds ?? 2),
        spreadsheet_url: settingsData.spreadsheet_url || '',
        sheets_webhook_url: settingsData.sheets_webhook_url || '',
      });
      setPopupImages(Array.isArray(settingsData.images) ? settingsData.images : []);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to load admission popup settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleToggle = async (enabled: boolean) => {
    if (!settings) return;
    try {
      const updated = await admissionPopupSettingsAPI.update({ is_enabled: enabled });
      setSettings(updated);
      toast.success(`Admission popup ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update toggle');
    }
  };

  const saveSettings = async (fields: Partial<{
    title: string;
    subtitle: string;
    delay_seconds: number;
    images: string[];
    spreadsheet_url: string | null;
    sheets_webhook_url: string | null;
  }>) => {
    setSaving(true);
    try {
      const updated = await admissionPopupSettingsAPI.update(fields);
      setSettings(updated);
      setForm({
        title: updated.title || '',
        subtitle: updated.subtitle || '',
        delay_seconds: String(updated.delay_seconds ?? 2),
        spreadsheet_url: updated.spreadsheet_url || '',
        sheets_webhook_url: updated.sheets_webhook_url || '',
      });
      setPopupImages(Array.isArray(updated.images) ? updated.images : []);
      toast.success('Settings saved');
      return updated;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContent = () =>
    saveSettings({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      delay_seconds: parseInt(form.delay_seconds, 10) || 2,
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImage(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        toast.info(`Optimizing & uploading ${file.name}…`);
        const optimized = await compressAdmissionPopupImage(file);
        const url = await uploadToSupabase(optimized, 'admission-popup', 'images');
        uploaded.push(url);
      }
      const nextImages = [...popupImages, ...uploaded];
      const updated = await saveSettings({ images: nextImages });
      setPopupImages(Array.isArray(updated.images) ? updated.images : nextImages);
      toast.success(uploaded.length === 1 ? 'Image added' : `${uploaded.length} images added`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const nextImages = popupImages.filter((_, i) => i !== index);
    try {
      const updated = await saveSettings({ images: nextImages });
      setPopupImages(Array.isArray(updated.images) ? updated.images : nextImages);
      toast.success('Image removed');
    } catch {
      // saveSettings already toasts on error
    }
  };

  const handleSaveSpreadsheetSettings = () =>
    saveSettings({
      spreadsheet_url: form.spreadsheet_url.trim() || null,
      sheets_webhook_url: form.sheets_webhook_url.trim() || null,
    });

  const handleTestSheets = async () => {
    const webhook = form.sheets_webhook_url.trim();
    if (!webhook) {
      toast.error('Paste your Google Apps Script Web App URL first, then Save.');
      return;
    }
    setTestingSheets(true);
    try {
      await admissionPopupSettingsAPI.update({
        spreadsheet_url: form.spreadsheet_url.trim() || null,
        sheets_webhook_url: webhook,
      });
      const result = await admissionPopupSettingsAPI.testSheetsWebhook(webhook);
      toast.success(result.message || 'Test row sent to spreadsheet');
      await fetchAll();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Spreadsheet test failed');
    } finally {
      setTestingSheets(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await admissionLeadsAPI.exportCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admission-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await admissionLeadsAPI.delete(deleteTarget.id);
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      toast.success('Entry removed');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-[#F58220]" />
          Admission Popup
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage the student enquiry popup shown on the website during admission season. Turn it off when the season ends.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Popup status</CardTitle>
            <CardDescription>
              When enabled, visitors see the admission form popup after the intro video (if any).
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {settings?.is_enabled ? 'Active' : 'Off'}
            </span>
            <Switch
              checked={!!settings?.is_enabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popup content</CardTitle>
          <CardDescription>Headline and timing shown on the public website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              rows={2}
              className="mt-1.5 resize-none"
            />
          </div>
          <div className="max-w-xs">
            <Label htmlFor="delay">Delay after page load (seconds)</Label>
            <Input
              id="delay"
              type="number"
              min={0}
              max={30}
              value={form.delay_seconds}
              onChange={(e) => setForm((f) => ({ ...f, delay_seconds: e.target.value }))}
              className="mt-1.5"
            />
          </div>
          <Button onClick={handleSaveContent} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : 'Save content'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popup images</CardTitle>
          <CardDescription>
            Images shown beside the enquiry form. Multiple images auto-scroll in the popup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild disabled={uploadingImage}>
              <label className="cursor-pointer">
                <ImagePlus className="h-4 w-4 mr-2 inline" />
                {uploadingImage ? 'Uploading…' : 'Upload images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            </Button>
            <ImageUploadGuide {...IMAGE_SPECS.admissionPopup} inline />
            <span className="text-sm text-muted-foreground">
              {popupImages.length} image{popupImages.length === 1 ? '' : 's'}
            </span>
          </div>

          {popupImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {popupImages.map((src, index) => (
                <div key={`${src}-${index}`} className="group relative aspect-[3/2] overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={src}
                    alt={`Popup image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-[3/2] max-w-sm items-center justify-center rounded-lg border border-dashed bg-muted/40 text-sm text-muted-foreground">
              No images yet — upload to show in the enquiry popup
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sheet className="h-5 w-5" />
            Google Spreadsheet
          </CardTitle>
          <CardDescription>
            Link your Google Sheet so every submission is appended automatically. Deploy the Apps Script from{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">scripts/google-sheets-admission-webhook.gs</code>{' '}
            and paste the Web App URL below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!form.sheets_webhook_url.trim() && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong>Spreadsheet not connected.</strong> Deploying the Apps Script alone is not enough — paste the
              Web App URL below, click <strong>Save spreadsheet settings</strong>, then{' '}
              <strong>Test spreadsheet connection</strong>.
            </div>
          )}
          <div>
            <Label htmlFor="spreadsheet">Spreadsheet link (for your reference)</Label>
            <Input
              id="spreadsheet"
              value={form.spreadsheet_url}
              onChange={(e) => setForm((f) => ({ ...f, spreadsheet_url: e.target.value }))}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="webhook">Google Sheets Webhook URL</Label>
            <Input
              id="webhook"
              value={form.sheets_webhook_url}
              onChange={(e) => setForm((f) => ({ ...f, sheets_webhook_url: e.target.value }))}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="mt-1.5"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleSaveSpreadsheetSettings} disabled={saving}>
              Save spreadsheet settings
            </Button>
            <Button
              variant="outline"
              onClick={handleTestSheets}
              disabled={testingSheets || !form.sheets_webhook_url.trim()}
            >
              {testingSheets ? 'Testing…' : 'Test spreadsheet connection'}
            </Button>
            {form.spreadsheet_url && (
              <Button variant="outline" asChild>
                <a href={form.spreadsheet_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open spreadsheet
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">Submissions ({leads.length})</CardTitle>
            <CardDescription>All student enquiries received through the popup.</CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport} disabled={exporting || leads.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={leads}
            getId={(item) => item.id}
            columns={[
              {
                key: 'created_at',
                header: 'Date',
                render: (item) =>
                  new Date(item.created_at).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
              },
              { key: 'name', header: 'Name' },
              { key: 'mobile', header: 'Mobile' },
              { key: 'email', header: 'Email' },
              { key: 'program', header: 'Programme' },
              { key: 'city', header: 'City' },
            ]}
            onDelete={(item) => setDeleteTarget(item)}
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove the enquiry from {deleteTarget?.name}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdmissionPopupAdmin;
