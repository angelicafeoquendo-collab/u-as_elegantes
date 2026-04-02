const USERS_KEY = "uae_users"
const SESSION_KEY = "uae_session"
const DEMO_EMAIL = "demo@uaseslegantes.local"
const DEMO_PASSWORD = "demo1234"
const DEMO_USER_ID = "demo-user"

const hasWindow = globalThis.window !== undefined

const readJSON = (key, fallback) => {
  if (!hasWindow) {
    return fallback
  }

  try {
    const rawValue = globalThis.window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

const writeJSON = (key, value) => {
  if (!hasWindow) {
    return
  }

  globalThis.window.localStorage.setItem(key, JSON.stringify(value))
}

const createUser = (email) => ({
  id: crypto.randomUUID(),
  email,
})

const ensureDemoUser = () => {
  const users = readJSON(USERS_KEY, [])
  const hasDemoUser = users.some((user) => user.email === DEMO_EMAIL)

  if (!hasDemoUser) {
    users.push({
      id: DEMO_USER_ID,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
    writeJSON(USERS_KEY, users)
  }

  return users.find((user) => user.email === DEMO_EMAIL)
}

export const localAuth = {
  getUser() {
    ensureDemoUser()
    const user = readJSON(SESSION_KEY, null)
    return { data: { user }, error: null }
  },

  signUp({ email, password }) {
    ensureDemoUser()
    const users = readJSON(USERS_KEY, [])
    const existingUser = users.find((user) => user.email === email)

    if (existingUser) {
      return {
        data: { user: null, session: null },
        error: new Error("Ese correo ya está registrado en modo local"),
      }
    }

    const user = createUser(email)
    users.push({ ...user, password })
    writeJSON(USERS_KEY, users)
    writeJSON(SESSION_KEY, user)

    return { data: { user, session: { user } }, error: null }
  },

  signInWithPassword({ email, password }) {
    ensureDemoUser()
    const users = readJSON(USERS_KEY, [])
    const user = users.find(
      (item) => item.email === email && item.password === password
    )

    if (!user) {
      return {
        data: { user: null, session: null },
        error: new Error("Correo o contraseña incorrectos en modo local"),
      }
    }

    const sessionUser = { id: user.id, email: user.email }
    writeJSON(SESSION_KEY, sessionUser)

    return { data: { user: sessionUser, session: { user: sessionUser } }, error: null }
  },

  signInDemo() {
    const user = ensureDemoUser()
    const sessionUser = { id: user.id, email: user.email }

    writeJSON(SESSION_KEY, sessionUser)

    return { data: { user: sessionUser, session: { user: sessionUser } }, error: null }
  },

  signOut() {
    if (hasWindow) {
      globalThis.window.localStorage.removeItem(SESSION_KEY)
    }

    return { error: null }
  },
}