-- Run once in Supabase SQL editor (if using Supabase for settings storage)
create table if not exists explore_path_video_settings (
  id integer primary key default 1,
  video_url text,
  updated_at timestamptz default now()
);

insert into explore_path_video_settings (id)
values (1)
on conflict (id) do nothing;
