import {
  seedAppointments,
  seedClients,
  seedServices,
} from "../data/seedData"

const STORAGE_KEYS = {
  clients: "uae_clients",
  services: "uae_services",
  appointments: "uae_appointments",
}

const DEFAULT_ROWS = {
  clients: seedClients,
  services: seedServices,
  appointments: seedAppointments,
}

const hasWindow = globalThis.window !== undefined

const readJSON = (key, fallback) => {
  if (!hasWindow) {
    return fallback
  }

  try {
    const rawValue = globalThis.window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

const writeJSON = (key, value) => {
  if (!hasWindow) {
    return
  }

  globalThis.window.localStorage.setItem(key, JSON.stringify(value))
}

const getNextId = (rows) => {
  const numericIds = rows
    .map((row) => Number(row.id))
    .filter((id) => Number.isFinite(id))

  return String(numericIds.length ? Math.max(...numericIds) + 1 : rows.length + 1)
}

const ensureSeededServices = () => {
  const services = readJSON(STORAGE_KEYS.services, [])

  if (!services.length) {
    writeJSON(STORAGE_KEYS.services, DEFAULT_ROWS.services)
    return DEFAULT_ROWS.services
  }

  return services
}

const ensureSeededRows = (tableName) => {
  const tableKey = getTableKey(tableName)
  const existingRows = readJSON(tableKey, [])

  if (!existingRows.length && DEFAULT_ROWS[tableName]?.length) {
    writeJSON(tableKey, DEFAULT_ROWS[tableName])
    return DEFAULT_ROWS[tableName]
  }

  return existingRows
}

const getTableKey = (tableName) => {
  if (!Object.hasOwn(STORAGE_KEYS, tableName)) {
    throw new Error(`Tabla local no soportada: ${tableName}`)
  }

  return STORAGE_KEYS[tableName]
}

export const localDatabase = {
  select(tableName) {
    if (tableName === "services") {
      return ensureSeededServices()
    }

    return ensureSeededRows(tableName)
  },

  resetAll() {
    if (!hasWindow) {
      return
    }

    Object.entries(DEFAULT_ROWS).forEach(([tableName, rows]) => {
      globalThis.window.localStorage.setItem(
        STORAGE_KEYS[tableName],
        JSON.stringify(rows)
      )
    })
  },

  insert(tableName, row) {
    const tableKey = getTableKey(tableName)
    const rows = this.select(tableName)
    const nextRow = {
      ...row,
      id: row.id ?? getNextId(rows),
      created_at: row.created_at ?? new Date().toISOString(),
    }

    const nextRows = [nextRow, ...rows]
    writeJSON(tableKey, nextRows)
    return nextRow
  },

  update(tableName, id, patch) {
    const tableKey = getTableKey(tableName)
    const rows = this.select(tableName)
    const nextRows = rows.map((row) =>
      String(row.id) === String(id) ? { ...row, ...patch } : row
    )

    writeJSON(tableKey, nextRows)
    return nextRows.find((row) => String(row.id) === String(id)) ?? null
  },

  remove(tableName, id) {
    const tableKey = getTableKey(tableName)
    const rows = this.select(tableName)
    const nextRows = rows.filter((row) => String(row.id) !== String(id))

    writeJSON(tableKey, nextRows)
  },
}

export const formatLocalAppointment = (appointment, clients = [], services = []) => {
  const client = clients.find((item) => String(item.id) === String(appointment.client_id))
  const service = services.find((item) => String(item.id) === String(appointment.service_id))

  return {
    ...appointment,
    clients: client ? { name: client.name } : null,
    services: service ? { name: service.name } : null,
  }
}