-- Visitor count for website footer (backend uses service role to read/increment)
CREATE TABLE IF NOT EXISTS visitor_count (
  id INT PRIMARY KEY DEFAULT 1,
  count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO visitor_count (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
