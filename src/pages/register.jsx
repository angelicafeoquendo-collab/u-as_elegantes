import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Register() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [errorMensaje, setErrorMensaje] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    setLoading(true)
    setErrorMensaje("")
    setMensaje("")

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setErrorMensaje(error.message)
    } else {
      setMensaje("Usuario registrado correctamente")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80"
      >

        <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          Crear Cuenta 💅
        </h2>

        {errorMensaje && (
          <p className="text-red-500 text-sm mb-2">
            {errorMensaje}
          </p>
        )}

        {mensaje && (
          <p className="text-green-600 text-sm mb-2">
            {mensaje}
          </p>
        )}

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-pink-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

      </form>

    </div>
  )
}