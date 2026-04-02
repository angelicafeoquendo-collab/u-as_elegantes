import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isRemoteAuth, signUp } from "../services/authService"

export default function Register() {

  const navigate = useNavigate()
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

    const { error } = await signUp({ email, password })

    if (error) {
      setErrorMensaje(error.message)
    } else {
      if (isRemoteAuth) {
        setMensaje("Registro enviado. Revisa tu correo si Supabase requiere confirmación.")
      } else {
        setMensaje("Usuario registrado correctamente")
        navigate("/dashboard")
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-shell">
      <form onSubmit={handleRegister} className="auth-card">
        <p className="auth-badge">
          {isRemoteAuth ? "Modo Supabase" : "Modo local"}
        </p>

        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-copy">Registra un acceso para comenzar a usar el panel.</p>

        {errorMensaje && <p className="auth-error">{errorMensaje}</p>}
        {mensaje && <p className="auth-success">{mensaje}</p>}

        <label className="auth-field">
          <span>Correo</span>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="auth-field">
          <span>Contraseña</span>
          <input
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="auth-button" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/">Ingresar</Link>
        </p>
      </form>
    </div>
  )
}