import { useEffect, useMemo, useState } from 'react'
import { DataContext } from './contexts'
import { DEFAULT_SETTINGS, createSampleData, emptyData } from '../data/sampleData'
import { dataKeyFor, readJSON, writeJSON } from '../utils/storage'
import { uid } from '../utils/id'
import { deleteBlob, deleteBlobs, loadBlob, requestPersistence, saveBlob } from '../utils/fileStore'
import { MAX_FILE_SIZE } from '../utils/files'

const COLLECTIONS = ['subjects', 'tasks', 'notes', 'events', 'sessions', 'units', 'topics', 'files']

// Une lo guardado con la estructura actual, por si falta alguna colección
function normalize(saved) {
  const base = emptyData()
  const data = { ...base, settings: { ...DEFAULT_SETTINGS, ...(saved?.settings ?? {}) } }
  COLLECTIONS.forEach((key) => {
    data[key] = Array.isArray(saved?.[key]) ? saved[key] : []
  })
  return data
}

// Al importar una copia: los archivos no viajan en el JSON, así que se conservan los actuales
// que sigan teniendo materia, y se corrigen las unidades o temas que ya no existan
function reconcileFiles(imported, currentFiles) {
  const subjectIds = new Set(imported.subjects.map((s) => s.id))
  const unitIds = new Set(imported.units.map((u) => u.id))
  const topicIds = new Set(imported.topics.map((t) => t.id))
  const kept = currentFiles
    .filter((f) => subjectIds.has(f.subjectId))
    .map((f) => {
      const unitId = unitIds.has(f.unitId) ? f.unitId : null
      return { ...f, unitId, topicId: unitId && topicIds.has(f.topicId) ? f.topicId : null }
    })
  const keptIds = new Set(kept.map((f) => f.id))
  return { kept, removedIds: currentFiles.filter((f) => !keptIds.has(f.id)).map((f) => f.id) }
}

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

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
      // Sus unidades, temas y archivos sí se eliminan, porque pertenecen solo a esa materia
      deleteSubject: async (id) => {
        await deleteBlobs(data.files.filter((f) => f.subjectId === id).map((f) => f.id)).catch(() => {})
        setData((d) => {
          const detach = (item) => (item.subjectId === id ? { ...item, subjectId: null } : item)
          const unitIds = new Set(d.units.filter((u) => u.subjectId === id).map((u) => u.id))
          return {
            ...d,
            subjects: d.subjects.filter((s) => s.id !== id),
            tasks: d.tasks.map(detach),
            notes: d.notes.map(detach),
            events: d.events.map(detach),
            sessions: d.sessions.map(detach),
            units: d.units.filter((u) => u.subjectId !== id),
            topics: d.topics.filter((t) => !unitIds.has(t.unitId)),
            files: d.files.filter((f) => f.subjectId !== id),
          }
        })
      },

      // Unidades de una materia (ordenadas con "order")
      addUnit: ({ subjectId, name }) =>
        add('units', {
          subjectId,
          name,
          order: data.units.filter((u) => u.subjectId === subjectId).length,
          createdAt: now(),
        }),
      updateUnit: (id, changes) => update('units', id, changes),
      // direction: -1 sube, 1 baja
      moveUnit: (id, direction) =>
        setData((d) => {
          const unit = d.units.find((u) => u.id === id)
          if (!unit) return d
          const siblings = d.units.filter((u) => u.subjectId === unit.subjectId).sort(byOrder)
          const i = siblings.findIndex((u) => u.id === id)
          const j = i + direction
          if (j < 0 || j >= siblings.length) return d
          ;[siblings[i], siblings[j]] = [siblings[j], siblings[i]]
          const order = Object.fromEntries(siblings.map((u, k) => [u.id, k]))
          return { ...d, units: d.units.map((u) => (u.id in order ? { ...u, order: order[u.id] } : u)) }
        }),
      // Borra la unidad con sus temas y archivos
      deleteUnit: async (id) => {
        await deleteBlobs(data.files.filter((f) => f.unitId === id).map((f) => f.id)).catch(() => {})
        setData((d) => ({
          ...d,
          units: d.units.filter((u) => u.id !== id),
          topics: d.topics.filter((t) => t.unitId !== id),
          files: d.files.filter((f) => f.unitId !== id),
        }))
      },

      // Temas dentro de una unidad
      addTopic: ({ unitId, name }) => add('topics', { unitId, name, createdAt: now() }),
      updateTopic: (id, changes) => update('topics', id, changes),
      deleteTopic: async (id) => {
        await deleteBlobs(data.files.filter((f) => f.topicId === id).map((f) => f.id)).catch(() => {})
        setData((d) => ({
          ...d,
          topics: d.topics.filter((t) => t.id !== id),
          files: d.files.filter((f) => f.topicId !== id),
        }))
      },

      // Archivos: el contenido va a IndexedDB y los datos del archivo quedan acá.
      // Devuelve { added, rejected } para avisar qué no se pudo subir y por qué.
      uploadFiles: async ({ subjectId, unitId, topicId, files }) => {
        const added = []
        const rejected = []
        requestPersistence()
        for (const file of files) {
          if (file.size > MAX_FILE_SIZE) {
            rejected.push({ name: file.name, reason: 'supera los 50 MB' })
            continue
          }
          const id = uid()
          try {
            await saveBlob(id, file)
            added.push({
              id,
              subjectId,
              unitId: unitId || null,
              topicId: topicId || null,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedAt: now(),
            })
          } catch (error) {
            rejected.push({
              name: file.name,
              reason: error?.name === 'QuotaExceededError' ? 'no hay espacio suficiente en el navegador' : 'no se pudo guardar',
            })
          }
        }
        if (added.length) setData((d) => ({ ...d, files: [...d.files, ...added] }))
        return { added, rejected }
      },
      updateFile: (id, changes) => update('files', id, changes),
      deleteFile: async (id) => {
        await deleteBlob(id).catch(() => {})
        remove('files', id)
      },
      getFileBlob: (id) => loadBlob(id),

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

      loadSampleData: async () => {
        await deleteBlobs(data.files.map((f) => f.id)).catch(() => {})
        setData((d) => createSampleData(d.settings))
      },
      resetData: async () => {
        await deleteBlobs(data.files.map((f) => f.id)).catch(() => {})
        setData((d) => ({ ...emptyData(), settings: d.settings }))
      },
      importData: async (imported) => {
        const next = normalize(imported)
        const { kept, removedIds } = reconcileFiles(next, data.files)
        await deleteBlobs(removedIds).catch(() => {})
        setData({ ...next, files: kept })
      },
      // La copia exportada no incluye los archivos (solo texto); pueden ocupar cientos de MB
      exportData: () => {
        const copy = { ...data }
        delete copy.files
        return copy
      },
      // Borra el contenido de todos los archivos (al eliminar la cuenta)
      purgeFiles: () => deleteBlobs(data.files.map((f) => f.id)).catch(() => {}),
    }
  }, [data])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
