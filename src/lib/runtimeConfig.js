const readEnv = (value) => (typeof value === "string" ? value.trim() : "")

export const apiBaseUrl = readEnv(import.meta.env.VITE_API_BASE_URL)
export const isApiConfigured = Boolean(apiBaseUrl)

const supabaseUrl = readEnv(import.meta.env.VITE_SUPABASE_URL)
const supabasePublishableKey = readEnv(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const isSupabaseConfigured = !isApiConfigured && Boolean(supabaseUrl && supabasePublishableKey)

export const supabaseCredentials = {
  supabaseUrl,
  supabasePublishableKey,
}

export const runtimeModeLabel = isApiConfigured
  ? "Modo servidor"
  : isSupabaseConfigured
    ? "Modo Supabase"
    : "Modo local"
