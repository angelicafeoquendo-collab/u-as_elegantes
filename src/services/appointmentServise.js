import { apiRequest } from "../lib/apiClient"
import { isApiConfigured } from "../lib/runtimeConfig"
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient"
import { localDatabase, formatLocalAppointment } from "../lib/localDatabase"

// Obtener todas las citas
export const getAppointments = async () => {
  if (isApiConfigured) {
    return await apiRequest("/appointments")
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("appointments")
      .select(`
      *,
      clients(name),
      services(name)
    `)
      .order("date_time", { ascending: false })
  }

  const clients = localDatabase.select("clients")
  const services = localDatabase.select("services")
  const appointments = localDatabase.select("appointments")

  return {
    data: appointments.map((appointment) =>
      formatLocalAppointment(appointment, clients, services)
    ),
    error: null,
  }
}

// Crear una cita
export const createAppointment = async (appointment) => {
  if (isApiConfigured) {
    return await apiRequest("/appointments", {
      method: "POST",
      body: appointment,
    })
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("appointments")
      .insert([appointment])
  }

  localDatabase.insert("appointments", appointment)
  return { data: [appointment], error: null }
}

// Actualizar estado de una cita
export const updateAppointmentStatus = async (id, status) => {
  if (isApiConfigured) {
    return await apiRequest(`/appointments/${id}/status`, {
      method: "PATCH",
      body: { status },
    })
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
  }

  const updatedAppointment = localDatabase.update("appointments", id, { status })
  return { data: updatedAppointment ? [updatedAppointment] : [], error: null }
}

// Eliminar una cita
export const deleteAppointment = async (id) => {
  if (isApiConfigured) {
    return await apiRequest(`/appointments/${id}`, {
      method: "DELETE",
    })
  }

  if (isSupabaseConfigured) {
    return await supabase
      .from("appointments")
      .delete()
      .eq("id", id)
  }

  localDatabase.remove("appointments", id)
  return { data: null, error: null }
}
