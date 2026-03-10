import { supabase } from "../lib/supabaseClient"

// Obtener todas las citas
export const getAppointments = async () => {
  return await supabase
    .from("appointments")
    .select(`
      *,
      clients(name),
      services(name)
    `)
    .order("date_time", { ascending: false })
}

// Crear una cita
export const createAppointment = async (appointment) => {
  return await supabase
    .from("appointments")
    .insert([appointment])
}

// Actualizar estado de una cita
export const updateAppointmentStatus = async (id, status) => {
  return await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
}

// Eliminar una cita
export const deleteAppointment = async (id) => {
  return await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
}