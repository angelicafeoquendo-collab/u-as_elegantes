# Uñas Elegantes

Panel en React + Vite que funciona en dos modos:

- Supabase, cuando defines credenciales válidas en el entorno.
- Local, usando `localStorage`, cuando no hay configuración de Supabase.

## Arranque

1. Ejecuta `npm install` si no tienes dependencias instaladas.
2. Ejecuta `npm run dev`.
3. Si no defines credenciales de Supabase, la app entra en modo local automáticamente.
4. En modo local puedes entrar con el botón `Entrar con datos semilla`.

## Consola

Si prefieres trabajar desde terminal con Supabase CLI:

1. Ejecuta `supabase login`.
2. Si el proyecto está enlazado, aplica el esquema con `npm run supabase:push`.
3. Para levantar una copia local con seeds, usa `npm run supabase:reset`.
4. Los seeds se cargan desde [supabase/seed.sql](supabase/seed.sql).

## Variables de entorno

Necesitas estas variables para Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Si no las defines, el proyecto entra automáticamente en modo local.

Acceso demo local:

- Email: `demo@uaseslegantes.local`
- Password: `demo1234`

## Supabase

El frontend espera estas tablas:

- `clients`
- `services`
- `appointments`

La app ya soporta datos locales con el mismo formato básico para pruebas y desarrollo sin backend.

## Semillas

- Los datos locales iniciales viven en [src/data/seedData.js](src/data/seedData.js).
- Si quieres cargar Supabase desde cero, usa [supabase/seed.sql](supabase/seed.sql).
- Si quieres crear también las tablas y políticas, usa [supabase/schema.sql](supabase/schema.sql).
- Para Supabase CLI, la migración principal está en [supabase/migrations/20260401000000_init.sql](supabase/migrations/20260401000000_init.sql).
