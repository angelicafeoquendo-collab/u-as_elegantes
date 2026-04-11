import { apiRequest } from "../lib/apiClient"
import { isApiConfigured } from "../lib/runtimeConfig"
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient"
import { localDatabase } from "../lib/localDatabase"

// Obtener todos los clientes
export const getClients = async () => {
  if (isApiConfigured) {
    return await apiRequest("/clients")
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })
  }

  return { data: localDatabase.select("clients"), error: null }
}

// Crear un cliente
export const createClient = async (client) => {
  if (isApiConfigured) {
    return await apiRequest("/clients", {
      method: "POST",
      body: client,
    })
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("clients")
      .insert([client])
  }

  localDatabase.insert("clients", client)
  return { data: [client], error: null }
}

// Actualizar un cliente
export const updateClient = async (id, client) => {
  if (isApiConfigured) {
    return await apiRequest(`/clients/${id}`, {
      method: "PUT",
      body: client,
    })
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("clients")
      .update(client)
      .eq("id", id)
  }

  const updatedClient = localDatabase.update("clients", id, client)
  return { data: updatedClient ? [updatedClient] : [], error: null }
}

// Eliminar un cliente
export const deleteClient = async (id) => {
  if (isApiConfigured) {
    return await apiRequest(`/clients/${id}`, {
      method: "DELETE",
    })
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("clients")
      .delete()
      .eq("id", id)
  }

  localDatabase.remove("clients", id)
  return { data: null, error: null }
}
