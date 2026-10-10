import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import SectionHeader from '../components/SectionHeader'
import PanelSection from '../components/PanelSection'
import StatCard from '../components/StatCard'
import SubjectCard from '../components/SubjectCard'
import NoteCard from '../components/NoteCard'
import ExamCard from '../components/ExamCard'
import TaskItem from '../components/TaskItem'
import TechniqueCard from '../components/TechniqueCard'
import ProgressBar from '../components/ProgressBar'
import PomodoroTimer from '../components/PomodoroTimer'
import ChatAssistant from '../components/ChatAssistant'
import WeeklyChart from '../components/WeeklyChart'
import usePageTitle from '../hooks/usePageTitle'

const stats = [
  { icon: 'bi-clock-history', title: 'Horas estudiadas', value: '12h 30m', description: 'Esta semana', tone: 'primary' },
  { icon: 'bi-book', title: 'Materias', value: '5', description: 'En curso', tone: 'success' },
  { icon: 'bi-journal-text', title: 'Apuntes', value: '24', description: 'Guardados', tone: 'warning' },
  { icon: 'bi-calendar-check', title: 'Exámenes', value: '3', description: 'Próximamente', tone: 'info' },
]

const subjects = [
  { icon: 'bi-code-slash', name: 'Programación', teacher: 'Desarrollo de software', progress: 75, nextTask: 'Trabajo Práctico N.º 2', tone: 'primary' },
  { icon: 'bi-diagram-3', name: 'Análisis de Sistemas', teacher: 'Sistemas de información', progress: 60, nextTask: 'Repasar Unidad 3', tone: 'success' },
  { icon: 'bi-bar-chart', name: 'Gestión de Desarrollo', teacher: 'Gestión de proyectos', progress: 45, nextTask: 'Preparar parcial', tone: 'warning' },
]

const notes = [
  { title: 'React y componentes', subject: 'Programación', date: 'Actualizado hoy' },
  { title: 'Estimación de proyectos', subject: 'Gestión de Desarrollo', date: 'Actualizado ayer' },
  { title: 'Análisis de requerimientos', subject: 'Análisis de Sistemas', date: 'Actualizado hace 3 días' },
]

const exams = [
  { subject: 'Gestión de Desarrollo', title: 'Parcial Unidad 1–4', date: '30 de septiembre', daysLeft: 1, tone: 'primary' },
  { subject: 'Programación', title: 'Presentación Repositorio N.º 2', date: '2 de octubre', daysLeft: 3, tone: 'success' },
  { subject: 'Análisis de Sistemas', title: 'Evaluación práctica', date: '8 de octubre', daysLeft: 9, tone: 'warning' },
]

const tasks = [
  { title: 'Repasar teoría para el parcial', subject: 'Gestión de Desarrollo', priority: 'Alta' },
  { title: 'Terminar componentes de Studify', subject: 'Programación', priority: 'Alta' },
  { title: 'Ordenar apuntes de Unidad 3', subject: 'Análisis de Sistemas', priority: 'Normal', completed: true },
]

const techniques = [
  { icon: 'bi-stopwatch', title: 'Pomodoro', description: 'Estudiá en intervalos de concentración y descanso.', duration: '25 + 5 min' },
  { icon: 'bi-diagram-3', title: 'Mapas mentales', description: 'Relacioná conceptos para comprender mejor los temas.', duration: '15–30 min' },
  { icon: 'bi-question-circle', title: 'Active Recall', description: 'Intentá recuperar la información sin mirar los apuntes.', duration: '20 min' },
]

const weeklyHours = [
  { day: 'Lun', hours: 2 },
  { day: 'Mar', hours: 1.5 },
  { day: 'Mié', hours: 3 },
  { day: 'Jue', hours: 2.5 },
  { day: 'Vie', hours: 1 },
  { day: 'Sáb', hours: 2.5 },
  { day: 'Dom', hours: 0 },
]

export default function Dashboard() {
  usePageTitle('Inicio | Studify')

  return (
    <>
      <header className="bg-hero rounded-4 shadow p-4 p-lg-5 mb-4 text-white">
        <p className="text-white-50 fw-semibold mb-1">Tu espacio de estudio</p>
        <h1 className="display-6 fw-bold mb-1">Hola, estudiante</h1>
        <p className="text-white-50 mb-0">Organizá tu tiempo, mantené el foco y seguí tu progreso.</p>
      </header>

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

      <PanelSection id="plan-de-hoy" tone="primary" title="Plan de hoy" subtitle="Tus tareas prioritarias para esta jornada.">
        <Stack gap={2}>
          {tasks.map((task) => <TaskItem key={task.title} {...task} />)}
        </Stack>
      </PanelSection>

      <PanelSection id="materias" tone="info" title="Mis materias" subtitle="Consultá el progreso de cada materia." actionLabel="Ver todas">
        <Row className="g-3">
          {subjects.map((subject) => (
            <Col md={6} xl={4} key={subject.name}>
              <SubjectCard {...subject} />
            </Col>
          ))}
        </Row>
      </PanelSection>

      <PanelSection id="mis-apuntes" tone="warning" title="Mis apuntes" subtitle="Tus materiales recientes." actionLabel="Ver apuntes">
        <Row className="g-3">
          {notes.map((note) => (
            <Col md={6} xl={4} key={note.title}>
              <NoteCard {...note} />
            </Col>
          ))}
        </Row>
      </PanelSection>

      <PanelSection id="proximos-examenes" tone="danger" title="Próximos exámenes" subtitle="No pierdas de vista tus fechas importantes.">
        <Row className="g-3">
          {exams.map((exam) => (
            <Col md={6} xl={4} key={exam.title}>
              <ExamCard {...exam} />
            </Col>
          ))}
        </Row>
      </PanelSection>

      <PanelSection id="mi-progreso" tone="primary" title="Mi progreso" subtitle="Seguimiento de tus objetivos de estudio.">
        <ProgressBar label="Objetivo semanal" value={72} detail="8h 40m de 12h completadas" />
        <ProgressBar label="Materias al día" value={64} detail="3 de 5 materias con actividad reciente" />
      </PanelSection>

      <PanelSection id="tecnicas-estudio" tone="warning" title="Técnicas de estudio" subtitle="Elegí una estrategia para tu próxima sesión.">
        <Row className="g-3">
          {techniques.map((technique) => (
            <Col md={6} xl={4} key={technique.title}>
              <TechniqueCard {...technique} />
            </Col>
          ))}
        </Row>
      </PanelSection>

      <PanelSection id="pomodoro" tone="danger" title="Pomodoro" subtitle="Una sesión rápida para empezar a estudiar.">
        <PomodoroTimer />
      </PanelSection>

      <PanelSection id="estadisticas" tone="info" title="Estadísticas" subtitle="Visualizá tus hábitos y horas de estudio.">
        <WeeklyChart data={weeklyHours} />
      </PanelSection>

      <PanelSection id="ia-asistente" tone="primary" title="IA Asistente" subtitle="Preguntale al asistente sobre técnicas, organización y exámenes.">
        <ChatAssistant />
      </PanelSection>
    </>
  )
}