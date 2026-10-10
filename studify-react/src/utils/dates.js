const MONTH_YEAR = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })
const LONG_DAY = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
const SHORT_DAY = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' })

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

// Días que faltan desde hoy (0 = hoy, 1 = mañana)
export const daysFromToday = (d) => Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000)

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export const formatMonthYear = (d) => MONTH_YEAR.format(d) // "octubre de 2026"
export const formatLongDay = (d) => LONG_DAY.format(d)     // "domingo, 11 de octubre"
export const formatDay = (d) => SHORT_DAY.format(d)        // "11 de octubre"
