import { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'
import Alert from 'react-bootstrap/Alert'
import { useAuth, useData } from '../context/contexts'
import { buildStudyContext } from '../utils/aiContext'
import { formatDay, parseISODate, todayISO } from '../utils/dates'
import {
  daysUntil,
  formatMinutes,
  sortTasks,
  subjectProgress,
  todayTasks,
  upcomingEvents,
  weekMinutes,
} from '../utils/stats'

const SUGGESTIONS = [
  '¿Qué tengo para hoy?',
  '¿Cuándo es mi próximo examen?',
  '¿Cuánto estudié esta semana?',
  '¿Cómo funciona Pomodoro?',
  '¿Cómo preparo un parcial?',
]

const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const has = (t, ...words) => words.some((w) => t.includes(w))
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// Respuestas que usan los datos del estudiante (tareas, exámenes, sesiones)
function dataReply(t, data) {
  const { tasks, events, sessions, subjects, settings, subjectName } = data

  if (has(t, 'hoy', 'que tengo', 'que hago')) {
    const pending = todayTasks(tasks).filter((task) => !task.completed)
    const todayEvents = events.filter((e) => e.date === todayISO())
    if (!pending.length && !todayEvents.length) {
      return 'Hoy no tenés tareas pendientes ni eventos. ¡Buen momento para adelantar algo o repasar!'
    }
    const parts = []
    if (pending.length) {
      parts.push(`Tenés ${plural(pending.length, 'tarea pendiente', 'tareas pendientes')}: ${pending.slice(0, 4).map((x) => `"${x.title}"`).join(', ')}.`)
    }
    if (todayEvents.length) {
      parts.push(`En el calendario: ${todayEvents.map((e) => `${e.title}${e.time ? ` (${e.time} h)` : ''}`).join(', ')}.`)
    }
    return parts.join(' ')
  }

  if (has(t, 'examen', 'parcial', 'final', 'evaluacion') && has(t, 'proximo', 'cuando', 'cuanto falta', 'tengo')) {
    const next = upcomingEvents(events, ['exam'])[0]
    if (!next) return 'No tenés exámenes cargados próximamente. Podés agregarlos en Próximos exámenes o en el Calendario.'
    const days = daysUntil(next.date)
    const when = days === 0 ? 'es hoy' : days === 1 ? 'es mañana' : `faltan ${days} días`
    return `Tu próximo examen es "${next.title}" de ${subjectName(next.subjectId)}, el ${formatDay(parseISODate(next.date))}: ${when}. ¡Armá un plan de repaso por unidades!`
  }

  if (has(t, 'pendiente', 'tareas', 'tarea')) {
    const pending = tasks.filter((x) => !x.completed).sort(sortTasks)
    if (!pending.length) return '¡No tenés tareas pendientes! 🎉'
    return `Tenés ${plural(pending.length, 'tarea pendiente', 'tareas pendientes')}. Las más urgentes: ${pending.slice(0, 3).map((x) => `"${x.title}"`).join(', ')}.`
  }

  if (has(t, 'estudie', 'horas', 'semana', 'progreso', 'objetivo')) {
    const minutes = weekMinutes(sessions)
    const goal = settings.weeklyGoalHours * 60
    const percent = goal ? Math.round((minutes / goal) * 100) : 0
    if (!minutes) return `Esta semana todavía no registraste sesiones. Tu objetivo es ${settings.weeklyGoalHours} h: empezá con un Pomodoro de ${settings.focusMinutes} minutos.`
    return `Esta semana estudiaste ${formatMinutes(minutes)} (${percent}% de tu objetivo de ${settings.weeklyGoalHours} h).${percent >= 100 ? ' ¡Objetivo cumplido!' : ` Te faltan ${formatMinutes(goal - minutes)}.`}`
  }

  if (has(t, 'materia')) {
    if (!subjects.length) return 'Todavía no cargaste materias. Podés crearlas en Mis materias.'
    return subjects
      .map((s) => `${s.name}: ${subjectProgress(s.id, tasks).percent}%`)
      .join(' · ')
  }

  return null
}

// Consejos generales de estudio
function tipReply(t) {
  if (has(t, 'pomodoro')) {
    return 'Pomodoro: estudiás 25 minutos concentrado y descansás 5. Después de 4 ciclos, hacés un descanso largo de 15. Probalo en la sección Pomodoro: cada sesión suma a tus estadísticas.'
  }
  if (has(t, 'tecnica')) {
    return 'Probá Active Recall: cerrá los apuntes y escribí todo lo que recordás del tema. Después compará con el material y repasá lo que te faltó.'
  }
  if (has(t, 'semana', 'organiz')) {
    return 'Repartí la semana por materia y dejá los días con más tiempo para lo más difícil. Reservá un bloque corto por día para repasar y evitá acumular todo para el final.'
  }
  if (has(t, 'parcial', 'examen')) {
    return 'Para el parcial: armá un resumen por unidad, hacete preguntas sin mirar los apuntes y empezá por los temas que más te cuestan.'
  }
  if (has(t, 'resum')) {
    return 'Para resumir: subrayá las ideas centrales, reescribilas con tus palabras y armá un esquema de una página por unidad.'
  }
  if (has(t, 'hola', 'buenas')) return '¡Hola! Preguntame qué tenés para hoy, cuándo es tu próximo examen o cuánto estudiaste.'
  return null
}

function getReply(text, data) {
  const t = normalize(text)
  // Las preguntas de "cómo..." piden un consejo; el resto se intenta responder con los datos
  const reply = has(t, 'como ') ? tipReply(t) ?? dataReply(t, data) : dataReply(t, data) ?? tipReply(t)
  return (
    reply ??
    'Todavía no entiendo esa consulta. Probá preguntarme qué tenés para hoy, tu próximo examen, cuánto estudiaste o pedime una técnica de estudio.'
  )
}

const AI_TIMEOUT_MS = 30000

// Pide la respuesta a la función /api/chat (que llama al modelo de IA). Devuelve el texto o lanza un error.
async function askAI(history, context, signal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: history.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
      context,
    }),
    signal,
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.reply) throw new Error(body?.error ?? `El servidor respondió con el código ${response.status}.`)
  return body.reply
}

