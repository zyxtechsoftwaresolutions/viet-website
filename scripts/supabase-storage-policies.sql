-- =============================================================================
-- Supabase Storage policies — READ-ONLY for the public (anon) key
-- Run in Supabase Dashboard → SQL Editor after any incident or deploy.
--
-- CRITICAL: Anonymous INSERT/UPDATE was the vector for overwriting
-- placement images, hero videos, etc. Do NOT recreate anon write policies.
-- Admin uploads go through the API (service role / signed upload URLs).
--
-- Buckets should still be PUBLIC for reads:
--   Storage → images → Configuration → Public bucket: ON
--   Storage → videos → Configuration → Public bucket: ON
-- =============================================================================

-- Public read (website visitors)
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

-- REMOVE anonymous write access (was used to hack media)
DROP POLICY IF EXISTS "Anon upload images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anon update images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anon update videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete videos bucket" ON storage.objects;

-- Also drop common alternate names if present
DROP POLICY IF EXISTS "Allow anon uploads to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads to videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Give anon users access to images folder" ON storage.objects;
DROP POLICY IF EXISTS "Give anon users access to videos folder 1oj01fe_0" ON storage.objects;
