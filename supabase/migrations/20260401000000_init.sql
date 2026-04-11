create extension if not exists "pgcrypto";

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null default 0,
  duration integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  service_id uuid not null references public.services(id) on delete cascade,
  date_time timestamptz not null,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "Public read services" on public.services;
create policy "Public read services"
  on public.services
  for select
  using (true);

drop policy if exists "Authenticated manage services" on public.services;
create policy "Authenticated manage services"
  on public.services
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated manage clients" on public.clients;
create policy "Authenticated manage clients"
  on public.clients
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated manage appointments" on public.appointments;
create policy "Authenticated manage appointments"
  on public.appointments
  for all
  to authenticated
  using (true)
  with check (true);