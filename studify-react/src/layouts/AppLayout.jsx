import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Sidebar from '../components/Sidebar'
import AppNavbar from '../components/AppNavbar'

export default function AppLayout({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const askLogout = () => setConfirmLogout(true)
  const cancelLogout = () => setConfirmLogout(false)
  const logout = () => {
    setConfirmLogout(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="d-flex">
      <Sidebar theme={theme} onToggleTheme={onToggleTheme} onLogout={askLogout} />

      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <AppNavbar theme={theme} onToggleTheme={onToggleTheme} onLogout={askLogout} />
        <Container as="main" fluid className="px-3 px-lg-5 py-4" style={{ maxWidth: 1180 }}>
          <Outlet />
        </Container>
      </div>

      <Modal show={confirmLogout} onHide={cancelLogout} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">Cerrar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Querés salir de Studify?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cancelLogout}>Cancelar</Button>
          <Button variant="primary" onClick={logout}>Cerrar sesión</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}