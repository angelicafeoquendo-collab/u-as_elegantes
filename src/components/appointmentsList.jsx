import { useEffect, useState } from "react"
import { getAppointments, deleteAppointment } from "../services/appointmentService"

export default function AppointmentsList() {

  const [appointments, setAppointments] = useState([])

  const handleDelete = async (id) => {
    await deleteAppointment(id)
    const { data, error } = await getAppointments()

    if (!error) {
      setAppointments(data)
    }
  }

  useEffect(() => {
    const loadAppointments = async () => {
      const { data, error } = await getAppointments()

      if (!error) {
        setAppointments(data)
      }
    }

    void loadAppointments()
  }, [])

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4 text-pink-600">
        Lista de Citas 
      </h2>

      <table className="w-full border">

        <thead>
          <tr className="bg-pink-200">
            <th className="p-2">Cliente</th>
            <th className="p-2">Servicio</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="text-center border">

              <td className="p-2">
                {appointment.clients?.name}
              </td>

              <td className="p-2">
                {appointment.services?.name}
              </td>

              <td className="p-2">
                {appointment.date_time}
              </td>

              <td className="p-2">
                {appointment.status}
              </td>

              <td className="p-2">
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}