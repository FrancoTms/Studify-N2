import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Stack from 'react-bootstrap/Stack'
import SubjectSelect from './SubjectSelect'
import { usePomodoro } from '../context/contexts'

const pad = (n) => String(n).padStart(2, '0')

// La lógica del reloj está en PomodoroProvider; este componente solo lo muestra y lo controla
export default function PomodoroTimer() {
  const {
    mode,
    modes,
    modeInfo,
    secondsLeft,
    total,
    running,
    finished,
    started,
    subjectId,
    setSubjectId,
    todaySessions,
    startPause,
    reset,
    changeMode,
  } = usePomodoro()

  const { label, tone } = modeInfo
  const progress = total ? (secondsLeft / total) * 100 : 0
  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60

  let status = 'Listo para empezar'
  if (running) status = 'En curso'
  else if (finished) status = mode === 'focus' ? '¡Sesión terminada!' : '¡Descanso terminado!'
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
        {Object.entries(modes).map(([key, m]) => {
          const checked = mode === key
          return (
            <ToggleButton
              key={key}
              id={`pomodoro-mode-${key}`}
              type="radio"
              name="pomodoro-mode"
              value={key}
              checked={checked}
              onChange={() => changeMode(key)}
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

      {mode === 'focus' && (
        <Form.Group controlId="pomodoro-subject" className="w-100" style={{ maxWidth: 320 }}>
          <Form.Label className="small fw-semibold mb-1">¿Qué materia vas a estudiar?</Form.Label>
          <SubjectSelect value={subjectId} onChange={setSubjectId} size="sm" />
        </Form.Group>
      )}

      {/* Controles: acción principal grande + reinicio circular */}
      <Stack direction="horizontal" gap={3} className="justify-content-center">
        <Button
          variant="primary"
          size="lg"
          className="rounded-pill px-5 fw-bold shadow-sm"
          onClick={startPause}
        >
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'} me-2`}></i>
          {running ? 'Pausar' : started ? 'Continuar' : finished ? 'Repetir' : 'Iniciar'}
        </Button>
        <Button
          variant="outline-secondary"
          className="rounded-circle lh-1 p-3"
          onClick={reset}
          disabled={!started && !running && !finished}
          aria-label="Reiniciar"
          title="Reiniciar"
        >
          <i className="bi bi-arrow-counterclockwise fs-5"></i>
        </Button>
      </Stack>

      {finished && mode === 'focus' && (
        <Stack direction="horizontal" gap={2} className="flex-wrap justify-content-center">
          <span className="small text-secondary">¿Y ahora?</span>
          <Button size="sm" variant="outline-success" className="rounded-pill" onClick={() => changeMode(todaySessions.length % 4 === 0 ? 'long' : 'short')}>
            Tomar un descanso
          </Button>
        </Stack>
      )}
      {finished && mode !== 'focus' && (
        <Button size="sm" variant="outline-primary" className="rounded-pill" onClick={() => changeMode('focus')}>
          Volver a enfocarme
        </Button>
      )}

      <p className="text-secondary small mb-0">
        Sesiones de enfoque completadas hoy: <strong>{todaySessions.length}</strong>
      </p>
    </Stack>
  )
}
