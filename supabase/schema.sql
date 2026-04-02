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
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  client_id uuid not null references public.clients(id) on delete cascade,
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

drop policy if exists "Authenticated read clients" on public.clients;
create policy "Authenticated read clients"
  on public.clients
  for select
  to authenticated
  using (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated insert clients" on public.clients;
create policy "Authenticated insert clients"
  on public.clients
  for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated update clients" on public.clients;
create policy "Authenticated update clients"
  on public.clients
  for update
  to authenticated
  using (user_id = auth.uid() or user_id is null)
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated delete clients" on public.clients;
create policy "Authenticated delete clients"
  on public.clients
  for delete
  to authenticated
  using (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated read appointments" on public.appointments;
create policy "Authenticated read appointments"
  on public.appointments
  for select
  to authenticated
  using (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated insert appointments" on public.appointments;
create policy "Authenticated insert appointments"
  on public.appointments
  for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated update appointments" on public.appointments;
create policy "Authenticated update appointments"
  on public.appointments
  for update
  to authenticated
  using (user_id = auth.uid() or user_id is null)
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists "Authenticated delete appointments" on public.appointments;
create policy "Authenticated delete appointments"
  on public.appointments
  for delete
  to authenticated
  using (user_id = auth.uid() or user_id is null);