import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isApiConfigured, runtimeModeLabel } from "../lib/runtimeConfig"
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient"
import { localDatabase } from "../lib/localDatabase"
import { getClients, createClient, deleteClient } from "../services/clientService"
import { getServices, createService, deleteService } from "../services/serviceService"
import { getAppointments, createAppointment, deleteAppointment } from "../services/appointmentService"
import { getCurrentUser, signOut } from "../services/authService"

export default function Dashboard() {

  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("clients")
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState([])

  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientEmail, setClientEmail] = useState("")

  const [serviceName, setServiceName] = useState("")
  const [servicePrice, setServicePrice] = useState("")
  const [serviceDuration, setServiceDuration] = useState("")

  const [appointmentClientId, setAppointmentClientId] = useState("")
  const [appointmentServiceId, setAppointmentServiceId] = useState("")
  const [appointmentDateTime, setAppointmentDateTime] = useState("")

  const [errorMensaje, setErrorMensaje] = useState("")
  const [successMensaje, setSuccessMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [authLabel, setAuthLabel] = useState("")

  const fetchAllData = async () => {
    const [clientsResult, servicesResult, appointmentsResult] = await Promise.all([
      getClients(),
      getServices(),
      getAppointments(),
    ])

    if (clientsResult.error || servicesResult.error || appointmentsResult.error) {
      const backendError =
        clientsResult.error?.message ||
        servicesResult.error?.message ||
        appointmentsResult.error?.message ||
        "Error cargando datos del panel"

      setErrorMensaje(backendError)
      return
    }

    setClients(clientsResult.data || [])
    setServices(servicesResult.data || [])
    setAppointments(appointmentsResult.data || [])
  }

  useEffect(() => {
    let active = true

    const initialize = async () => {
      const { user } = await getCurrentUser()

      if (!user) {
        navigate("/")
        return
      }

      if (active) {
        setAuthLabel(user.email ?? "Usuario local")
        await fetchAllData()
      }
    }

    void initialize()

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        active = false
      }
    }

    const channel = supabase
      .channel("dashboard-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, () => fetchAllData())
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, () => fetchAllData())
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => fetchAllData())
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [navigate])

  const handleCreateClient = async () => {
    if (!clientName || !clientPhone) {
      setErrorMensaje("Debes llenar nombre y teléfono")
      return
    }

    setLoading(true)
    setErrorMensaje("")
    setSuccessMensaje("")

    const { error } = await createClient({
      name: clientName,
      phone: clientPhone,
      email: clientEmail || null,
    })

    if (error) {
      setErrorMensaje("Error creando cliente")
    } else {
      setSuccessMensaje("Cliente guardado correctamente")
      setClientName("")
      setClientPhone("")
      setClientEmail("")
      await fetchAllData()
    }

    setLoading(false)
  }

  const handleDeleteClient = async (id) => {
    const { error } = await deleteClient(id)

    if (error) {
      setErrorMensaje("No se pudo eliminar el cliente")
    } else {
      setSuccessMensaje("Cliente eliminado")
      await fetchAllData()
    }
  }

  const handleCreateService = async () => {
    if (!serviceName || !servicePrice || !serviceDuration) {
      setErrorMensaje("Completa nombre, precio y duración del servicio")
      return
    }

    setErrorMensaje("")
    setSuccessMensaje("")

    const { error } = await createService({
      name: serviceName,
      price: Number(servicePrice),
      duration: Number(serviceDuration),
    })

    if (error) {
      setErrorMensaje("Error creando servicio")
      return
    }

    setServiceName("")
    setServicePrice("")
    setServiceDuration("")
    setSuccessMensaje("Servicio guardado correctamente")
    await fetchAllData()
  }

  const handleDeleteService = async (id) => {
    const { error } = await deleteService(id)

    if (error) {
      setErrorMensaje("No se pudo eliminar el servicio")
      return
    }

    setSuccessMensaje("Servicio eliminado")
    await fetchAllData()
  }

  const handleCreateAppointment = async () => {
    if (!appointmentClientId || !appointmentServiceId || !appointmentDateTime) {
      setErrorMensaje("Completa cliente, servicio y fecha de la cita")
      return
    }

    const { error } = await createAppointment({
      client_id: appointmentClientId,
      service_id: appointmentServiceId,
      date_time: appointmentDateTime,
      status: "scheduled",
    })

    if (error) {
      setErrorMensaje("No se pudo crear la cita")
      return
    }

    setErrorMensaje("")
    setSuccessMensaje("Cita guardada correctamente")
    setAppointmentClientId("")
    setAppointmentServiceId("")
    setAppointmentDateTime("")
    await fetchAllData()
  }

  const handleDeleteAppointment = async (id) => {
    const { error } = await deleteAppointment(id)

    if (error) {
      setErrorMensaje("No se pudo eliminar la cita")
      return
    }

    setSuccessMensaje("Cita eliminada")
    await fetchAllData()
  }

  const handleResetSeeds = async () => {
    localDatabase.resetAll()
    setErrorMensaje("")
    setSuccessMensaje("Datos semilla restaurados")
    await fetchAllData()
  }

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  return (
    <div className="dashboard-shell">

      <div className="dashboard-header">
        <div>
          <p className="dashboard-kicker">{isApiConfigured ? `${runtimeModeLabel} activo` : isSupabaseConfigured ? "Supabase activo" : "Modo local activo"}</p>
          <h1 className="dashboard-title">Gestión del Spa</h1>
          <p className="dashboard-subtitle">Sesión: {authLabel || "cargando..."}</p>
        </div>

        <button onClick={handleSignOut} className="auth-button auth-button-secondary">
          Salir
        </button>
      </div>

      {errorMensaje && (
        <p className="auth-error">
          {errorMensaje}
        </p>
      )}

      {successMensaje && (
        <p className="auth-success">
          {successMensaje}
        </p>
      )}

      <div className="dashboard-tabs">
        <button className={`dashboard-tab ${activeSection === "clients" ? "is-active" : ""}`} onClick={() => setActiveSection("clients")}>Clientes</button>
        <button className={`dashboard-tab ${activeSection === "services" ? "is-active" : ""}`} onClick={() => setActiveSection("services")}>Servicios</button>
        <button className={`dashboard-tab ${activeSection === "appointments" ? "is-active" : ""}`} onClick={() => setActiveSection("appointments")}>Citas</button>
      </div>

      {!isSupabaseConfigured && (
        <div className="dashboard-tools">
          <button onClick={handleResetSeeds} className="dashboard-reset">
            Restaurar datos semilla
          </button>
        </div>
      )}

      {activeSection === "clients" && (
        <>
          <div className="dashboard-form">
            <input
              placeholder="Nombre del cliente"
              className="dashboard-input"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <input
              placeholder="Teléfono"
              className="dashboard-input"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />

            <input
              placeholder="Correo electrónico"
              className="dashboard-input"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />

            <button
              onClick={handleCreateClient}
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Agregar Cliente"}
            </button>
          </div>

          <ul className="dashboard-list">
            {clients?.map((client) => (
              <li
                key={client.id}
                className="dashboard-list-item"
              >
                <span>
                  {client.name} - {client.phone}
                </span>

                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="dashboard-delete"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {activeSection === "services" && (
        <>
          <div className="dashboard-form">
            <input
              placeholder="Nombre del servicio"
              className="dashboard-input"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />

            <input
              placeholder="Precio"
              type="number"
              className="dashboard-input"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
            />

            <input
              placeholder="Duración (min)"
              type="number"
              className="dashboard-input"
              value={serviceDuration}
              onChange={(e) => setServiceDuration(e.target.value)}
            />

            <button onClick={handleCreateService} className="auth-button">
              Agregar Servicio
            </button>
          </div>

          <ul className="dashboard-list">
            {services?.map((service) => (
              <li key={service.id} className="dashboard-list-item">
                <span>{service.name} - ${service.price} - {service.duration} min</span>
                <button onClick={() => handleDeleteService(service.id)} className="dashboard-delete">Eliminar</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {activeSection === "appointments" && (
        <>
          <div className="dashboard-form dashboard-form-appointments">
            <select
              value={appointmentClientId}
              className="dashboard-input"
              onChange={(e) => setAppointmentClientId(e.target.value)}
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>

            <select
              value={appointmentServiceId}
              className="dashboard-input"
              onChange={(e) => setAppointmentServiceId(e.target.value)}
            >
              <option value="">Seleccionar servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>

            <input
              type="datetime-local"
              className="dashboard-input"
              value={appointmentDateTime}
              onChange={(e) => setAppointmentDateTime(e.target.value)}
            />

            <button onClick={handleCreateAppointment} className="auth-button">
              Crear Cita
            </button>
          </div>

          <ul className="dashboard-list">
            {appointments?.map((appointment) => (
              <li key={appointment.id} className="dashboard-list-item">
                <span>
                  {appointment.clients?.name || "Cliente"} - {appointment.services?.name || "Servicio"} - {appointment.date_time}
                </span>
                <button onClick={() => handleDeleteAppointment(appointment.id)} className="dashboard-delete">Eliminar</button>
              </li>
            ))}
          </ul>
        </>
      )}

    </div>
  )
}
