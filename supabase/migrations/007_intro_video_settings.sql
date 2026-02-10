-- Intro video settings table (single row configuration)
CREATE TABLE IF NOT EXISTS intro_video_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  video_url TEXT,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row (disabled, no video)
INSERT INTO intro_video_settings (id, video_url, is_enabled)
VALUES (1, NULL, false)
ON CONFLICT (id) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_intro_video_settings_id ON intro_video_settings (id);
