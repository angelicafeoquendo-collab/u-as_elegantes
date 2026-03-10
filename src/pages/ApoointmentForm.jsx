import { useState, useEffect } from "react"
import { createAppointment } from "../services/appointmentService"
import { getClients } from "../services/clientService"
import { getServices } from "../services/serviceService"

export default function AppointmentForm() {

  const [clientId, setClientId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])

  const loadData = async () => {
    const { data: clientsData } = await getClients()
    const { data: servicesData } = await getServices()

    setClients(clientsData || [])
    setServices(servicesData || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const appointment = {
      client_id: clientId,
      service_id: serviceId,
      date_time: dateTime,
      status: "scheduled"
    }

    await createAppointment(appointment)

    setClientId("")
    setServiceId("")
    setDateTime("")
  }

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        Crear Cita 💅
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleccionar Cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleccionar Servicio</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button className="bg-pink-600 text-white px-4 py-2 rounded">
          Guardar Cita
        </button>

      </form>

    </div>
  )
}