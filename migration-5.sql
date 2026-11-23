-- Jalankan di Supabase SQL Editor
alter table site_settings add column announcement text;
update site_settings set announcement = 'Gratis ongkir untuk semua produk' where id = 1;
