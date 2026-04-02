export const seedClients = [
  {
    id: "1",
    name: "María López",
    phone: "555-0101",
    created_at: "2026-04-01T08:00:00.000Z",
  },
  {
    id: "2",
    name: "Ana Torres",
    phone: "555-0102",
    created_at: "2026-04-01T08:10:00.000Z",
  },
  {
    id: "3",
    name: "Valeria Díaz",
    phone: "555-0103",
    created_at: "2026-04-01T08:20:00.000Z",
  },
]

export const seedServices = [
  {
    id: "1",
    name: "Manicura básica",
    price: 15,
    duration: 45,
    created_at: "2026-04-01T08:00:00.000Z",
  },
  {
    id: "2",
    name: "Manicura premium",
    price: 25,
    duration: 60,
    created_at: "2026-04-01T08:10:00.000Z",
  },
  {
    id: "3",
    name: "Kapping",
    price: 32,
    duration: 75,
    created_at: "2026-04-01T08:20:00.000Z",
  },
]

export const seedAppointments = [
  {
    id: "1",
    client_id: "1",
    service_id: "2",
    date_time: "2026-04-02T09:00:00.000Z",
    status: "scheduled",
    created_at: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "2",
    client_id: "2",
    service_id: "1",
    date_time: "2026-04-02T11:00:00.000Z",
    status: "scheduled",
    created_at: "2026-04-01T09:10:00.000Z",
  },
  {
    id: "3",
    client_id: "3",
    service_id: "3",
    date_time: "2026-04-03T15:30:00.000Z",
    status: "completed",
    created_at: "2026-04-01T09:20:00.000Z",
  },
]