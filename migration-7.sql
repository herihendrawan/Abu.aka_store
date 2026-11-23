-- Jalankan di Supabase SQL Editor
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  author text not null check (char_length(author) between 1 and 60),
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 3 and 600),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table reviews enable row level security;
create policy "public read approved reviews" on reviews for select using (is_approved = true);
create policy "public submit review" on reviews for insert to anon, authenticated with check (is_approved = false);
create policy "admin all reviews" on reviews for all to authenticated using (true) with check (true);
