// Arma un resumen en texto de los datos del estudiante para que la IA pueda responder sobre ellos.
// Solo se manda lo necesario (sin contraseñas ni datos de la cuenta).
import { EVENT_TYPES } from '../data/events'
import { formatLongDay, parseISODate, todayISO } from './dates'
import { formatMinutes, sortTasks, subjectProgress, upcomingEvents, weekMinutes } from './stats'

export function buildStudyContext(data, userName) {
  const { subjects, tasks, notes, events, sessions, settings, subjectName } = data
  const today = todayISO()
  const lines = []

  lines.push(`Nombre: ${userName}`)
  lines.push(`Hoy es ${formatLongDay(new Date())} (${today}).`)
  lines.push(`Estudio esta semana: ${formatMinutes(weekMinutes(sessions))} de un objetivo de ${settings.weeklyGoalHours} h.`)
  lines.push(`Pomodoro configurado: ${settings.focusMinutes} min de enfoque, ${settings.shortBreakMinutes} de descanso corto y ${settings.longBreakMinutes} de descanso largo.`)

  lines.push('\nMaterias:')
  if (!subjects.length) lines.push('- (ninguna cargada)')
  subjects.forEach((s) => {
    const p = subjectProgress(s.id, tasks)
    lines.push(`- ${s.name}${s.teacher ? ` (${s.teacher})` : ''}: ${p.done}/${p.total} tareas completadas (${p.percent}%)`)
  })

  // Organización del material de cada materia (unidades, temas y nombres de archivos)
  const { units = [], topics = [], files = [] } = data
  const material = subjects.filter((s) => units.some((u) => u.subjectId === s.id) || files.some((f) => f.subjectId === s.id))
  if (material.length) {
    lines.push('\nMaterial subido por materia:')
    material.forEach((s) => {
      lines.push(`- ${s.name}:`)
      units
        .filter((u) => u.subjectId === s.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .forEach((u) => {
          const unitTopics = topics.filter((t) => t.unitId === u.id).map((t) => t.name)
          const unitFiles = files.filter((f) => f.unitId === u.id).map((f) => f.name).slice(0, 8)
          lines.push(`  - ${u.name}${unitTopics.length ? ` (temas: ${unitTopics.join(', ')})` : ''}${unitFiles.length ? ` | archivos: ${unitFiles.join(', ')}` : ''}`)
        })
      const loose = files.filter((f) => f.subjectId === s.id && !f.unitId).map((f) => f.name).slice(0, 8)
      if (loose.length) lines.push(`  - Sin unidad | archivos: ${loose.join(', ')}`)
    })
  }

  const pending = tasks.filter((t) => !t.completed).sort(sortTasks).slice(0, 15)
  lines.push('\nTareas pendientes (fecha límite AAAA-MM-DD):')
  if (!pending.length) lines.push('- (ninguna)')
  pending.forEach((t) => {
    const due = t.dueDate ? (t.dueDate < today ? `vencida el ${t.dueDate}` : `vence ${t.dueDate}`) : 'sin fecha'
    lines.push(`- ${t.title} | ${subjectName(t.subjectId)} | prioridad ${t.priority} | ${due}`)
  })

  const upcoming = upcomingEvents(events, ['exam', 'task', 'study']).slice(0, 10)
  lines.push('\nPróximos eventos del calendario:')
  if (!upcoming.length) lines.push('- (ninguno)')
  upcoming.forEach((e) => {
    const type = EVENT_TYPES[e.type]?.label ?? 'Evento'
    lines.push(`- ${type}: ${e.title} | ${subjectName(e.subjectId)} | ${formatLongDay(parseISODate(e.date))}${e.time ? ` a las ${e.time}` : ''}`)
  })

  const recentNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6)
  lines.push('\nApuntes recientes (fragmento):')
  if (!recentNotes.length) lines.push('- (ninguno)')
  recentNotes.forEach((n) => {
    const snippet = n.content.replace(/\s+/g, ' ').slice(0, 400)
    lines.push(`- ${n.title} (${subjectName(n.subjectId)}): ${snippet}`)
  })

  return lines.join('\n')
}
