-- Faculty settings (single row) - sort preference for public Faculty page
CREATE TABLE IF NOT EXISTS faculty_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  sort_by TEXT DEFAULT 'custom',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO faculty_settings (id, sort_by)
VALUES (1, 'custom')
ON CONFLICT (id) DO NOTHING;
