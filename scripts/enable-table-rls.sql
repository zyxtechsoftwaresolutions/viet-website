-- =============================================================================
-- Enable Row Level Security on CMS tables (API-only access)
-- Run in Supabase Dashboard → SQL Editor
--
-- Safe for this website because:
--   - Express API uses SUPABASE_SERVICE_ROLE_KEY, which BYPASSES RLS
--   - Browser never queries these tables with the anon key
--   - Admin uploads use signed URLs (storage policies), not table RLS
--
-- Effect: anon/authenticated clients cannot read or write CMS data directly.
-- Table Editor in the dashboard still works for project owners.
--
-- Tables that do not exist yet are skipped (no error).
-- =============================================================================

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'users',
    'announcements',
    'news',
    'ticker',
    'events',
    'transport_routes',
    'carousel',
    'placement_carousel',
    'hero_videos',
    'departments',
    'faculty',
    'hods',
    'placement_section',
    'recruiters',
    'home_gallery',
    'vibe_at_viet',
    'pages',
    'department_pages',
    'accreditations',
    'aicte_affiliation_letters',
    'intro_video_settings',
    'explore_path_video_settings',
    'faculty_settings',
    'visitor_count',
    'admission_popup_settings',
    'admission_leads',
    'gallery',
    'gallery_events',
    'gallery_images',
    'gallery_settings'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = t
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      RAISE NOTICE 'RLS enabled on public.%', t;
    ELSE
      RAISE NOTICE 'Skipped missing table public.%', t;
    END IF;
  END LOOP;
END $$;

-- Drop any overly permissive public/anon policies if they were added earlier.
-- (Service role does not need policies; it bypasses RLS.)
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY[
        'users',
        'announcements',
        'news',
        'ticker',
        'events',
        'transport_routes',
        'carousel',
        'placement_carousel',
        'hero_videos',
        'departments',
        'faculty',
        'hods',
        'placement_section',
        'recruiters',
        'home_gallery',
        'vibe_at_viet',
        'pages',
        'department_pages',
        'accreditations',
        'aicte_affiliation_letters',
        'intro_video_settings',
        'explore_path_video_settings',
        'faculty_settings',
        'visitor_count',
        'admission_popup_settings',
        'admission_leads',
        'gallery',
        'gallery_events',
        'gallery_images',
        'gallery_settings'
      ])
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      r.policyname,
      r.tablename
    );
    RAISE NOTICE 'Dropped policy % on public.%', r.policyname, r.tablename;
  END LOOP;
END $$;

-- Optional verification: list RLS status for CMS tables
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname = ANY (ARRAY[
    'users',
    'announcements',
    'news',
    'ticker',
    'events',
    'transport_routes',
    'carousel',
    'placement_carousel',
    'hero_videos',
    'departments',
    'faculty',
    'hods',
    'placement_section',
    'recruiters',
    'home_gallery',
    'vibe_at_viet',
    'pages',
    'department_pages',
    'accreditations',
    'aicte_affiliation_letters',
    'intro_video_settings',
    'explore_path_video_settings',
    'faculty_settings',
    'visitor_count',
    'admission_popup_settings',
    'admission_leads'
  ])
ORDER BY c.relname;
