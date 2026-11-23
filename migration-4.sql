-- Jalankan di Supabase SQL Editor
alter table site_settings
  add column kelurahan text, add column kecamatan text, add column city text,
  add column province text, add column postal_code text, add column maps_url text;