export default function ChatAssistant() {
  const data = useData()
  const { user } = useAuth()
  const welcome = {
    id: 1,
    role: 'bot',
    text: `¡Hola, ${user.name.split(' ')[0]}! Soy tu asistente de estudio. Puedo ayudarte a organizar tu día, explicarte temas o preparar un examen. ¿En qué te ayudo?`,
  }
  const [messages, setMessages] = useState([welcome])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [notice, setNotice] = useState('')
  const nextId = useRef(2)
  const controller = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing])

  // Si el usuario sale de la página, se cancela la petición en curso
  useEffect(() => () => controller.current?.abort(), [])

  const addMessage = (role, text, extra = {}) =>
    setMessages((prev) => [...prev, { id: nextId.current++, role, text, ...extra }])

  const send = async (raw) => {
    const text = raw.trim()
    if (!text || typing) return

    // Historial que entiende la IA: sin el saludo inicial ni las respuestas del modo básico
    const history = [...messages.filter((m) => m.id !== welcome.id && !m.local), { role: 'user', text }]
    addMessage('user', text)
    setInput('')
    setTyping(true)
    setNotice('')

    const ctrl = new AbortController()
    controller.current = ctrl
    const timeout = setTimeout(() => ctrl.abort('timeout'), AI_TIMEOUT_MS)

    try {
      const reply = await askAI(history, buildStudyContext(data, user.name), ctrl.signal)
      if (controller.current === ctrl) addMessage('bot', reply)
    } catch (error) {
      if (controller.current !== ctrl) return // se reinició la conversación o se salió de la página
      if (ctrl.signal.aborted && ctrl.signal.reason !== 'timeout') return
      // Sin conexión con la IA: responde el asistente básico para no dejar al usuario sin respuesta
      const reason = ctrl.signal.aborted ? 'tardó demasiado en responder.' : error.message
      setNotice(`No pudimos usar la IA: ${reason} Te respondí en modo básico.`)
      addMessage('bot', getReply(text, data), { local: true })
    } finally {
      clearTimeout(timeout)
      if (controller.current === ctrl) setTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const clearChat = () => {
    controller.current?.abort()
    controller.current = null
    setMessages([welcome])
    setNotice('')
    setTyping(false)
  }

  return (
    <>
      <div
        ref={logRef}
        className="bg-body-tertiary border rounded-4 p-3 mb-3 overflow-auto"
        style={{ height: 300 }}
        aria-live="polite"
        aria-label="Conversación con el asistente"
      >
        <Stack gap={3}>
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="d-flex justify-content-end">
                <div className="bg-primary-subtle rounded-4 px-3 py-2" style={{ maxWidth: '80%', whiteSpace: 'pre-line' }}>
                  {m.text}
                </div>
              </div>
            ) : (
              <Stack key={m.id} direction="horizontal" gap={2} className="align-items-start">
                <ToneIcon icon="bi-robot" tone="primary" size={32} />
                <div className="bg-body border rounded-4 px-3 py-2" style={{ maxWidth: '80%', whiteSpace: 'pre-line' }}>
                  {m.text}
                  {m.local && <span className="d-block small text-secondary mt-1">Modo básico</span>}
                </div>
              </Stack>
            ),
          )}
          {typing && (
            <Stack direction="horizontal" gap={2} className="text-secondary small">
              <Spinner animation="grow" size="sm" />
              Pensando…
            </Stack>
          )}
        </Stack>
      </div>

      {notice && (
        <Alert variant="warning" className="small py-2" onClose={() => setNotice('')} dismissible>
          <i className="bi bi-wifi-off me-2"></i>{notice}
        </Alert>
      )}

      <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            variant="outline-primary"
            size="sm"
            className="rounded-pill"
            disabled={typing}
            onClick={() => send(s)}
          >
            {s}
          </Button>
        ))}
      </Stack>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu pregunta…"
            aria-label="Mensaje para el asistente"
            maxLength={2000}
          />
          <Button type="submit" variant="primary" disabled={typing || !input.trim()}>
            <i className="bi bi-send-fill me-1"></i>
            Enviar
          </Button>
        </InputGroup>
      </Form>
      <Stack direction="horizontal" gap={2} className="justify-content-between align-items-start mt-2">
        <p className="text-secondary small mb-0">
          <i className="bi bi-stars me-1"></i>
          Respuestas generadas con IA a partir de tus datos de Studify. Puede equivocarse: revisá la información importante.
        </p>
        {messages.length > 1 && (
          <Button variant="link" size="sm" className="text-secondary p-0 text-nowrap" onClick={clearChat}>
            <i className="bi bi-arrow-counterclockwise me-1"></i>Nueva conversación
          </Button>
        )}
      </Stack>
    </>
  )
}
