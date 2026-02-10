-- Add sort_order column to faculty table
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_faculty_sort_order ON faculty (sort_order DESC, designation, name);

-- Update existing faculty records to have sequential sort_order based on designation hierarchy
-- Principal first, then HODs, then others
UPDATE faculty 
SET sort_order = CASE 
  WHEN LOWER(designation) LIKE '%principal%' THEN 1000
  WHEN LOWER(designation) LIKE '%hod%' OR LOWER(designation) LIKE '%head%' THEN 500
  ELSE 0
END
WHERE sort_order = 0;
