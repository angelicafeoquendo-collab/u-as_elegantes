# Uñas Elegantes

Panel en React + Vite que funciona en dos modos:

- Servidor directo, usando una `DATABASE_URL` en un backend Node.
- Supabase, cuando defines credenciales válidas en el entorno.
- Local, usando `localStorage`, cuando no hay configuración de Supabase.

## Arranque

1. Ejecuta `npm install` si no tienes dependencias instaladas.
2. Ejecuta `npm run dev`.
3. Si no defines credenciales de Supabase, la app entra en modo local automáticamente.
4. En modo local puedes entrar con el botón `Entrar con datos semilla`.

## Consola

Si prefieres usar la conexión directa a Postgres:

1. Define `DATABASE_POOLER_URL` si quieres usar el pooler, o `DATABASE_URL` para conexión directa. El pooler de Supabase para este proyecto puede usar `postgresql://postgres:[YOUR-PASSWORD]@db.crupvemnrcaptudircxp.supabase.co:6543/postgres`.
2. Ejecuta `npm run api` para levantar el backend.
3. Define `VITE_API_BASE_URL`, por ejemplo `http://localhost:3001/api`.
4. Ejecuta `npm run dev` para levantar el frontend.

Si prefieres trabajar desde terminal con Supabase CLI:

1. Ejecuta `supabase login`.
2. Si el proyecto está enlazado, aplica el esquema con `npm run supabase:push`.
3. Para levantar una copia local con seeds, usa `npm run supabase:reset`.
4. Los seeds se cargan desde [supabase/seed.sql](supabase/seed.sql).

## Variables de entorno

Necesitas estas variables para Supabase:

- `VITE_API_BASE_URL` para el modo servidor directo.
- `DATABASE_URL` para el backend Node.
- `DATABASE_POOLER_URL` para priorizar el pooler de Supabase.
- `PORT` para cambiar el puerto del backend directo.
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` o, por compatibilidad, `VITE_SUPABASE_ANON_KEY`

Si defines `VITE_API_BASE_URL`, el frontend usa el backend directo y no necesita la clave pública de Supabase para los datos. Si no las defines, el proyecto entra automáticamente en modo local. Supabase ha ido migrando la etiqueta pública hacia "publishable key"; en este proyecto ambas opciones funcionan.

Acceso demo local:

- Email: `demo@uaseslegantes.local`
- Password: `demo1234`

## Supabase

El frontend espera estas tablas:

- `clients`
- `services`
- `appointments`

La app ya soporta datos locales con el mismo formato básico para pruebas y desarrollo sin backend.

## Backend directo

El backend directo vive en [server/index.js](server/index.js) y expone rutas REST para `clients`, `services` y `appointments`. La conexión a la base de datos nunca se envía al navegador; solo la consume el servidor. Si están presentes ambas variables, el servidor prioriza `DATABASE_POOLER_URL`.

## Semillas

- Los datos locales iniciales viven en [src/data/seedData.js](src/data/seedData.js).
- Si quieres cargar Supabase desde cero, usa [supabase/seed.sql](supabase/seed.sql).
- Si quieres crear también las tablas y políticas, usa [supabase/schema.sql](supabase/schema.sql).
- Para Supabase CLI, la migración principal está en [supabase/migrations/20260401000000_init.sql](supabase/migrations/20260401000000_init.sql).
