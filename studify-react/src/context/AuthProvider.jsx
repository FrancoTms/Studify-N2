import { useMemo, useState } from 'react'
import { AuthContext } from './contexts'
import { dataKeyFor, readJSON, removeKey, writeJSON } from '../utils/storage'
import { uid } from '../utils/id'

// Simulación de cuentas del lado del cliente: los usuarios se guardan en el navegador (localStorage).
// La contraseña nunca se guarda en texto plano, sino su hash SHA-256.
const USERS_KEY = 'studify-users'
const SESSION_KEY = 'studify-session'

const GUEST = { id: 'guest', name: 'Invitado', email: 'invitado@studify.app', guest: true }

const normalizeEmail = (email) => email.trim().toLowerCase()
// Copia del usuario sin el hash de la contraseña (lo que usa el resto de la app)
const publicUser = (user) => {
  const copy = { ...user }
  delete copy.passwordHash
  return copy
}

async function hashPassword(email, password) {
  const text = `${email}:${password}`
  if (globalThis.crypto?.subtle) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Respaldo para contextos sin crypto.subtle (por ejemplo, http en la red local)
  let hash = 5381
  for (let i = 0; i < text.length; i += 1) hash = (hash * 33) ^ text.charCodeAt(i)
  return `djb2-${(hash >>> 0).toString(16)}`
}

const readUsers = () => readJSON(USERS_KEY, [])

function restoreSession() {
  const session = readJSON(SESSION_KEY, null)
  if (!session) return null
  if (session.guest) return GUEST
  const user = readUsers().find((u) => u.email === session.email)
  return user ? publicUser(user) : null
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession)

  const value = useMemo(() => {
    const startSession = (u) => {
      writeJSON(SESSION_KEY, u.guest ? { guest: true } : { email: u.email })
      setUser(publicUser(u))
    }

    const saveUsers = (users) => writeJSON(USERS_KEY, users)

    return {
      user,

      async register({ name, email, password }) {
        const cleanEmail = normalizeEmail(email)
        const users = readUsers()
        if (users.some((u) => u.email === cleanEmail)) {
          throw new Error('Ya existe una cuenta con ese correo.')
        }
        const newUser = {
          id: uid(),
          name: name.trim(),
          email: cleanEmail,
          passwordHash: await hashPassword(cleanEmail, password),
          createdAt: new Date().toISOString(),
        }
        saveUsers([...users, newUser])
        startSession(newUser)
      },

      async login({ email, password }) {
        const cleanEmail = normalizeEmail(email)
        const found = readUsers().find((u) => u.email === cleanEmail)
        if (!found) {
          const error = new Error('No encontramos una cuenta con ese correo.')
          error.field = 'email'
          throw error
        }
        if (found.passwordHash !== (await hashPassword(cleanEmail, password))) {
          const error = new Error('La contraseña es incorrecta.')
          error.field = 'password'
          throw error
        }
        startSession(found)
      },

      loginAsGuest() {
        startSession(GUEST)
      },

      logout() {
        removeKey(SESSION_KEY)
        setUser(null)
      },

      updateProfile({ name }) {
        if (!user || user.guest) return
        const users = readUsers().map((u) => (u.email === user.email ? { ...u, name: name.trim() } : u))
        saveUsers(users)
        setUser((prev) => ({ ...prev, name: name.trim() }))
      },

      async changePassword(current, next) {
        const users = readUsers()
        const found = users.find((u) => u.email === user?.email)
        if (!found) throw new Error('No se encontró la cuenta.')
        if (found.passwordHash !== (await hashPassword(found.email, current))) {
          throw new Error('La contraseña actual es incorrecta.')
        }
        const passwordHash = await hashPassword(found.email, next)
        saveUsers(users.map((u) => (u.email === found.email ? { ...u, passwordHash } : u)))
      },

      deleteAccount() {
        if (!user) return
        if (!user.guest) saveUsers(readUsers().filter((u) => u.email !== user.email))
        removeKey(dataKeyFor(user.email))
        removeKey(SESSION_KEY)
        setUser(null)
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
