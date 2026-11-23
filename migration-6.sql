-- Jalankan di Supabase SQL Editor
alter table site_settings add column shipping_label text, add column delivery_area text;
update site_settings set shipping_label = 'Gratis ongkir', delivery_area = 'Pekanbaru' where id = 1;
update site_settings set announcement = 'Gratis ongkir area Pekanbaru'
  where id = 1 and announcement = 'Gratis ongkir untuk semua produk';
