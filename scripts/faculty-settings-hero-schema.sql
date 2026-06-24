-- Run once in Supabase Dashboard → SQL Editor
-- Adds faculty page hero section columns (optional — app also stores these in faculty-settings.json)

create table if not exists faculty_settings (
  id integer primary key default 1,
  sort_by text not null default 'custom',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into faculty_settings (id)
values (1)
on conflict (id) do nothing;

alter table faculty_settings add column if not exists hero_badge text default 'Faculty';
alter table faculty_settings add column if not exists hero_title text default 'Faculty';
alter table faculty_settings add column if not exists hero_subtitle text default 'Our faculty across all departments and streams.';
alter table faculty_settings add column if not exists hero_background_image text;
