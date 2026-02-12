-- Add end time to events for from-to duration (start time = time, end time = time_end).
-- When now is between time and time_end, show "Event live"; after time_end show "Event completed".
ALTER TABLE events ADD COLUMN IF NOT EXISTS time_end TEXT;
