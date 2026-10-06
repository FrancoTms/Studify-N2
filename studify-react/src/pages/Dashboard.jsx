import SectionHeader from '../components/SectionHeader'
import StatCard from '../components/StatCard'
import SubjectCard from '../components/SubjectCard'
import NoteCard from '../components/NoteCard'
import ExamCard from '../components/ExamCard'
import TaskItem from '../components/TaskItem'
import TechniqueCard from '../components/TechniqueCard'
import ProgressBar from '../components/ProgressBar'
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

export default function Dashboard() {
  usePageTitle('Inicio | Studify')

  return (
    <>
      <header className="dash-hero rounded-4 p-4 p-lg-5 mb-4 text-white">
        <p className="text-white-50 fw-semibold mb-1">Tu espacio de estudio</p>
        <h1 className="display-6 fw-bold mb-1">Hola, estudiante</h1>
        <p className="text-white-50 mb-0">Organizá tu tiempo, mantené el foco y seguí tu progreso.</p>
      </header>

      <section className="mb-4">
        <SectionHeader title="Resumen" subtitle="Una vista rápida de tu actividad." />
        <div className="row g-3" aria-label="Resumen de actividad">
          {stats.map((stat) => (
            <div className="col-sm-6 col-xl-3" key={stat.title}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </section>

      <section className="dash-panel" id="plan-de-hoy" style={{ '--panel-accent': 'var(--sf-primary)' }}>
        <SectionHeader title="Plan de hoy" subtitle="Tus tareas prioritarias para esta jornada." />
        <div>
            <div className="d-flex flex-column gap-2">
              {tasks.map((task) => <TaskItem key={task.title} {...task} />)}
            </div>
          </div>
        </section>

      <section className="dash-panel" id="materias" style={{ '--panel-accent': 'var(--sf-blue)' }}>
        <SectionHeader title="Mis materias" subtitle="Consultá el progreso de cada materia." actionLabel="Ver todas" />
        <div className="row g-3">
          {subjects.map((subject) => (
            <div className="col-md-6 col-xl-4" key={subject.name}>
              <SubjectCard {...subject} />
            </div>
          ))}
        </div>
      </section>

      <section className="dash-panel" id="mis-apuntes" style={{ '--panel-accent': 'var(--sf-yellow)' }}>
        <SectionHeader title="Mis apuntes" subtitle="Tus materiales recientes." actionLabel="Ver apuntes" />
        <div className="row g-3">
          {notes.map((note) => (
            <div className="col-md-6 col-xl-4" key={note.title}>
              <NoteCard {...note} />
            </div>
          ))}
        </div>
      </section>

      <section className="dash-panel" id="proximos-examenes" style={{ '--panel-accent': 'var(--sf-accent)' }}>
        <SectionHeader title="Próximos exámenes" subtitle="No pierdas de vista tus fechas importantes." />
        <div className="row g-3">
          {exams.map((exam) => (
            <div className="col-md-6 col-xl-4" key={exam.title}>
              <ExamCard {...exam} />
            </div>
          ))}
        </div>
      </section>

      <section className="dash-panel" id="mi-progreso" style={{ '--panel-accent': 'var(--sf-primary)' }}>
        <SectionHeader title="Mi progreso" subtitle="Seguimiento de tus objetivos de estudio." />
        <div>
            <ProgressBar label="Objetivo semanal" value={72} detail="8h 40m de 12h completadas" />
            <ProgressBar label="Materias al día" value={64} detail="3 de 5 materias con actividad reciente" />
          </div>
        </section>

      <section className="dash-panel" id="tecnicas-estudio" style={{ '--panel-accent': 'var(--sf-yellow)' }}>
        <SectionHeader title="Técnicas de estudio" subtitle="Elegí una estrategia para tu próxima sesión." />
        <div className="row g-3">
          {techniques.map((technique) => (
            <div className="col-md-6 col-xl-4" key={technique.title}>
              <TechniqueCard {...technique} />
            </div>
          ))}
        </div>
      </section>

      <section className="dash-panel" id="pomodoro" style={{ '--panel-accent': 'var(--sf-accent)' }}>
        <SectionHeader title="Pomodoro" subtitle="Una sesión rápida para empezar a estudiar." />
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge text-bg-primary mb-2">Enfoque</span>
              <h3 className="h4 mb-1">25:00</h3>
              <p className="text-secondary mb-0">Preparado para comenzar una sesión.</p>
            </div>
            <button className="btn btn-primary js-pomodoro-start">
              <i className="bi bi-play-fill me-1"></i> Iniciar
            </button>
          </div>
        </section>

      <section className="dash-panel" id="estadisticas" style={{ '--panel-accent': 'var(--sf-blue)' }}>
        <SectionHeader title="Estadísticas" subtitle="Visualizá tus hábitos y horas de estudio." />
        <div>
            <ProgressBar label="Constancia semanal" value={78} detail="5 días activos esta semana" />
            <ProgressBar label="Cumplimiento de tareas" value={83} detail="10 de 12 tareas completadas" />
          </div>
        </section>

      <section className="dash-panel" id="ia-asistente" style={{ '--panel-accent': 'var(--sf-primary)' }}>
        <SectionHeader title="IA Asistente" subtitle="Herramientas para resumir, practicar y organizar tus materiales." />
        <div>
            <div className="d-flex align-items-start gap-3">
              <div className="rounded-3 bg-primary-subtle text-primary p-3">
                <i className="bi bi-robot fs-3"></i>
              </div>
              <div>
                <h3 className="h5">Asistente de estudio</h3>
                <p className="text-secondary mb-3">Cargá un documento para generar resúmenes o preguntas de práctica.</p>
                <button className="btn btn-outline-primary">Abrir asistente</button>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}
