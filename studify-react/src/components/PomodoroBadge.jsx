import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import { usePomodoro } from '../context/contexts'

const pad = (n) => String(n).padStart(2, '0')

// Muestra el tiempo del Pomodoro en la barra superior mientras está en marcha o en pausa
export default function PomodoroBadge({ compact = false }) {
  const { running, started, secondsLeft, modeInfo } = usePomodoro()
  if (!running && !started) return null

  const time = `${pad(Math.floor(secondsLeft / 60))}:${pad(secondsLeft % 60)}`

  return (
    <Badge
      as={Link}
      to="/pomodoro"
      bg={modeInfo.tone}
      pill
      className="text-decoration-none d-inline-flex align-items-center gap-1 px-3 py-2"
      title="Ir al Pomodoro"
    >
      <i className={`bi ${running ? 'bi-alarm-fill' : 'bi-pause-fill'}`}></i>
      {!compact && <span>{modeInfo.label} ·</span>}
      <span className="font-monospace">{time}</span>
    </Badge>
  )
}
