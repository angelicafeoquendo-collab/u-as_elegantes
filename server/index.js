import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import pg from "pg"

dotenv.config({ path: ".env.local" })
dotenv.config()

const { Pool } = pg

const databasePoolerUrl = process.env.DATABASE_POOLER_URL?.trim()
const databaseUrl = databasePoolerUrl || process.env.DATABASE_URL?.trim()
const port = Number(process.env.PORT ?? 3001)

if (!databaseUrl) {
  console.error("Falta DATABASE_URL para iniciar el backend directo")
  process.exit(1)
}

const useSsl = !databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1")

if (databasePoolerUrl) {
  console.log("Usando DATABASE_POOLER_URL para la conexión a Postgres")
} else {
  console.log("Usando DATABASE_URL para la conexión a Postgres")
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
})

const app = express()

app.use(cors())
app.use(express.json())

const respondData = (res, data, status = 200) => res.status(status).json({ data })
const respondError = (res, error, status = 500) =>
  res.status(status).json({ error: error instanceof Error ? error.message : String(error) })

const query = async (text, values = []) => {
  const client = await pool.connect()

  try {
    return await client.query(text, values)
  } finally {
    client.release()
  }
}

const buildInsert = (tableName, body, fields) => {
  const columns = []
  const values = []

  fields.forEach((field) => {
    if (body[field] !== undefined) {
      columns.push(field)
      values.push(body[field])
    }
  })

  if (!columns.length) {
    throw new Error(`No se encontraron campos para insertar en ${tableName}`)
  }

  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ")

  return {
    sql: `insert into public.${tableName} (${columns.join(", ")}) values (${placeholders}) returning *`,
    values,
  }
}

const buildUpdate = (tableName, body, fields, id) => {
  const assignments = []
  const values = []

  fields.forEach((field) => {
    if (body[field] !== undefined) {
      values.push(body[field])
      assignments.push(`${field} = $${values.length}`)
    }
  })

  if (!assignments.length) {
    throw new Error(`No se encontraron campos para actualizar en ${tableName}`)
  }

  values.push(id)

  return {
    sql: `update public.${tableName} set ${assignments.join(", ")} where id = $${values.length} returning *`,
    values,
  }
}

const formatAppointment = (row) => {
  const { client_name, service_name, ...appointment } = row

  return {
    ...appointment,
    clients: client_name ? { name: client_name } : null,
    services: service_name ? { name: service_name } : null,
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    await query("select 1")
    respondData(res, { ok: true })
  } catch (error) {
    respondError(res, error)
  }
})

app.get("/api/clients", async (_req, res) => {
  try {
    const result = await query("select * from public.clients order by created_at desc")
    respondData(res, result.rows)
  } catch (error) {
    respondError(res, error)
  }
})

app.post("/api/clients", async (req, res) => {
  try {
    if (!req.body?.name || !req.body?.phone) {
      return respondError(res, new Error("Faltan nombre o teléfono"), 400)
    }

    const { sql, values } = buildInsert("clients", req.body, ["id", "name", "phone", "email", "created_at"])
    const result = await query(sql, values)
    respondData(res, result.rows[0], 201)
  } catch (error) {
    respondError(res, error)
  }
})

app.put("/api/clients/:id", async (req, res) => {
  try {
    const { sql, values } = buildUpdate("clients", req.body ?? {}, ["name", "phone", "email", "created_at"], req.params.id)
    const result = await query(sql, values)
    respondData(res, result.rows[0])
  } catch (error) {
    respondError(res, error)
  }
})

app.delete("/api/clients/:id", async (req, res) => {
  try {
    await query("delete from public.clients where id = $1", [req.params.id])
    respondData(res, null)
  } catch (error) {
    respondError(res, error)
  }
})

app.get("/api/services", async (_req, res) => {
  try {
    const result = await query("select * from public.services order by created_at desc")
    respondData(res, result.rows)
  } catch (error) {
    respondError(res, error)
  }
})

app.post("/api/services", async (req, res) => {
  try {
    if (!req.body?.name) {
      return respondError(res, new Error("Falta el nombre del servicio"), 400)
    }

    const { sql, values } = buildInsert("services", req.body, ["id", "name", "price", "duration", "created_at"])
    const result = await query(sql, values)
    respondData(res, result.rows[0], 201)
  } catch (error) {
    respondError(res, error)
  }
})

app.put("/api/services/:id", async (req, res) => {
  try {
    const { sql, values } = buildUpdate("services", req.body ?? {}, ["name", "price", "duration", "created_at"], req.params.id)
    const result = await query(sql, values)
    respondData(res, result.rows[0])
  } catch (error) {
    respondError(res, error)
  }
})

app.delete("/api/services/:id", async (req, res) => {
  try {
    await query("delete from public.services where id = $1", [req.params.id])
    respondData(res, null)
  } catch (error) {
    respondError(res, error)
  }
})

app.get("/api/appointments", async (_req, res) => {
  try {
    const result = await query(
      `select
        a.*,
        c.name as client_name,
        s.name as service_name
      from public.appointments a
      left join public.clients c on c.id::text = a.client_id
      left join public.services s on s.id = a.service_id
      order by a.date_time desc`
    )

    respondData(res, result.rows.map(formatAppointment))
  } catch (error) {
    respondError(res, error)
  }
})

app.post("/api/appointments", async (req, res) => {
  try {
    if (!req.body?.client_id || !req.body?.service_id || !req.body?.date_time) {
      return respondError(res, new Error("Faltan cliente, servicio o fecha"), 400)
    }

    const { sql, values } = buildInsert(
      "appointments",
      req.body,
      ["id", "client_id", "service_id", "date_time", "status", "created_at"]
    )
    const result = await query(sql, values)
    respondData(res, result.rows[0], 201)
  } catch (error) {
    respondError(res, error)
  }
})

app.put("/api/appointments/:id", async (req, res) => {
  try {
    const { sql, values } = buildUpdate(
      "appointments",
      req.body ?? {},
      ["client_id", "service_id", "date_time", "status", "created_at"],
      req.params.id
    )
    const result = await query(sql, values)
    respondData(res, result.rows[0])
  } catch (error) {
    respondError(res, error)
  }
})

app.patch("/api/appointments/:id/status", async (req, res) => {
  try {
    if (!req.body?.status) {
      return respondError(res, new Error("Falta el estado"), 400)
    }

    const result = await query(
      "update public.appointments set status = $1 where id = $2 returning *",
      [req.body.status, req.params.id]
    )
    respondData(res, result.rows[0])
  } catch (error) {
    respondError(res, error)
  }
})

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    await query("delete from public.appointments where id = $1", [req.params.id])
    respondData(res, null)
  } catch (error) {
    respondError(res, error)
  }
})

app.listen(port, () => {
  console.log(`Backend directo escuchando en http://localhost:${port}`)
})
