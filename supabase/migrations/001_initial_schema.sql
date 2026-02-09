-- VIET College Website - Supabase Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS (Admin authentication) ====================
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ANNOUNCEMENTS ====================
CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT DEFAULT 'notification',
  link TEXT DEFAULT '',
  is_external BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== NEWS ====================
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TICKER ====================
CREATE TABLE ticker (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== EVENTS ====================
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  link TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TRANSPORT ROUTES ====================
CREATE TABLE transport_routes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "from" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  stops INTEGER DEFAULT 0,
  time TEXT,
  frequency TEXT DEFAULT 'Morning & Evening',
  bus_no TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_contact_no TEXT NOT NULL,
  seating_capacity INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== CAROUSEL ====================
CREATE TABLE carousel (
  id BIGSERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  upload_type TEXT DEFAULT 'carousel',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PLACEMENT CAROUSEL ====================
CREATE TABLE placement_carousel (
  id BIGSERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== HERO VIDEOS ====================
CREATE TABLE hero_videos (
  id BIGSERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  poster TEXT,
  badge TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  button_text TEXT DEFAULT 'Apply Now',
  button_link TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DEPARTMENTS ====================
CREATE TABLE departments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stream TEXT NOT NULL,
  level TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== FACULTY ====================
CREATE TABLE faculty (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT,
  qualification TEXT,
  email TEXT,
  phone TEXT,
  experience TEXT,
  department TEXT NOT NULL,
  image TEXT,
  resume TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== HODs ====================
CREATE TABLE hods (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT,
  qualification TEXT,
  email TEXT,
  phone TEXT,
  experience TEXT,
  department TEXT NOT NULL,
  image TEXT,
  resume TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== GALLERY ====================
CREATE TABLE gallery (
  id BIGSERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PLACEMENT SECTION (single row config) ====================
CREATE TABLE placement_section (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  highest_package_lpa NUMERIC DEFAULT 0,
  average_package_lpa NUMERIC DEFAULT 0,
  total_offers INTEGER DEFAULT 0,
  companies_visited INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== RECRUITERS ====================
CREATE TABLE recruiters (
  id BIGSERIAL PRIMARY KEY,
  logo TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== HOME GALLERY ====================
CREATE TABLE home_gallery (
  id BIGSERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== VIBE AT VIET ====================
CREATE TABLE vibe_at_viet (
  id BIGSERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  video TEXT,
  video_link TEXT,
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PAGES (dynamic content pages) ====================
CREATE TABLE pages (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  route TEXT NOT NULL,
  category TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DEPARTMENT PAGES (per-dept editable sections) ====================
CREATE TABLE department_pages (
  slug TEXT PRIMARY KEY,
  sections JSONB DEFAULT '{}',
  curriculum JSONB DEFAULT '{"programs":[]}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX idx_announcements_date ON announcements(date DESC);
CREATE INDEX idx_news_date ON news(date DESC);
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_faculty_department ON faculty(department);
CREATE INDEX idx_hods_department ON hods(department);
CREATE INDEX idx_gallery_department ON gallery(department);
CREATE INDEX idx_pages_slug ON pages(slug);

-- ==================== INSERT DEFAULT PLACEMENT SECTION ====================
INSERT INTO placement_section (title, subtitle, highest_package_lpa, average_package_lpa, total_offers, companies_visited)
SELECT 'Placement Excellence at VIET',
  'Our students are shaping the future at the world''s leading technology companies.',
  10, 4.5, 250, 53
WHERE NOT EXISTS (SELECT 1 FROM placement_section LIMIT 1);

-- ==================== STORAGE BUCKET ====================
-- Note: Run this in Supabase Dashboard > Storage or use the Storage API
-- Bucket name: 'uploads' - create as PUBLIC
-- Or run: INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
