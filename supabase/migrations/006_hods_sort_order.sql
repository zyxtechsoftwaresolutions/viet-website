-- Add sort_order column to hods table
ALTER TABLE hods ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_hods_sort_order ON hods (sort_order DESC, designation, name);

-- Update existing hods records to have sequential sort_order based on designation hierarchy
-- Principal first, then HODs
UPDATE hods 
SET sort_order = CASE 
  WHEN LOWER(designation) LIKE '%principal%' THEN 1000
  WHEN LOWER(designation) LIKE '%hod%' OR LOWER(designation) LIKE '%head%' THEN 500
  ELSE 0
END
WHERE sort_order = 0;
