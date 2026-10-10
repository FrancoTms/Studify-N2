import Nav from 'react-bootstrap/Nav'
import Stack from 'react-bootstrap/Stack'

const items = [
  { icon: 'bi-house-door-fill', label: 'Inicio', href: '#inicio' },
  { icon: 'bi-check2-square', label: 'Plan de hoy', href: '#plan-de-hoy' },
  { icon: 'bi-journal-text', label: 'Mis Apuntes', href: '#mis-apuntes' },
  { icon: 'bi-calendar2-week', label: 'Próximos Exámenes', href: '#proximos-examenes' },
  { icon: 'bi-stars', label: 'Modo Foco', href: '#mi-progreso' },
  { icon: 'bi-signpost-split', label: 'Mi progreso', href: '#mi-progreso' },
  { icon: 'bi-bar-chart-fill', label: 'Estadísticas', href: '#estadisticas' },
  { icon: 'bi-alarm-fill', label: 'Pomodoro', href: '#pomodoro' },
  { icon: 'bi-lightbulb-fill', label: 'Técnicas de Estudio', href: '#tecnicas-estudio' },
  { icon: 'bi-robot', label: 'IA Asistente', href: '#ia-asistente' },
  { icon: 'bi-calendar3', label: 'Calendario', href: '#calendario' },
  { icon: 'bi-gear-fill', label: 'Configuración', href: '#configuracion' },
]

export default function Sidebar({ activeItem = 'Inicio' }) {
  return (
    <aside
      className="d-none d-lg-flex flex-column flex-shrink-0 align-self-start sticky-top vh-100 bg-sidebar text-white p-3"
      style={{ width: 276 }}
    >
      <Stack
        direction="horizontal"
        gap={2}
        className="border-bottom border-white border-opacity-10 pb-3 mb-3"
      >
        <div className="bg-primary text-white rounded-3 p-2 lh-1">
          <i className="bi bi-book-half fs-4"></i>
        </div>
        <div>
          <p className="h5 mb-0 fw-bold">Studify</p>
          <p className="mb-0 text-white-50 small">Tu espacio para enfocarte.</p>
        </div>
      </Stack>

      <Nav variant="pills" className="flex-column flex-nowrap gap-1 flex-grow-1 overflow-auto">
        {items.map((item) => {
          const active = item.label === activeItem
          return (
            <Nav.Link
              key={item.label}
              href={item.href}
              active={active}
              className={`d-flex align-items-center gap-2 rounded-3 fw-semibold small ${
                active ? 'bg-primary-subtle text-dark' : 'text-white-50'
              }`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Nav.Link>
          )
        })}
      </Nav>

      <Stack
        direction="horizontal"
        gap={2}
        className="border-top border-white border-opacity-10 pt-3 mt-3"
      >
        <div className="bg-primary-subtle text-primary rounded-circle p-2 lh-1">
          <i className="bi bi-person-fill fs-5"></i>
        </div>
        <div>
          <p className="mb-0 fw-semibold small">Usuario</p>
          <p className="mb-0 text-white-50 small">estudiante@mail.com</p>
        </div>
      </Stack>
    </aside>
  )
}