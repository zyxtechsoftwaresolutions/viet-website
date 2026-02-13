-- Add allowed_sections for sub-admin role (JSONB array of section keys)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS allowed_sections JSONB DEFAULT '[]'::jsonb;

-- Ensure role column exists and has default
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'admin';
