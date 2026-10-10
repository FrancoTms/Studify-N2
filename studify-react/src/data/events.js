import { addDays, startOfDay } from '../utils/dates'

export const EVENT_TYPES = {
  exam: { label: 'Examen', tone: 'danger', icon: 'bi-calendar-event' },
  task: { label: 'Entrega', tone: 'primary', icon: 'bi-flag' },
  study: { label: 'Estudio', tone: 'success', icon: 'bi-book' },
}

// offset = días desde hoy
const rawEvents = [
  { id: 1, title: 'Repasar teoría para el parcial', subject: 'Gestión de Desarrollo', type: 'study', offset: 0 },
  { id: 2, title: 'Parcial Unidad 1–4', subject: 'Gestión de Desarrollo', type: 'exam', cardTone: 'primary', offset: 1 },
  { id: 3, title: 'Repasar Unidad 3', subject: 'Análisis de Sistemas', type: 'study', offset: 2 },
  { id: 4, title: 'Presentación Repositorio N.º 2', subject: 'Programación', type: 'exam', cardTone: 'success', offset: 3 },
  { id: 5, title: 'Trabajo Práctico N.º 2', subject: 'Programación', type: 'task', offset: 5 },
  { id: 6, title: 'Evaluación práctica', subject: 'Análisis de Sistemas', type: 'exam', cardTone: 'warning', offset: 9 },
]

const today = startOfDay(new Date())

export const events = rawEvents.map(({ offset, ...event }) => ({
  ...event,
  date: addDays(today, offset),
}))
