import { useEffect, useRef, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Stack from 'react-bootstrap/Stack'

const MODES = {
  focus: { label: 'Enfoque', tab: 'Enfoque', minutes: 25, tone: 'primary' },
  short: { label: 'Descanso corto', tab: 'Corto', minutes: 5, tone: 'success' },
  long: { label: 'Descanso largo', tab: 'Largo', minutes: 15, tone: 'info' },
}

const pad = (n) => String(n).padStart(2, '0')

export default function PomodoroTimer() {
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const endRef = useRef(0)

  const { label, minutes, tone } = MODES[mode]
  const total = minutes * 60
  const progress = (secondsLeft / total) * 100
  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60
  const finished = secondsLeft === 0
  const started = secondsLeft < total && !finished

  // Calcula el tiempo restante contra la hora de fin, así no se atrasa si la pestaña queda en segundo plano
  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000))
      setSecondsLeft(left)
      if (left === 0) {
        setRunning(false)
        if (mode === 'focus') setSessions((n) => n + 1)
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, mode])

  const handleStartPause = () => {
    if (running) {
      setRunning(false)
      return
    }
    const start = finished ? total : secondsLeft
    setSecondsLeft(start)
    endRef.current = Date.now() + start * 1000
    setRunning(true)
  }

  const handleReset = () => {
    setRunning(false)
    setSecondsLeft(total)
  }

  const handleMode = (key) => {
    setMode(key)
    setRunning(false)
    setSecondsLeft(MODES[key].minutes * 60)
  }

  let status = 'Listo para empezar'
  if (running) status = 'En curso'
  else if (finished) status = '¡Sesión terminada!'
  else if (started) status = 'En pausa'

  return (
    <Stack gap={4} className="align-items-center text-center">
      {/* Selector de sesión: control segmentado con forma de píldora */}
      <Stack
        direction="horizontal"
        gap={1}
        role="radiogroup"
        aria-label="Tipo de sesión"
        className="bg-body-tertiary border rounded-pill p-1"
      >
        {Object.entries(MODES).map(([key, m]) => {
          const checked = mode === key
          return (
            <ToggleButton
              key={key}
              id={`pomodoro-mode-${key}`}
              type="radio"
              name="pomodoro-mode"
              value={key}
              checked={checked}
              onChange={() => handleMode(key)}
              variant={checked ? 'primary' : 'link'}
              size="sm"
              title={m.label}
              className={`rounded-pill px-3 fw-semibold ${checked ? 'shadow-sm' : 'text-body text-decoration-none'}`}
            >
              {m.tab}
              <span className="d-none d-sm-inline opacity-75"> · {m.minutes} min</span>
            </ToggleButton>
          )
        })}
      </Stack>

      <div
        role="timer"
        aria-label={`${label}: ${pad(mm)}:${pad(ss)}`}
        className="rounded-circle d-flex align-items-center justify-content-center p-2 shadow-sm"
        style={{
          width: 220,
          height: 220,
          background: `conic-gradient(rgb(var(--bs-${tone}-rgb)) ${progress}%, rgba(var(--bs-${tone}-rgb), .18) 0)`,
        }}
      >
        <div
          className="rounded-circle w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{ background: 'var(--sf-surface)' }}
        >
          <Badge bg={tone} className="mb-2">{label}</Badge>
          <span className="display-5 fw-bold lh-1">{pad(mm)}:{pad(ss)}</span>
          <span className="small text-secondary mt-2">{status}</span>
        </div>
      </div>

      {/* Controles: acción principal grande + reinicio circular */}
      <Stack direction="horizontal" gap={3} className="justify-content-center">
        <Button
          variant="primary"
          size="lg"
          className="rounded-pill px-5 fw-bold shadow-sm"
          onClick={handleStartPause}
        >
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'} me-2`}></i>
          {running ? 'Pausar' : started ? 'Continuar' : 'Iniciar'}
        </Button>
        <Button
          variant="outline-secondary"
          className="rounded-circle lh-1 p-3"
          onClick={handleReset}
          disabled={!started && !running && !finished}
          aria-label="Reiniciar"
          title="Reiniciar"
        >
          <i className="bi bi-arrow-counterclockwise fs-5"></i>
        </Button>
      </Stack>

      <p className="text-secondary small mb-0">
        Sesiones de enfoque completadas: <strong>{sessions}</strong>
      </p>
    </Stack>
  )
}