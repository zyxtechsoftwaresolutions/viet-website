-- Run once in Supabase SQL editor: separate hero media for desktop vs mobile
ALTER TABLE hero_videos ADD COLUMN IF NOT EXISTS mobile_src text;
ALTER TABLE hero_videos ADD COLUMN IF NOT EXISTS mobile_poster text;

COMMENT ON COLUMN hero_videos.src IS 'Desktop hero video URL';
COMMENT ON COLUMN hero_videos.poster IS 'Desktop hero photo fallback URL';
COMMENT ON COLUMN hero_videos.mobile_src IS 'Mobile hero video URL';
COMMENT ON COLUMN hero_videos.mobile_poster IS 'Mobile hero photo fallback URL';
