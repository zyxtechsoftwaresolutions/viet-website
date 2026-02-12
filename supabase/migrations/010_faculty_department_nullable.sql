-- Make faculty.department nullable (faculty are now assigned to departments via department_pages.sections.faculty.facultyIds)
ALTER TABLE faculty ALTER COLUMN department DROP NOT NULL;
-- Remove index on department since it's no longer used for filtering
DROP INDEX IF EXISTS idx_faculty_department;
