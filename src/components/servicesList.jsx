import { useEffect, useState } from "react"
import { getServices, deleteService } from "../services/serviceService"

export default function ServicesList() {

  const [services, setServices] = useState([])

  const handleDelete = async (id) => {
    await deleteService(id)
    const { data, error } = await getServices()

    if (!error) {
      setServices(data)
    }
  }

  useEffect(() => {
    const loadServices = async () => {
      const { data, error } = await getServices()

      if (!error) {
        setServices(data)
      }
    }

    void loadServices()
  }, [])

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4 text-pink-600">
        Lista de Servicios 
      </h2>

      <table className="w-full border">

        <thead>
          <tr className="bg-pink-200">
            <th className="p-2">Servicio</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Duración</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="text-center border">

              <td className="p-2">
                {service.name}
              </td>

              <td className="p-2">
                ${service.price}
              </td>

              <td className="p-2">
                {service.duration} min
              </td>

              <td className="p-2">
                <button
                  onClick={() => handleDelete(service.id)}
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