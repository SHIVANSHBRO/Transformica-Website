-- Run this ONCE in the Supabase SQL Editor.
-- Creates the products table, row-level security policies,
-- and the public storage bucket for product images.

create table if not exists public.products (
  id           text primary key,
  name         text not null,
  brand        text not null,
  price        text not null,
  category     text not null,
  tag          text,
  color        text not null,
  image_url    text,
  flavours     text[] not null default '{}',
  benefits     text[] not null default '{}',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_sort_idx on public.products (sort_order);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Row Level Security: public read, only authenticated users write
alter table public.products enable row level security;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (true);

drop policy if exists products_auth_insert on public.products;
create policy products_auth_insert on public.products
  for insert to authenticated with check (true);

drop policy if exists products_auth_update on public.products;
create policy products_auth_update on public.products
  for update to authenticated using (true) with check (true);

drop policy if exists products_auth_delete on public.products;
create policy products_auth_delete on public.products
  for delete to authenticated using (true);

-- Realtime
alter publication supabase_realtime add table public.products;

-- Storage bucket for product images (public read, authenticated write)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists product_images_auth_insert on storage.objects;
create policy product_images_auth_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists product_images_auth_update on storage.objects;
create policy product_images_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists product_images_auth_delete on storage.objects;
create policy product_images_auth_delete on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');
