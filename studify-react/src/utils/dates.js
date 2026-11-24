const MONTH_YEAR = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })
const LONG_DAY = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const SHORT_DAY = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' })
const TIME = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })

const pad = (n) => String(n).padStart(2, '0')

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
// Lunes de la semana de la fecha recibida
export const startOfWeek = (d) => addDays(startOfDay(d), -((d.getDay() + 6) % 7))

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

// Las fechas sin hora se guardan como texto "AAAA-MM-DD" (en hora local, sin problemas de zona horaria)
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseISODate = (text) => {
  const [y, m, d] = text.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const todayISO = () => toISODate(new Date())

// Días que faltan desde hoy (0 = hoy, 1 = mañana, negativo = ya pasó)
export const daysFromToday = (d) => Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000)

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export const formatMonthYear = (d) => MONTH_YEAR.format(d) // "octubre de 2026"
export const formatLongDay = (d) => LONG_DAY.format(d)     // "domingo, 11 de octubre"
export const formatDay = (d) => SHORT_DAY.format(d)        // "11 de octubre"
export const formatTime = (d) => TIME.format(d)            // "14:30"

// "hoy", "ayer", "hace 3 días", "el 2 de octubre"
export function formatRelative(value) {
  const days = -daysFromToday(new Date(value))
  if (days <= 0) return 'hoy'
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} días`
  return `el ${formatDay(new Date(value))}`
}

// Texto para un vencimiento: "Hoy", "Mañana", "En 3 días", "Venció hace 2 días"
export function formatDue(isoDate) {
  const days = daysFromToday(parseISODate(isoDate))
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  if (days > 1) return `En ${days} días`
  if (days === -1) return 'Venció ayer'
  return `Venció hace ${-days} días`
}
