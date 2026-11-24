import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Stack from 'react-bootstrap/Stack'
import PomodoroBadge from './PomodoroBadge'
import { navItems, isActivePath } from '../data/navItems'
import { useAuth } from '../context/contexts'

export default function AppNavbar({ brand = 'Studify', theme = 'light', onToggleTheme, onLogout }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isDark = theme === 'dark'

  return (
    <Navbar
      expand="lg"
      expanded={open}
      onToggle={setOpen}
      className="bg-body border-bottom shadow-sm d-lg-none sticky-top"
    >
      <Container fluid>
        <Navbar.Toggle aria-controls="studify-mobile-nav" aria-label="Abrir menú" />
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          {brand}
        </Navbar.Brand>
        <Stack direction="horizontal" gap={2}>
          <PomodoroBadge compact />
          <Button
            variant="light"
            className="rounded-circle border"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars'}`}></i>
          </Button>
          <Button variant="light" className="rounded-circle border" onClick={onLogout} aria-label="Cerrar sesión">
            <i className="bi bi-box-arrow-right"></i>
          </Button>
        </Stack>

        <Navbar.Offcanvas
          id="studify-mobile-nav"
          aria-labelledby="studify-mobile-nav-title"
          placement="start"
          className="bg-sidebar text-white"
          style={{ '--bs-offcanvas-width': '290px' }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="studify-mobile-nav-title" as="p" className="h5 fw-bold mb-0">
              <i className="bi bi-book-half me-2"></i>
              {brand}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            <Nav variant="pills" className="flex-column gap-1">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.to)
                return (
                  <Nav.Link
                    key={item.to}
                    as={Link}
                    to={item.to}
                    active={active}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`d-flex align-items-center gap-2 rounded-3 fw-semibold ${
                      active ? 'bg-primary-subtle text-dark' : 'text-white-50'
                    }`}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    {item.label}
                  </Nav.Link>
                )
              })}
            </Nav>
            <p className="small text-white-50 border-top border-white border-opacity-10 pt-3 mt-auto mb-0">
              <i className="bi bi-person-fill me-1"></i>
              {user?.name} · {user?.guest ? 'Modo invitado' : user?.email}
            </p>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
