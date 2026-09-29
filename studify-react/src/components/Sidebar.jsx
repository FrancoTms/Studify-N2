import Nav from 'react-bootstrap/Nav'

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

function NavItem({ item, active = false }) {
  return (
    <Nav.Item>
      <Nav.Link
        href={item.href}
        className={`d-flex align-items-center gap-2 ${active ? 'active' : 'text-body'}`}
      >
        <i className={`bi ${item.icon}`}></i>
        {item.label}
      </Nav.Link>
    </Nav.Item>
  )
}

export default function Sidebar({ activeItem = 'Inicio' }) {
  return (
    <aside className="col-lg-3 col-xl-2 d-none d-lg-flex flex-column bg-white border-end vh-100 sticky-top p-3">
      <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
        <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
             style={{ width: 40, height: 40 }}>
          <i className="bi bi-book-half fs-4"></i>
        </div>
        <div>
          <p className="h5 mb-0 fw-bold">Studify</p>
          <p className="mb-0 text-secondary small">Tu espacio para enfocarte.</p>
        </div>
      </div>
      <Nav className="flex-column gap-1 flex-grow-1">
        {items.map((item) => (
          <NavItem key={item.label} item={item} active={item.label === activeItem} />
        ))}
      </Nav>
      <div className="d-flex align-items-center gap-2 border-top pt-3 mt-3">
        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
             style={{ width: 40, height: 40 }}>
          <i className="bi bi-person-fill"></i>
        </div>
        <div>
          <p className="mb-0 fw-semibold small">Usuario</p>
          <p className="mb-0 text-secondary small">estudiante@mail.com</p>
        </div>
      </div>
    </aside>
  )
}
