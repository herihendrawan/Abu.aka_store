-- Jalankan di Supabase SQL Editor (setelah schema.sql)
alter table products add column original_price numeric(12,0) check (original_price >= 0);
alter table site_settings
  add column logo_url text, add column address text,
  add column open_hours text, add column footer_text text;

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table articles enable row level security;
create policy "public read articles" on articles for select using (is_published = true);
create policy "admin all articles" on articles for all to authenticated using (true) with check (true);
