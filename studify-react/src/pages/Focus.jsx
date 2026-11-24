import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import PanelSection from '../components/PanelSection'
import PomodoroTimer from '../components/PomodoroTimer'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useData, usePomodoro } from '../context/contexts'
import { confirmAction } from '../utils/alerts'
import { formatTime } from '../utils/dates'
import { formatMinutes } from '../utils/stats'

export default function Focus() {
  usePageTitle('Pomodoro | Studify')
  const { subjectName, deleteSession, settings } = useData()
  const { todaySessions } = usePomodoro()
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.minutes, 0)
  const sorted = [...todaySessions].sort((a, b) => b.date.localeCompare(a.date))

  const handleDelete = async (session) => {
    const ok = await confirmAction({ title: '¿Quitar esta sesión?', text: 'Se va a descontar de tus estadísticas.', confirmText: 'Quitar' })
    if (ok) deleteSession(session.id)
  }

  return (
    <Row className="g-4">
      <Col lg={7}>
        <PanelSection
          id="pomodoro"
          tone="danger"
          title="Pomodoro"
          subtitle="Elegí la materia y arrancá. El reloj sigue aunque cambies de página."
        >
          <PomodoroTimer />
        </PanelSection>
      </Col>

      <Col lg={5}>
        <PanelSection id="sesiones-hoy" tone="primary" title="Sesiones de hoy" subtitle={`Total: ${formatMinutes(todayMinutes)}`}>
          {sorted.length === 0 ? (
            <EmptyState icon="bi-alarm" title="Todavía no completaste sesiones hoy" text={`Cada sesión de enfoque de ${settings.focusMinutes} minutos suma a tus estadísticas.`} />
          ) : (
            <Stack as="ul" gap={2} className="list-unstyled mb-0">
              {sorted.map((s) => (
                <Stack as="li" key={s.id} direction="horizontal" gap={3} className="border rounded-3 p-2 px-3 bg-body">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <div className="flex-grow-1">
                    <p className="fw-semibold small mb-0">{subjectName(s.subjectId)}</p>
                    <p className="text-secondary small mb-0">{formatTime(new Date(s.date))} · {s.minutes} min</p>
                  </div>
                  <Button variant="link" size="sm" className="text-secondary p-1" onClick={() => handleDelete(s)} aria-label="Quitar sesión" title="Quitar sesión">
                    <i className="bi bi-x-lg"></i>
                  </Button>
                </Stack>
              ))}
            </Stack>
          )}
          <p className="small text-secondary mt-3 mb-0">
            ¿Querés cambiar la duración? Andá a <Link to="/configuracion">Configuración</Link>.
          </p>
        </PanelSection>
      </Col>
    </Row>
  )
}
