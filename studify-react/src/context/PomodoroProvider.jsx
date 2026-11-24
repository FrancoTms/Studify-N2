import { useEffect, useMemo, useRef, useState } from 'react'
import { PomodoroContext, useData } from './contexts'
import { isSameDay } from '../utils/dates'
import { showToast } from '../utils/alerts'
import { POMODORO_MODES } from '../data/catalog'

// Sonido corto al terminar una sesión (no necesita archivos de audio)
function beep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  } catch {
    // El navegador no permite reproducir sonido
  }
}

// El temporizador vive en el layout: sigue corriendo aunque el usuario cambie de página
export default function PomodoroProvider({ children }) {
  const { settings, sessions, addSession } = useData()
  const [mode, setMode] = useState('focus')
  const [running, setRunning] = useState(false)
  const [subjectId, setSubjectId] = useState('')
  const minutes = settings[POMODORO_MODES[mode].setting]
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const endRef = useRef(0)
  const doneRef = useRef(false)

  const total = minutes * 60
  const finished = secondsLeft === 0
  const started = secondsLeft < total && !finished

  // Si cambian los minutos desde Configuración y el reloj está quieto, se actualiza
  useEffect(() => {
    if (!running) setSecondsLeft(minutes * 60)
  }, [minutes])

  // Calcula el tiempo restante contra la hora de fin, así no se atrasa si la pestaña queda en segundo plano
  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000))
      setSecondsLeft(left)
      if (left === 0 && !doneRef.current) {
        doneRef.current = true
        setRunning(false)
        beep()
        if (mode === 'focus') {
          addSession({ minutes, subjectId: subjectId || null })
          showToast(`¡Sesión completada! Sumaste ${minutes} min de estudio.`)
        } else {
          showToast('¡Terminó el descanso! A seguir estudiando.', 'info')
        }
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, mode, minutes, subjectId, addSession])

  const value = useMemo(() => {
    const today = new Date()
    const todaySessions = sessions.filter((s) => isSameDay(new Date(s.date), today))

    return {
      mode,
      modeInfo: { ...POMODORO_MODES[mode], minutes },
      modes: Object.fromEntries(
        Object.entries(POMODORO_MODES).map(([key, m]) => [key, { ...m, minutes: settings[m.setting] }]),
      ),
      secondsLeft,
      total,
      running,
      finished,
      started,
      subjectId,
      setSubjectId,
      todaySessions,

      startPause() {
        if (running) {
          setRunning(false)
          return
        }
        const start = finished ? total : secondsLeft
        setSecondsLeft(start)
        endRef.current = Date.now() + start * 1000
        doneRef.current = false
        setRunning(true)
      },

      reset() {
        setRunning(false)
        setSecondsLeft(total)
      },

      changeMode(key) {
        setMode(key)
        setRunning(false)
        setSecondsLeft(settings[POMODORO_MODES[key].setting] * 60)
      },
    }
  }, [mode, minutes, settings, secondsLeft, total, running, finished, started, subjectId, sessions])

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}
