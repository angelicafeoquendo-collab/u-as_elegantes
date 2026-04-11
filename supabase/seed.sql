insert into public.services (id, name, price, duration, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Manicura básica', 15, 45, '2026-04-01T08:00:00.000Z'),
  ('22222222-2222-2222-2222-222222222222', 'Manicura premium', 25, 60, '2026-04-01T08:10:00.000Z'),
  ('33333333-3333-3333-3333-333333333333', 'Kapping', 32, 75, '2026-04-01T08:20:00.000Z')
on conflict (id) do nothing;

insert into public.clients (id, name, phone, email, created_at)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'María López', '555-0101', 'maria@example.com', '2026-04-01T08:00:00.000Z'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ana Torres', '555-0102', 'ana@example.com', '2026-04-01T08:10:00.000Z'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Valeria Díaz', '555-0103', 'valeria@example.com', '2026-04-01T08:20:00.000Z')
on conflict (id) do nothing;

insert into public.appointments (id, client_id, service_id, date_time, status, created_at)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '2026-04-02T09:00:00.000Z', 'scheduled', '2026-04-01T09:00:00.000Z'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '2026-04-02T11:00:00.000Z', 'scheduled', '2026-04-01T09:10:00.000Z'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '2026-04-03T15:30:00.000Z', 'completed', '2026-04-01T09:20:00.000Z')
on conflict (id) do nothing;