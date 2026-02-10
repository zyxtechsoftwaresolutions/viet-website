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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Video, Upload, Trash2, Play, X } from 'lucide-react';
import { introVideoSettingsAPI } from '@/lib/api';
import { uploadToSupabase } from '@/lib/storage';
import { toast } from 'sonner';

interface IntroVideoSettings {
  id: number;
  video_url: string | null;
  is_enabled: boolean;
}

const IntroVideo = () => {
  const [settings, setSettings] = useState<IntroVideoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await introVideoSettingsAPI.get();
      setSettings(data);
      if (data.video_url) {
        setPreviewUrl(data.video_url);
      }
    } catch (error: any) {
      console.error('Error fetching intro video settings:', error);
      toast.error(error.message || 'Failed to fetch intro video settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate video file
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    if (!settings) return;
    try {
      const updated = await introVideoSettingsAPI.update({
        is_enabled: enabled,
      });
      setSettings(updated);
      toast.success(`Intro video ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setIsUploading(true);
      let videoUrl: string | null = settings.video_url;

      if (videoFile) {
        toast.info('Uploading video...');
        videoUrl = await uploadToSupabase(videoFile, 'intro-video', 'videos');
        toast.success('Video uploaded successfully');
      }

      const updated = await introVideoSettingsAPI.update({
        video_url: videoUrl,
        is_enabled: settings.is_enabled,
      });

      setSettings(updated);
      setVideoFile(null);
      if (videoUrl) {
        setPreviewUrl(videoUrl);
      }
      toast.success('Intro video settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await introVideoSettingsAPI.delete();
      setSettings({ id: 1, video_url: null, is_enabled: false });
      setPreviewUrl('');
      setVideoFile(null);
      setDeleteDialogOpen(false);
      toast.success('Intro video deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete intro video');
    }
  };

  const clearPreview = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setVideoFile(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!settings) {
    return <div>Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intro Video Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage the intro video that plays when users first visit the website
        </p>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enabled" className="text-base font-medium">
              Enable Intro Video
            </Label>
            <p className="text-sm text-muted-foreground">
              Show the intro video when users first visit the website
            </p>
          </div>
          <Switch
            id="enabled"
            checked={settings.is_enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>

        {/* Video Upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video">Intro Video</Label>
            <p className="text-sm text-muted-foreground">
              Upload a video file (MP4, WebM, etc.). The video will play automatically when enabled.
            </p>
            <div className="flex items-center gap-4">
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="cursor-pointer max-w-md"
                disabled={isUploading}
              />
              {previewUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearPreview}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative border rounded-lg overflow-hidden bg-black max-w-2xl">
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-auto max-h-96"
                  onError={() => {
                    toast.error('Failed to load video preview');
                  }}
                />
              </div>
              {settings.video_url && (
                <p className="text-sm text-muted-foreground">
                  Current video: {settings.video_url.split('/').pop()}
                </p>
              )}
            </div>
          )}

          {/* Current Status */}
          {!previewUrl && !settings.video_url && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Video className="h-5 w-5" />
              <p className="text-sm">No video uploaded</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isUploading || (!videoFile && !settings.video_url)}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : videoFile ? 'Upload & Save' : 'Save Settings'}
          </Button>
          {settings.video_url && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isUploading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Video
            </Button>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="font-medium mb-2">About Intro Video</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>The intro video plays automatically when users first visit the website</li>
          <li>Users can skip the video by waiting for it to finish or clicking continue</li>
          <li>Recommended format: MP4 with H.264 codec for best compatibility</li>
          <li>Keep video file size reasonable for faster loading</li>
          <li>Video will be stored in Supabase Storage</li>
        </ul>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Intro Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the intro video? This will remove the video file and disable the intro video feature. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IntroVideo;
