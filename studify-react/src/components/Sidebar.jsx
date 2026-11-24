import { Link, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Stack from 'react-bootstrap/Stack'
import { navItems, isActivePath } from '../data/navItems'
import { useAuth } from '../context/contexts'

export default function Sidebar() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <aside
      className="d-none d-lg-flex flex-column flex-shrink-0 align-self-start sticky-top vh-100 bg-sidebar text-white p-3"
      style={{ width: 276 }}
    >
      <Stack
        as={Link}
        to="/"
        direction="horizontal"
        gap={2}
        className="border-bottom border-white border-opacity-10 pb-3 mb-3 text-white text-decoration-none"
      >
        <img
          src="/img/mascota-sidebar.png"
          alt="Mascota de Studify"
          className="studify-mascot"
        />
        <div>
          <p className="h5 mb-0 fw-bold">Studify</p>
          <p className="mb-0 text-white-50 small">Tu espacio para enfocarte.</p>
        </div>
      </Stack>

      <Nav as="nav" aria-label="Menú principal" variant="pills" className="flex-column flex-nowrap gap-1 flex-grow-1 overflow-auto">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.to)
          return (
            <Nav.Link
              key={item.to}
              as={Link}
              to={item.to}
              active={active}
              aria-current={active ? 'page' : undefined}
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
        as={Link}
        to="/configuracion"
        direction="horizontal"
        gap={2}
        className="border-top border-white border-opacity-10 pt-3 mt-3 text-white text-decoration-none"
        title="Ir a Configuración"
      >
        <div className="bg-primary-subtle text-primary rounded-circle p-2 lh-1">
          <i className="bi bi-person-fill fs-5"></i>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="mb-0 fw-semibold small text-truncate">{user?.name}</p>
          <p className="mb-0 text-white-50 small text-truncate">
            {user?.guest ? 'Modo invitado' : user?.email}
          </p>
        </div>
      </Stack>
    </aside>
  )
}
