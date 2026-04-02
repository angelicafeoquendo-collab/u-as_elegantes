import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signIn, signInDemo, isRemoteAuth } from "../services/authService"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMensaje, setErrorMensaje] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMensaje("")

    const { error } = await signIn({ email, password })

    if (error) {
      setErrorMensaje(error.message)
      setLoading(false)
      return
    }

    navigate("/dashboard")
  }

  const handleDemoLogin = async () => {
    const { error } = await signInDemo()

    if (error) {
      setErrorMensaje(error.message)
      return
    }

    navigate("/dashboard")
  }

  return (
    <div className="auth-shell">
      <form onSubmit={handleLogin} className="auth-card">
        <p className="auth-badge">
          {isRemoteAuth ? "Modo Supabase" : "Modo local"}
        </p>

        <h1 className="auth-title">Spa de Uñas Elegantes</h1>
        <p className="auth-copy">Ingresa para administrar clientes, servicios y citas.</p>

        {errorMensaje && <p className="auth-error">{errorMensaje}</p>}

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
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="auth-button" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {!isRemoteAuth && (
          <button type="button" onClick={handleDemoLogin} className="auth-button auth-button-secondary auth-button-demo">
            Entrar con datos semilla
          </button>
        )}

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </form>
    </div>
  )
}


