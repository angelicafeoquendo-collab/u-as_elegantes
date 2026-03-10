import { useEffect, useState } from "react"
import { getClients, deleteClient } from "../services/clientService"

export default function ClientsList() {

  const [clients, setClients] = useState([])

  const fetchClients = async () => {
    const { data, error } = await getClients()

    if (!error) {
      setClients(data)
    }
  }

  const handleDelete = async (id) => {
    await deleteClient(id)
    fetchClients()
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4 text-pink-600">
        Lista de Clientes 
      </h2>

      <table className="w-full border">

        <thead>
          <tr className="bg-pink-200">
            <th className="p-2">Nombre</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Email</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="text-center border">

              <td className="p-2">
                {client.name}
              </td>

              <td className="p-2">
                {client.phone}
              </td>

              <td className="p-2">
                {client.email}
              </td>

              <td className="p-2">
                <button
                  onClick={() => handleDelete(client.id)}
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