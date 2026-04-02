import { isSupabaseConfigured, supabase } from "../lib/supabaseClient"
import { localAuth } from "../lib/localAuth"

const authClient = isSupabaseConfigured ? supabase.auth : localAuth

export { isSupabaseConfigured as isRemoteAuth } from "../lib/supabaseClient"

export const getCurrentUser = async () => {
  if (isSupabaseConfigured) {
    const { data, error } = await authClient.getUser()
    return { user: data?.user ?? null, error }
  }

  const { data, error } = authClient.getUser()
  return { user: data?.user ?? null, error }
}

export const signIn = async ({ email, password }) => authClient.signInWithPassword({ email, password })

export const signUp = async ({ email, password }) => authClient.signUp({ email, password })

export const signOut = async () => authClient.signOut()

export const signInDemo = async () => {
  if (isSupabaseConfigured) {
    return {
      data: { user: null, session: null },
      error: new Error("El acceso demo solo está disponible en modo local"),
    }
  }

  return authClient.signInDemo()
}