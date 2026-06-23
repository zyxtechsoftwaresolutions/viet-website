-- Run once in Supabase Dashboard → SQL Editor
-- Adds columns required for featured events carousel and campus news photos

-- Events: admin "Featured" toggle (NULL = auto-feature upcoming/ongoing)
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured boolean DEFAULT NULL;

COMMENT ON COLUMN events.featured IS 'NULL = auto (upcoming/ongoing featured by default); true = force featured; false = hide from featured carousel';

-- News (Campus Updates / News & Campus Highlights): optional cover photo URL
ALTER TABLE news ADD COLUMN IF NOT EXISTS image text;

COMMENT ON COLUMN news.image IS 'Supabase Storage public URL for campus update card image';

-- Optional: only if you want timestamps on news rows (not required by the app)
-- ALTER TABLE news ADD COLUMN IF NOT EXISTS updated_at timestamptz;
