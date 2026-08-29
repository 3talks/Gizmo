-- ============================================================
-- OLIZ STORE — Supabase schema
-- Run this once in your project's SQL editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- brands ----------
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon text not null default 'plug',
  image_url text,
  price numeric not null check (price >= 0),
  old_price numeric check (old_price is null or old_price >= 0),
  rating numeric not null default 0 check (rating >= 0 and rating <= 5),
  reviews integer not null default 0 check (reviews >= 0),
  tag text check (tag is null or tag in ('new', 'sale', 'best')),
  tile text not null default 'linear-gradient(150deg,#eef0ff,#dde3ff)',
  brand text,
  created_at timestamptz not null default now()
);

-- Running this on a database that already has the `products` table from an
-- earlier version of this schema? This line adds the new column safely.
alter table public.products add column if not exists image_url text;

create index if not exists products_category_idx on public.products (category);

-- ---------- row level security ----------
-- Storefront pages read with the public anon key, so everyone can SELECT.
-- Writes (insert/update/delete) require an authenticated session — and
-- since public sign-up is left OFF for this project (see README), the
-- only accounts that can authenticate are the admins you create yourself
-- in Authentication -> Users. That's what makes "authenticated" == "admin"
-- here, with no extra role table needed.

alter table public.products enable row level security;
alter table public.brands enable row level security;

drop policy if exists "public can read products" on public.products;
create policy "public can read products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "admins can write products" on public.products;
create policy "admins can write products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "public can read brands" on public.brands;
create policy "public can read brands"
  on public.brands for select
  to anon, authenticated
  using (true);

drop policy if exists "admins can write brands" on public.brands;
create policy "admins can write brands"
  on public.brands for all
  to authenticated
  using (true)
  with check (true);

-- ---------- seed data (safe to re-run) ----------
insert into public.brands (name) values
  ('Apple'), ('DJI'), ('Sony'), ('Bose'), ('Anker'), ('Citizen'),
  ('Hamilton'), ('Bulova'), ('Cosori'), ('Levoit'), ('Adam Elements'), ('JBL')
on conflict (name) do nothing;

insert into public.products (name, category, icon, price, old_price, rating, reviews, tag, tile, brand) values
  ('Apple iPhone 17 Pro Max', 'phone', 'phone', 411399, null, 5, 24, 'best', 'linear-gradient(150deg,#eef0ff,#dde3ff)', 'Apple'),
  ('Apple iPhone 17e', 'phone', 'phone', 175099, null, 4.8, 11, null, 'linear-gradient(150deg,#eef0ff,#dde3ff)', 'Apple'),
  ('Apple iPad A16 · 11"', 'tablet', 'tablet', 145000, null, 4.7, 9, null, 'linear-gradient(150deg,#eef3ff,#e4e9ff)', 'Apple'),
  ('Apple MacBook Air M5 13"', 'laptop', 'laptop', 342500, null, 4.9, 15, null, 'linear-gradient(150deg,#eef0ff,#e6e9f7)', 'Apple'),
  ('DJI Osmo Action 6 Combo', 'camera', 'camera', 88500, 83500, 5, 7, 'sale', 'linear-gradient(150deg,#fff2e2,#ffe3c2)', 'DJI'),
  ('DJI Osmo Pocket 4 Creator', 'camera', 'camera', 112000, 99000, 4.9, 12, 'sale', 'linear-gradient(150deg,#fff2e2,#ffe3c2)', 'DJI'),
  ('DJI Avata 360 Fly More', 'drone', 'drone', 158000, 147500, 4.8, 6, 'sale', 'linear-gradient(150deg,#e9fbf1,#d3f5e2)', 'DJI'),
  ('DJI Lito X1 Combo Plus', 'drone', 'drone', 136500, 123000, 4.7, 5, 'sale', 'linear-gradient(150deg,#e9fbf1,#d3f5e2)', 'DJI'),
  ('DJI Mic Mini 2 (2TX+1RX)', 'mic', 'mic', 19500, null, 4.9, 8, 'new', 'linear-gradient(150deg,#fdeef5,#f9dce9)', 'DJI'),
  ('DJI Osmo Mobile 8P Combo', 'access', 'plug', 38500, 35000, 4.6, 4, 'sale', 'linear-gradient(150deg,#eef0ff,#dde3ff)', 'DJI'),
  ('Levoit Smart Tower Fan 42"', 'access', 'plug', 23500, null, 5, 1, 'new', 'linear-gradient(150deg,#eafcf5,#d6f7e7)', 'Levoit'),
  ('MOVA Master 10 Hair Styler', 'access', 'plug', 71500, null, 4.5, 3, null, 'linear-gradient(150deg,#fff2e2,#ffe3c2)', null),
  ('Cosori Dual Zone 8.5L Air Fryer', 'access', 'plug', 35500, null, 4.6, 6, null, 'linear-gradient(150deg,#f4f1ff,#e6ddff)', 'Cosori'),
  ('Apple USB‑C 20W Adapter', 'access', 'plug', 4500, null, 5, 1, null, 'linear-gradient(150deg,#eef0ff,#dde3ff)', 'Apple'),
  ('ADAM 4‑in‑1 60W Magnetic Cable', 'access', 'plug', 3950, null, 4.4, 2, 'new', 'linear-gradient(150deg,#eef0ff,#dde3ff)', 'Adam Elements'),
  ('Citizen Eco‑Drive Classic', 'watch', 'watch', 62500, null, 4.8, 9, null, 'linear-gradient(150deg,#fff7e6,#ffe9bd)', 'Citizen'),
  ('Hamilton Khaki Field', 'watch', 'watch', 98500, null, 4.9, 5, null, 'linear-gradient(150deg,#fff7e6,#ffe9bd)', 'Hamilton'),
  ('Bose Home Theatre 5.1', 'speaker', 'speaker', 152000, null, 4.7, 3, 'new', 'linear-gradient(150deg,#eef3ff,#e0e7ff)', 'Bose'),
  ('Sony Wireless Headset XM6', 'audio', 'headphones', 58500, null, 4.9, 21, 'best', 'linear-gradient(150deg,#f3eeff,#e5daff)', 'Sony'),
  ('JBL Flip Essential 2', 'audio', 'headphones', 12500, 10900, 4.6, 14, 'sale', 'linear-gradient(150deg,#f3eeff,#e5daff)', 'JBL')
