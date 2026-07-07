-- Run once in Supabase Dashboard → SQL Editor
-- Fixes 403 when public website loads admin-uploaded images/videos
--
-- Also ensure each bucket is PUBLIC:
-- Storage → images → Configuration → Public bucket: ON
-- Storage → videos → Configuration → Public bucket: ON

-- Public read (anonymous website visitors)
DROP POLICY IF EXISTS "Public read images bucket" ON storage.objects;
CREATE POLICY "Public read images bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public read videos bucket" ON storage.objects;
CREATE POLICY "Public read videos bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Admin uploads from browser (anon key)
DROP POLICY IF EXISTS "Anon upload images bucket" ON storage.objects;
CREATE POLICY "Anon upload images bucket"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Anon upload videos bucket" ON storage.objects;
CREATE POLICY "Anon upload videos bucket"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Anon update images bucket" ON storage.objects;
CREATE POLICY "Anon update images bucket"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Anon update videos bucket" ON storage.objects;
CREATE POLICY "Anon update videos bucket"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');
