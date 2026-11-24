// Pequeño envoltorio de localStorage: si el navegador lo bloquea o está lleno, la app sigue funcionando

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sin espacio o sin permiso: los datos quedan solo en memoria
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Nada que hacer
  }
}

// Clave donde se guardan los datos de estudio de cada cuenta
export const dataKeyFor = (email) => `studify-data:${email}`
