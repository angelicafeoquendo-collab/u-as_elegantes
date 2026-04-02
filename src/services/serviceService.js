import { isSupabaseConfigured, supabase } from "../lib/supabaseClient"
import { localDatabase } from "../lib/localDatabase"

// Obtener todos los servicios
export const getServices = async () => {
  if (isSupabaseConfigured) {
    return await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })
  }

  return { data: localDatabase.select("services"), error: null }
}

// Crear un servicio
export const createService = async (service) => {
  if (isSupabaseConfigured) {
    return await supabase
      .from("services")
      .insert([service])
  }

  localDatabase.insert("services", service)
  return { data: [service], error: null }
}

// Actualizar servicio
export const updateService = async (id, service) => {
  if (isSupabaseConfigured) {
    return await supabase
      .from("services")
      .update(service)
      .eq("id", id)
  }

  const updatedService = localDatabase.update("services", id, service)
  return { data: updatedService ? [updatedService] : [], error: null }
}

// Eliminar servicio
export const deleteService = async (id) => {
  if (isSupabaseConfigured) {
    return await supabase
      .from("services")
      .delete()
      .eq("id", id)
  }

  localDatabase.remove("services", id)
  return { data: null, error: null }
}