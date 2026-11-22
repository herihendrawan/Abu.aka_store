-- Jalankan di Supabase Dashboard > SQL Editor

-- 1. Tabel
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(12,0) not null check (price >= 0),
  image_url text,
  stock_status text not null default 'ready' check (stock_status in ('ready','habis')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pengaturan toko (hanya 1 baris)
create table site_settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'Toko Saya',
  whatsapp_number text not null default '628xxxxxxxxxx',
  hero_title text default 'Selamat datang',
  hero_subtitle text default 'Pesan mudah lewat WhatsApp',
  hero_image_url text,
  wa_template text default 'Halo, saya mau pesan: {produk} ({harga}). Jumlah: {jumlah}'
);
insert into site_settings (id) values (1);

-- 2. Auto update updated_at
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at before update on products
for each row execute function set_updated_at();

-- 3. Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table site_settings enable row level security;

-- Publik: hanya baca
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (is_active = true);
create policy "public read settings" on site_settings for select using (true);

-- Admin (user login): akses penuh
create policy "admin all categories" on categories for all to authenticated using (true) with check (true);
create policy "admin all products" on products for all to authenticated using (true) with check (true);
create policy "admin all settings" on site_settings for all to authenticated using (true) with check (true);

-- 4. Storage untuk foto produk
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "public read product images" on storage.objects
for select using (bucket_id = 'products');

create policy "admin write product images" on storage.objects
for all to authenticated using (bucket_id = 'products') with check (bucket_id = 'products');
