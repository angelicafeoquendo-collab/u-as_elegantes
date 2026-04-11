import { createClient } from "@supabase/supabase-js"
import { isSupabaseConfigured, supabaseCredentials } from "./runtimeConfig"

const { supabaseUrl, supabasePublishableKey } = supabaseCredentials

export { isSupabaseConfigured }

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null
