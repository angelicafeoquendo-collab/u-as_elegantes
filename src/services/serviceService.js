import { supabase } from "../lib/supabaseClient"

// Obtener todos los servicios
export const getServices = async () => {
  return await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false })
}

// Crear un servicio
export const createService = async (service) => {
  return await supabase
    .from("services")
    .insert([service])
}

// Actualizar servicio
export const updateService = async (id, service) => {
  return await supabase
    .from("services")
    .update(service)
    .eq("id", id)
}

// Eliminar servicio
export const deleteService = async (id) => {
  return await supabase
    .from("services")
    .delete()
    .eq("id", id)
}