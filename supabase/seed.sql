insert into public.services (id, name, price, duration, created_at)
values
  ('1', 'Manicura básica', 15, 45, '2026-04-01T08:00:00.000Z'),
  ('2', 'Manicura premium', 25, 60, '2026-04-01T08:10:00.000Z'),
  ('3', 'Kapping', 32, 75, '2026-04-01T08:20:00.000Z')
on conflict (id) do nothing;

insert into public.clients (id, name, phone, created_at)
values
  ('1', 'María López', '555-0101', '2026-04-01T08:00:00.000Z'),
  ('2', 'Ana Torres', '555-0102', '2026-04-01T08:10:00.000Z'),
  ('3', 'Valeria Díaz', '555-0103', '2026-04-01T08:20:00.000Z')
on conflict (id) do nothing;

insert into public.appointments (id, client_id, service_id, date_time, status, created_at)
values
  ('1', '1', '2', '2026-04-02T09:00:00.000Z', 'scheduled', '2026-04-01T09:00:00.000Z'),
  ('2', '2', '1', '2026-04-02T11:00:00.000Z', 'scheduled', '2026-04-01T09:10:00.000Z'),
  ('3', '3', '3', '2026-04-03T15:30:00.000Z', 'completed', '2026-04-01T09:20:00.000Z')
on conflict (id) do nothing;