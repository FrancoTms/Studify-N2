import { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import Stack from 'react-bootstrap/Stack'
import ToneIcon from './ToneIcon'

const SUGGESTIONS = [
  '¿Cómo funciona Pomodoro?',
  'Dame una técnica de estudio',
  '¿Cómo organizo mi semana?',
  '¿Cómo preparo un parcial?',
]

// Respuestas simuladas
function getReply(text) {
  const t = text.toLowerCase()
  if (t.includes('pomodoro')) {
    return 'Pomodoro: estudiás 25 minutos concentrado y descansás 5. Después de 4 ciclos, hacés un descanso largo de 15. Podés probarlo en la sección Pomodoro de esta misma página.'
  }
  if (t.includes('técnica') || t.includes('tecnica')) {
    return 'Probá Active Recall: cerrá los apuntes y escribí todo lo que recordás del tema. Después compará con el material y repasá lo que te faltó.'
  }
  if (t.includes('semana') || t.includes('organiz')) {
    return 'Repartí la semana por materia y dejá los días con más tiempo para lo más difícil. Reservá un bloque corto por día para repasar y evitá acumular todo para el final.'
  }
  if (t.includes('parcial') || t.includes('examen')) {
    return 'Para el parcial: armá un resumen por unidad, hacete preguntas sin mirar los apuntes y empezá por los temas que más te cuestan.'
  }
  if (t.includes('resum')) {
    return 'Para resumir: subrayá las ideas centrales, reescribilas con tus palabras y armá un esquema de una página por unidad.'
  }
  return 'Soy un asistente de demostración y todavía no entiendo esa consulta. Probá con Pomodoro, técnicas de estudio, organizar tu semana o preparar un parcial.'
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: '¡Hola! Soy tu asistente de estudio. ¿En qué te ayudo hoy?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const nextId = useRef(2)
  const timer = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing])

  useEffect(() => () => clearTimeout(timer.current), [])

  const send = (raw) => {
    const text = raw.trim()
    if (!text || typing) return

    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', text }])
    setInput('')
    setTyping(true)

    timer.current = setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId.current++, role: 'bot', text: getReply(text) }])
      setTyping(false)
    }, 800)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
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
                <div className="bg-primary-subtle rounded-4 px-3 py-2" style={{ maxWidth: '80%' }}>
                  {m.text}
                </div>
              </div>
            ) : (
              <Stack key={m.id} direction="horizontal" gap={2} className="align-items-start">
                <ToneIcon icon="bi-robot" tone="primary" size={32} />
                <div className="bg-body border rounded-4 px-3 py-2" style={{ maxWidth: '80%' }}>
                  {m.text}
                </div>
              </Stack>
            ),
          )}
          {typing && (
            <Stack direction="horizontal" gap={2} className="text-secondary small">
              <Spinner animation="grow" size="sm" />
              Escribiendo…
            </Stack>
          )}
        </Stack>
      </div>

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
          />
          <Button type="submit" variant="primary" disabled={typing || !input.trim()}>
            <i className="bi bi-send-fill me-1"></i>
            Enviar
          </Button>
        </InputGroup>
      </Form>
      <p className="text-secondary small mt-2 mb-0">
        Asistente de demostración: las respuestas son simuladas.
      </p>
    </>
  )
}
