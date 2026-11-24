// Cálculos a partir de los datos guardados (progreso, horas, próximos eventos)
import { PRIORITY_ORDER } from '../data/catalog'
import { addDays, daysFromToday, isSameDay, parseISODate, startOfWeek, todayISO } from './dates'

export const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// "1h 30m", "45m", "2h"
export function formatMinutes(totalMinutes) {
  const total = Math.round(totalMinutes)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

// Orden de tareas: pendientes primero, después por vencimiento y prioridad
export function sortTasks(a, b) {
  if (a.completed !== b.completed) return a.completed ? 1 : -1
  const dueA = a.dueDate || '9999-12-31'
  const dueB = b.dueDate || '9999-12-31'
  if (dueA !== dueB) return dueA.localeCompare(dueB)
  return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
}

// Plan de hoy: pendientes que vencen hoy o están atrasadas, más las que se completaron hoy
export function todayTasks(tasks) {
  const today = todayISO()
  return tasks
    .filter((t) => {
      if (!t.dueDate) return false
      if (!t.completed) return t.dueDate <= today
      return t.dueDate === today || (t.completedAt && isSameDay(new Date(t.completedAt), new Date()))
    })
    .sort(sortTasks)
}

export function subjectProgress(subjectId, tasks) {
  const own = tasks.filter((t) => t.subjectId === subjectId)
  const done = own.filter((t) => t.completed).length
  const nextTask = own.filter((t) => !t.completed).sort(sortTasks)[0] ?? null
  return {
    total: own.length,
    done,
    percent: own.length ? Math.round((done / own.length) * 100) : 0,
    nextTask,
  }
}

// Eventos desde hoy en adelante, ordenados por fecha
export function upcomingEvents(events, types = ['exam', 'task']) {
  const today = todayISO()
  return events
    .filter((e) => types.includes(e.type) && e.date >= today)
    .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
}

export const daysUntil = (isoDate) => daysFromToday(parseISODate(isoDate))

export function minutesInRange(sessions, from, to) {
  return sessions
    .filter((s) => {
      const d = new Date(s.date)
      return d >= from && d < to
    })
    .reduce((sum, s) => sum + s.minutes, 0)
}

// Horas por día (de lunes a domingo) de la semana que contiene a "ref"
export function weeklyHours(sessions, ref = new Date()) {
  const start = startOfWeek(ref)
  return WEEKDAYS.map((day, i) => {
    const from = addDays(start, i)
    return { day, hours: minutesInRange(sessions, from, addDays(from, 1)) / 60 }
  })
}

export function weekMinutes(sessions, ref = new Date()) {
  const start = startOfWeek(ref)
  return minutesInRange(sessions, start, addDays(start, 7))
}

// Materias con actividad (sesión, tarea completada o apunte editado) en los últimos 7 días
export function activeSubjectIds(data, days = 7) {
  const since = addDays(new Date(), -days)
  const ids = new Set()
  data.sessions.forEach((s) => s.subjectId && new Date(s.date) >= since && ids.add(s.subjectId))
  data.tasks.forEach((t) => t.subjectId && t.completedAt && new Date(t.completedAt) >= since && ids.add(t.subjectId))
  data.notes.forEach((n) => n.subjectId && new Date(n.updatedAt) >= since && ids.add(n.subjectId))
  return ids
}

// Días seguidos (terminando hoy o ayer) con al menos una sesión de estudio
export function studyStreak(sessions) {
  const days = new Set(sessions.map((s) => new Date(s.date).toDateString()))
  let cursor = new Date()
  if (!days.has(cursor.toDateString())) cursor = addDays(cursor, -1)
  let streak = 0
  while (days.has(cursor.toDateString())) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}
