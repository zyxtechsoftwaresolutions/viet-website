-- Run once in Supabase SQL editor
-- Admission popup settings (singleton) and student inquiry leads

create table if not exists admission_popup_settings (
  id integer primary key default 1,
  is_enabled boolean not null default true,
  title text default 'Admissions Open 2025–26',
  subtitle text default 'Share your details and our admissions team will contact you shortly.',
  delay_seconds integer not null default 2,
  images jsonb default '[]'::jsonb,
  spreadsheet_url text,
  sheets_webhook_url text,
  updated_at timestamptz default now()
);

insert into admission_popup_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists admission_leads (
  id serial primary key,
  name text not null,
  mobile text not null,
  email text,
  program text,
  qualification text,
  city text,
  district text,
  message text,
  source text default 'popup',
  created_at timestamptz default now()
);

create index if not exists admission_leads_created_at_idx on admission_leads (created_at desc);
