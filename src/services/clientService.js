import { supabase } from "../lib/supabaseClient"

// Obtener todos los clientes
export const getClients = async () => {
  return await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })
}

// Crear un cliente
export const createClient = async (client) => {
  return await supabase
    .from("clients")
    .insert([client])
}

// Actualizar un cliente
export const updateClient = async (id, client) => {
  return await supabase
    .from("clients")
    .update(client)
    .eq("id", id)
}

// Eliminar un cliente
export const deleteClient = async (id) => {
  return await supabase
    .from("clients")
    .delete()
    .eq("id", id)
}