-- Images bucket: carousel, gallery, events, faculty, recruiters, etc. Uploaded from admin (Supabase Storage).
-- Public bucket so img/video URLs work on the frontend.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "images_public_select" ON storage.objects;
CREATE POLICY "images_public_select" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "images_anon_insert" ON storage.objects;
CREATE POLICY "images_anon_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "images_anon_update" ON storage.objects;
CREATE POLICY "images_anon_update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

DROP POLICY IF EXISTS "images_anon_delete" ON storage.objects;
CREATE POLICY "images_anon_delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');
