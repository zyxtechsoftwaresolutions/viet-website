-- Videos bucket: hero videos and vibe-at-viet videos uploaded directly from admin (Supabase Storage).
-- Public bucket so <video src="..."> can load URLs without auth.
-- Run in Supabase SQL Editor if migrations don't run against Storage schema.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow anyone to read (public bucket)
DROP POLICY IF EXISTS "videos_public_select" ON storage.objects;
CREATE POLICY "videos_public_select" ON storage.objects FOR SELECT USING (bucket_id = 'videos');

-- Allow anon/authenticated to upload so admin (browser) can upload via supabase-js
DROP POLICY IF EXISTS "videos_anon_insert" ON storage.objects;
CREATE POLICY "videos_anon_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "videos_anon_update" ON storage.objects;
CREATE POLICY "videos_anon_update" ON storage.objects FOR UPDATE USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "videos_anon_delete" ON storage.objects;
CREATE POLICY "videos_anon_delete" ON storage.objects FOR DELETE USING (bucket_id = 'videos');
