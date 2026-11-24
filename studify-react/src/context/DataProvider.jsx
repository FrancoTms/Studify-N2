import { useEffect, useMemo, useState } from 'react'
import { DataContext } from './contexts'
import { DEFAULT_SETTINGS, createSampleData, emptyData } from '../data/sampleData'
import { dataKeyFor, readJSON, writeJSON } from '../utils/storage'
import { uid } from '../utils/id'

const COLLECTIONS = ['subjects', 'tasks', 'notes', 'events', 'sessions']

// Une lo guardado con la estructura actual, por si falta alguna colección
function normalize(saved) {
  const base = emptyData()
  const data = { ...base, settings: { ...DEFAULT_SETTINGS, ...(saved?.settings ?? {}) } }
  COLLECTIONS.forEach((key) => {
    data[key] = Array.isArray(saved?.[key]) ? saved[key] : []
  })
  return data
}

function load(storageKey, isGuest) {
  const saved = readJSON(storageKey, null)
  if (saved) return normalize(saved)
  return isGuest ? createSampleData() : emptyData()
}

// Guarda todos los datos de estudio del usuario que inició sesión.
// Se monta con key={user.email}, así cada cuenta tiene sus propios datos.
export default function DataProvider({ user, children }) {
  const storageKey = dataKeyFor(user.email)
  const [data, setData] = useState(() => load(storageKey, user.guest))

  useEffect(() => {
    writeJSON(storageKey, data)
  }, [storageKey, data])

  const value = useMemo(() => {
    const now = () => new Date().toISOString()

    const add = (collection, item) => {
      const record = { id: uid(), ...item }
      setData((d) => ({ ...d, [collection]: [...d[collection], record] }))
      return record
    }
    const update = (collection, id, changes) =>
      setData((d) => ({
        ...d,
        [collection]: d[collection].map((item) => (item.id === id ? { ...item, ...changes } : item)),
      }))
    const remove = (collection, id) =>
      setData((d) => ({ ...d, [collection]: d[collection].filter((item) => item.id !== id) }))

    const subjectById = Object.fromEntries(data.subjects.map((s) => [s.id, s]))

    return {
      ...data,
      subjectById,
      subjectName: (id) => subjectById[id]?.name ?? 'Sin materia',

      // Materias
      addSubject: (subject) => add('subjects', { ...subject, createdAt: now() }),
      updateSubject: (id, changes) => update('subjects', id, changes),
      // Al borrar una materia, sus tareas, apuntes y eventos quedan "sin materia" (no se pierden)
      deleteSubject: (id) =>
        setData((d) => {
          const detach = (item) => (item.subjectId === id ? { ...item, subjectId: null } : item)
          return {
            ...d,
            subjects: d.subjects.filter((s) => s.id !== id),
            tasks: d.tasks.map(detach),
            notes: d.notes.map(detach),
            events: d.events.map(detach),
            sessions: d.sessions.map(detach),
          }
        }),

      // Tareas
      addTask: (task) => add('tasks', { completed: false, ...task, createdAt: now() }),
      updateTask: (id, changes) => update('tasks', id, changes),
      deleteTask: (id) => remove('tasks', id),
      toggleTask: (id) =>
        setData((d) => ({
          ...d,
          tasks: d.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed, completedAt: t.completed ? null : now() } : t,
          ),
        })),
      clearCompletedTasks: () => setData((d) => ({ ...d, tasks: d.tasks.filter((t) => !t.completed) })),

      // Apuntes
      addNote: (note) => add('notes', { ...note, createdAt: now(), updatedAt: now() }),
      updateNote: (id, changes) => update('notes', id, { ...changes, updatedAt: now() }),
      deleteNote: (id) => remove('notes', id),

      // Exámenes, entregas y sesiones planificadas
      addEvent: (event) => add('events', event),
      updateEvent: (id, changes) => update('events', id, changes),
      deleteEvent: (id) => remove('events', id),

      // Sesiones de Pomodoro terminadas
      addSession: (session) => add('sessions', { date: now(), ...session }),
      deleteSession: (id) => remove('sessions', id),

      updateSettings: (changes) => setData((d) => ({ ...d, settings: { ...d.settings, ...changes } })),

      loadSampleData: () => setData((d) => createSampleData(d.settings)),
      resetData: () => setData((d) => ({ ...emptyData(), settings: d.settings })),
      importData: (imported) => setData(normalize(imported)),
      exportData: () => data,
    }
  }, [data])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
