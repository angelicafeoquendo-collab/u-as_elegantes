import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { getClients, createClient, deleteClient } from "../services/clientService"

export default function Dashboard() {

  const [clients, setClients] = useState([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [errorMensaje, setErrorMensaje] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchClients = async () => {
    const { data, error } = await getClients()

    if (error) {
      setErrorMensaje("Error cargando clientes")
    } else {
      setClients(data)
    }
  }

  useEffect(() => {
    fetchClients()

    const channel = supabase
      .channel("clients")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients" },
        () => fetchClients()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleCreate = async () => {

    if (!name || !phone) {
      setErrorMensaje("Debes llenar nombre y teléfono")
      return
    }

    setLoading(true)
    setErrorMensaje("")

    const user = (await supabase.auth.getUser()).data.user

    const { error } = await createClient({
      name,
      phone,
      user_id: user.id
    })

    if (error) {
      setErrorMensaje("Error creando cliente")
    }

    setName("")
    setPhone("")
    setLoading(false)
  }

  const handleDelete = async (id) => {
    const { error } = await deleteClient(id)

    if (error) {
      setErrorMensaje("No se pudo eliminar el cliente")
    }
  }

  return (
    <div className="p-6 bg-pink-50 min-h-screen">

      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        Gestión de Clientes 💅
      </h1>

      {errorMensaje && (
        <p className="text-red-500 mb-4">
          {errorMensaje}
        </p>
      )}

      <div className="mb-6">

        <input
          placeholder="Nombre del cliente"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Teléfono"
          className="border p-2 mr-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-pink-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Agregar Cliente"}
        </button>

      </div>

      <ul>
        {clients?.map((client) => (
          <li
            key={client.id}
            className="bg-white p-3 mb-2 shadow rounded flex justify-between"
          >
            {client.name} - {client.phone}

            <button
              onClick={() => handleDelete(client.id)}
              className="text-red-500"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

    </div>
  )
}