on conflict do nothing;

-- ============================================================
-- Storage — product photo uploads
-- ============================================================
-- Creates a public bucket for product images. Public = anyone can VIEW an
-- image by URL (needed so the storefront can display photos), but only
-- authenticated (admin) sessions can upload/replace/delete files in it,
-- matching the same read-public / write-admin-only pattern as the tables.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public can view product images" on storage.objects;
create policy "public can view product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "admins can upload product images" on storage.objects;
create policy "admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "admins can update product images" on storage.objects;
create policy "admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admins can delete product images" on storage.objects;
create policy "admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ============================================================
-- Homepage hero slides — manageable from the admin portal
-- ============================================================

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  tag text not null default '',
  title_line1 text not null default '',
  title_line2 text not null default '',
  subtitle text not null default '',
  href text not null default '/category/all',
  color_from text not null default '#3355FF',
  color_via text,
  color_to text not null default '#7d5cff',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

drop policy if exists "public can read hero slides" on public.hero_slides;
create policy "public can read hero slides"
  on public.hero_slides for select
  to anon, authenticated
  using (true);

drop policy if exists "admins can write hero slides" on public.hero_slides;
create policy "admins can write hero slides"
  on public.hero_slides for all
  to authenticated
  using (true)
  with check (true);

-- Seed data: the same 4 slides that used to be hardcoded, so nothing
-- changes visually the first time you run this migration.
insert into public.hero_slides (tag, title_line1, title_line2, subtitle, href, color_from, color_via, color_to, sort_order)
select * from (values
  ('iPhone 17 series', 'Titanium.', 'Reimagined.', 'Now in stock across all outlets', '/category/phone', '#3355FF', '#7d5cff', '#a06bff', 1),
  ('Oliz Studio', 'Home theatre,', 'engineered right', 'Curated speaker & AV bundles', '/category/speaker', '#12141A', '#2b2f3d', '#454b5e', 2),
  ('Limited drop', 'Flight-ready', 'drone bundles', 'Fly More combos, up to 13% off', '/category/drone', '#FF9F1C', null, '#ff7a3d', 3),
  ('Trade-in + EMI', 'Upgrade for', 'less, monthly', '0% interest plans on select gadgets', '/category/all', '#1FAA59', null, '#0e7a45', 4)
) as seed(tag, title_line1, title_line2, subtitle, href, color_from, color_via, color_to, sort_order)
where not exists (select 1 from public.hero_slides);
