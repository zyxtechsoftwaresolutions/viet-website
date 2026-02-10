-- Accreditations (main page: AUTONOMOUS, NAAC, UGC, ISO, AICTE) - admin uploads PDF per type
CREATE TABLE accreditations (
  key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT DEFAULT '',
  pdf_url TEXT,
  color TEXT DEFAULT 'from-slate-800 to-blue-950',
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Year-wise AICTE Affiliation Letters - admin CRUD; one can be marked "latest" (green)
CREATE TABLE aicte_affiliation_letters (
  id BIGSERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  pdf_url TEXT,
  is_latest BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure only one letter is latest
CREATE UNIQUE INDEX idx_aicte_one_latest ON aicte_affiliation_letters (is_latest) WHERE is_latest = true;

-- Seed default accreditation keys (admin fills pdf_url via panel)
INSERT INTO accreditations (key, name, description, logo, color, sort_order) VALUES
  ('AUTONOMOUS', 'AUTONOMOUS', 'UGC Autonomous Status Confirmation', '/logo-viet.png', 'from-slate-800 to-blue-950', 1),
  ('NAAC', 'NAAC A Grade', 'National Assessment and Accreditation Council', '/naac-A-logo.png', 'from-green-500 to-emerald-600', 2),
  ('UGC', 'UGC Recognition', 'University Grants Commission Recognition', '/UGC-logo.png', 'from-purple-500 to-violet-600', 3),
  ('ISO', 'ISO 9001:2015', 'International Organization for Standardization', '/iso-logo.png', 'from-slate-800 to-blue-950', 4),
  ('AICTE', 'AICTE Approved', 'All India Council for Technical Education', '/AICTE-Logo.png', 'from-cyan-500 to-blue-600', 5)
ON CONFLICT (key) DO NOTHING;

CREATE INDEX idx_aicte_affiliation_sort ON aicte_affiliation_letters (sort_order DESC, year DESC);
