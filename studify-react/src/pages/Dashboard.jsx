import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import SectionHeader from '../components/SectionHeader'
import PanelSection from '../components/PanelSection'
import StatCard from '../components/StatCard'
import SubjectCard from '../components/SubjectCard'
import NoteCard from '../components/NoteCard'
import ExamCard from '../components/ExamCard'
import TaskItem from '../components/TaskItem'
import ProgressBar from '../components/ProgressBar'
import EmptyState from '../components/EmptyState'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth, useData } from '../context/contexts'
import { todayISO } from '../utils/dates'
import {
  activeSubjectIds,
  formatMinutes,
  subjectProgress,
  todayTasks,
  upcomingEvents,
  weekMinutes,
} from '../utils/stats'

export default function Dashboard() {
  usePageTitle('Inicio | Studify')
  const navigate = useNavigate()
  const { user } = useAuth()
  const data = useData()
  const { subjects, tasks, notes, events, sessions, settings, subjectName, toggleTask, addTask, loadSampleData } = data
  const [quickTask, setQuickTask] = useState('')

  const firstName = user.name.split(' ')[0]
  const isEmpty = !subjects.length && !tasks.length && !notes.length && !events.length

  const minutes = weekMinutes(sessions)
  const goalMinutes = settings.weeklyGoalHours * 60
  const goalPercent = goalMinutes ? Math.min(100, Math.round((minutes / goalMinutes) * 100)) : 0
  const plan = todayTasks(tasks)
  const pendingToday = plan.filter((t) => !t.completed).length
  const exams = upcomingEvents(events, ['exam'])
  const recentNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)
  const activeIds = activeSubjectIds(data)
  const activeCount = subjects.filter((s) => activeIds.has(s.id)).length
  const activePercent = subjects.length ? Math.round((activeCount / subjects.length) * 100) : 0

  const stats = [
    { icon: 'bi-clock-history', title: 'Horas estudiadas', value: formatMinutes(minutes), description: 'Esta semana', tone: 'primary' },
    { icon: 'bi-book', title: 'Materias', value: subjects.length, description: 'En curso', tone: 'success' },
    { icon: 'bi-journal-text', title: 'Apuntes', value: notes.length, description: 'Guardados', tone: 'warning' },
    { icon: 'bi-calendar-check', title: 'Exámenes', value: exams.length, description: 'Próximamente', tone: 'info' },
  ]

  const handleQuickAdd = (e) => {
    e.preventDefault()
    const title = quickTask.trim()
    if (title.length < 3) return
    addTask({ title, subjectId: null, priority: 'Normal', dueDate: todayISO() })
    setQuickTask('')
  }

  return (
    <>
      <header id="inicio" className="bg-info-subtle rounded-4 shadow-sm p-4 p-lg-5 mb-4">
        <Row className="align-items-center g-4">
          <Col md={8}>
            <p className="text-primary fw-semibold mb-2">TU ESPACIO DE ESTUDIO</p>
            <h1 className="display-6 fw-bold mb-3">¡Hola, {firstName}!</h1>
            <p className="text-body-secondary mb-3">
              {pendingToday > 0
                ? `Hoy tenés ${pendingToday} ${pendingToday === 1 ? 'tarea pendiente' : 'tareas pendientes'}. ¡Vamos con todo!`
                : 'Organizá tus materias, repasá tus apuntes y avanzá hacia tus objetivos.'}
            </p>
            <Button as={Link} to="/pomodoro" variant="primary" className="rounded-pill px-4 py-2">
              <i className="bi bi-book me-2"></i>
              Comenzar a estudiar
            </Button>
          </Col>
          <Col md={4} className="text-center">
            <img
              src="/img/mascota-inicio.png"
              alt="Mascota de Studify leyendo un libro"
              className="img-fluid studify-welcome-cat"
            />
          </Col>
        </Row>
      </header>

      {isEmpty && (
        <Alert variant="info" className="rounded-4 d-flex flex-wrap align-items-center gap-3 mb-4">
          <i className="bi bi-stars fs-3"></i>
          <div className="flex-grow-1">
            <p className="fw-bold mb-0">Tu espacio está vacío</p>
            <p className="small mb-0">Empezá creando tus materias o cargá datos de ejemplo para probar Studify.</p>
          </div>
          <Stack direction="horizontal" gap={2}>
            <Button as={Link} to="/materias" state={{ create: true }} size="sm">Crear una materia</Button>
            <Button variant="outline-primary" size="sm" onClick={loadSampleData}>Cargar ejemplo</Button>
          </Stack>
        </Alert>
      )}

      <section className="mb-4">
        <SectionHeader title="Resumen" subtitle="Una vista rápida de tu actividad." />
        <Row className="g-3" aria-label="Resumen de actividad">
          {stats.map((stat) => (
            <Col sm={6} xl={3} key={stat.title}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>
      </section>

      <PanelSection id="plan-de-hoy" tone="primary" title="Plan de hoy" subtitle="Tus tareas prioritarias para esta jornada." actionLabel="Ver todas" actionTo="/tareas">
        <Form onSubmit={handleQuickAdd} className="mb-3">
          <InputGroup>
            <Form.Control
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              placeholder="Agregar una tarea para hoy…"
              aria-label="Nueva tarea para hoy"
              maxLength={120}
            />
            <Button type="submit" variant="primary" disabled={quickTask.trim().length < 3}>
              <i className="bi bi-plus-lg me-1"></i>Agregar
            </Button>
          </InputGroup>
        </Form>
        {plan.length === 0 ? (
          <EmptyState icon="bi-check2-circle" title="No hay tareas para hoy" text="Agregá una arriba o planificá la semana en Plan de hoy." />
        ) : (
          <Stack gap={2}>
            {plan.map((task) => (
              <TaskItem key={task.id} task={task} subjectName={subjectName(task.subjectId)} onToggle={toggleTask} />
            ))}
          </Stack>
        )}
      </PanelSection>

      <PanelSection id="materias" tone="info" title="Mis materias" subtitle="Consultá el progreso de cada materia." actionLabel="Ver todas" actionTo="/materias">
        {subjects.length === 0 ? (
          <EmptyState icon="bi-book" title="Todavía no tenés materias" text="Creá tus materias para organizar tareas, apuntes y exámenes.">
            <Button as={Link} to="/materias" state={{ create: true }} size="sm">Crear materia</Button>
          </EmptyState>
        ) : (
          <Row className="g-3">
            {subjects.slice(0, 3).map((subject) => (
              <Col md={6} xl={4} key={subject.id}>
                <SubjectCard subject={subject} progress={subjectProgress(subject.id, tasks)} />
              </Col>
            ))}
          </Row>
        )}
      </PanelSection>

      <PanelSection id="mis-apuntes" tone="warning" title="Mis apuntes" subtitle="Tus materiales recientes." actionLabel="Ver apuntes" actionTo="/apuntes">
        {recentNotes.length === 0 ? (
          <EmptyState icon="bi-journal-text" title="Sin apuntes por ahora" text="Escribí tus resúmenes o guardá artículos de Wikipedia." />
        ) : (
          <Row className="g-3">
            {recentNotes.map((note) => (
              <Col md={6} xl={4} key={note.id}>
                <NoteCard
                  note={note}
                  subjectName={subjectName(note.subjectId)}
                  onOpen={(n) => navigate('/apuntes', { state: { openId: n.id } })}
                />
              </Col>
            ))}
          </Row>
        )}
      </PanelSection>

      <PanelSection id="proximos-examenes" tone="danger" title="Próximos exámenes" subtitle="No pierdas de vista tus fechas importantes." actionLabel="Ver todos" actionTo="/examenes">
        {exams.length === 0 ? (
          <EmptyState icon="bi-calendar-check" title="No hay exámenes próximos" text="Cargá tus parciales para ver cuántos días faltan." />
        ) : (
          <Row className="g-3">
            {exams.slice(0, 3).map((exam) => (
              <Col md={6} xl={4} key={exam.id}>
                <ExamCard event={exam} subjectName={subjectName(exam.subjectId)} tone={data.subjectById[exam.subjectId]?.tone} />
              </Col>
            ))}
          </Row>
        )}
      </PanelSection>

      <PanelSection id="mi-progreso" tone="primary" title="Mi progreso" subtitle="Seguimiento de tus objetivos de estudio." actionLabel="Ver estadísticas" actionTo="/estadisticas">
        <ProgressBar
          label="Objetivo semanal"
          value={goalPercent}
          detail={`${formatMinutes(minutes)} de ${settings.weeklyGoalHours}h completadas`}
        />
        <ProgressBar
          label="Materias al día"
          value={activePercent}
          detail={`${activeCount} de ${subjects.length} materias con actividad en los últimos 7 días`}
        />
      </PanelSection>
    </>
  )
}
