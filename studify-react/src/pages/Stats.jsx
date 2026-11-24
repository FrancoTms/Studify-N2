import { useState } from 'react'
import { Link } from 'react-router-dom'
import BsProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import PanelSection from '../components/PanelSection'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'
import WeeklyChart from '../components/WeeklyChart'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useData } from '../context/contexts'
import { addDays, formatDay, isSameDay, startOfWeek } from '../utils/dates'
import { activeSubjectIds, formatMinutes, minutesInRange, studyStreak, weekMinutes, weeklyHours } from '../utils/stats'

export default function Stats() {
  usePageTitle('Estadísticas | Studify')
  const data = useData()
  const { sessions, subjects, tasks, settings } = data
  const [weekOffset, setWeekOffset] = useState(0) // 0 = esta semana, -1 = la anterior…

  const ref = addDays(new Date(), weekOffset * 7)
  const weekStart = startOfWeek(ref)
  const weekEnd = addDays(weekStart, 7)
  const chartData = weeklyHours(sessions, ref)
  const isCurrentWeek = weekOffset === 0
  const todayIndex = isCurrentWeek ? (new Date().getDay() + 6) % 7 : -1

  const thisWeek = weekMinutes(sessions)
  const goalMinutes = settings.weeklyGoalHours * 60
  const goalPercent = goalMinutes ? Math.min(100, Math.round((thisWeek / goalMinutes) * 100)) : 0
  const activeIds = activeSubjectIds(data)
  const activeCount = subjects.filter((s) => activeIds.has(s.id)).length
  const doneTasks = tasks.filter((t) => t.completed).length
  const taskPercent = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0)
  const todayMinutes = sessions.filter((s) => isSameDay(new Date(s.date), new Date())).reduce((sum, s) => sum + s.minutes, 0)
  const streak = studyStreak(sessions)

  // Minutos por materia en la semana elegida
  const weekSessions = sessions.filter((s) => {
    const d = new Date(s.date)
    return d >= weekStart && d < weekEnd
  })
  const bySubject = [...subjects.map((s) => ({ id: s.id, name: s.name, tone: s.tone })), { id: null, name: 'Sin materia', tone: 'secondary' }]
    .map((s) => ({ ...s, minutes: minutesInRange(weekSessions.filter((x) => (x.subjectId ?? null) === s.id), weekStart, weekEnd) }))
    .filter((s) => s.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
  const weekTotal = bySubject.reduce((sum, s) => sum + s.minutes, 0)

  const cards = [
    { icon: 'bi-sun', title: 'Hoy', value: formatMinutes(todayMinutes), description: 'Tiempo de estudio', tone: 'warning' },
    { icon: 'bi-calendar-week', title: 'Esta semana', value: formatMinutes(thisWeek), description: `Objetivo: ${settings.weeklyGoalHours}h`, tone: 'primary' },
    { icon: 'bi-fire', title: 'Racha', value: `${streak} ${streak === 1 ? 'día' : 'días'}`, description: 'Seguidos estudiando', tone: 'danger' },
    { icon: 'bi-trophy', title: 'Total', value: formatMinutes(totalMinutes), description: `${sessions.length} sesiones`, tone: 'success' },
  ]

  return (
    <>
      <Row className="g-3 mb-4" aria-label="Resumen de estadísticas">
        {cards.map((c) => (
          <Col sm={6} xl={3} key={c.title}>
            <StatCard {...c} />
          </Col>
        ))}
      </Row>

      <PanelSection id="mi-progreso" tone="primary" title="Mi progreso" subtitle="Seguimiento de tus objetivos de estudio." actionLabel="Cambiar objetivo" actionTo="/configuracion">
        <ProgressBar label="Objetivo semanal" value={goalPercent} detail={`${formatMinutes(thisWeek)} de ${settings.weeklyGoalHours}h completadas`} />
        <ProgressBar label="Materias al día" value={subjects.length ? Math.round((activeCount / subjects.length) * 100) : 0} detail={`${activeCount} de ${subjects.length} materias con actividad en los últimos 7 días`} />
        <ProgressBar label="Tareas completadas" value={taskPercent} detail={`${doneTasks} de ${tasks.length} tareas`} />
      </PanelSection>

      <PanelSection
        id="estadisticas"
        tone="info"
        title="Estadísticas"
        subtitle="Visualizá tus hábitos y horas de estudio."
        headerExtra={
          <Stack direction="horizontal" gap={1} className="align-items-center">
            <Button variant="light" size="sm" className="border rounded-circle lh-1 p-2" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Semana anterior">
              <i className="bi bi-chevron-left"></i>
            </Button>
            <span className="small fw-semibold px-2 text-nowrap" aria-live="polite">
              {isCurrentWeek ? 'Esta semana' : `${formatDay(weekStart)} – ${formatDay(addDays(weekEnd, -1))}`}
            </span>
            <Button variant="light" size="sm" className="border rounded-circle lh-1 p-2" onClick={() => setWeekOffset((w) => w + 1)} disabled={isCurrentWeek} aria-label="Semana siguiente">
              <i className="bi bi-chevron-right"></i>
            </Button>
          </Stack>
        }
      >
        {sessions.length === 0 ? (
          <EmptyState icon="bi-bar-chart" title="Todavía no hay sesiones registradas" text="Las horas se registran solas al completar sesiones de Pomodoro.">
            <Button as={Link} to="/pomodoro" size="sm">Ir al Pomodoro</Button>
          </EmptyState>
        ) : (
          <Row className="g-4">
            <Col lg={7}>
              <WeeklyChart data={chartData} highlightIndex={todayIndex} />
            </Col>
            <Col lg={5}>
              <h3 className="h6 fw-bold mb-3">Tiempo por materia</h3>
              {bySubject.length === 0 ? (
                <p className="text-secondary small mb-0">No hay sesiones en esta semana.</p>
              ) : (
                <Stack gap={3}>
                  {bySubject.map((s) => (
                    <div key={s.id ?? 'none'}>
                      <Stack direction="horizontal" className="justify-content-between small fw-semibold mb-1">
                        <span>{s.name}</span>
                        <span>{formatMinutes(s.minutes)}</span>
                      </Stack>
                      <BsProgressBar now={(s.minutes / weekTotal) * 100} variant={s.tone} style={{ height: 8 }} aria-label={`Tiempo en ${s.name}`} />
                    </div>
                  ))}
                </Stack>
              )}
            </Col>
          </Row>
        )}
      </PanelSection>
    </>
  )
}
