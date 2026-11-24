import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Sidebar from '../components/Sidebar'
import AppNavbar from '../components/AppNavbar'
import TopBar from '../components/TopBar'
import DataProvider from '../context/DataProvider'
import PomodoroProvider from '../context/PomodoroProvider'
import { useAuth } from '../context/contexts'

export default function AppLayout({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const askLogout = () => setConfirmLogout(true)
  const cancelLogout = () => setConfirmLogout(false)
  const handleLogout = () => {
    setConfirmLogout(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    // key: al cambiar de cuenta se cargan los datos de esa cuenta
    <DataProvider key={user.email} user={user}>
      <PomodoroProvider>
        <div className="d-flex">
          <Sidebar />

          <div className="flex-grow-1 studify-login-bg" style={{ minWidth: 0 }}>
            <AppNavbar theme={theme} onToggleTheme={onToggleTheme} onLogout={askLogout} />
            <TopBar theme={theme} onToggleTheme={onToggleTheme} onLogout={askLogout} />
            <Container as="main" fluid className="px-3 px-lg-5 py-4" style={{ maxWidth: 1180 }}>
              {/* Las páginas reciben el tema con useOutletContext() */}
              <Outlet context={{ theme, onToggleTheme }} />
            </Container>
          </div>

          <Modal show={confirmLogout} onHide={cancelLogout} centered size="sm">
            <Modal.Header closeButton>
              <Modal.Title as="h2" className="h5">Cerrar sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Querés salir de Studify?
              {user.guest && (
                <p className="small text-secondary mt-2 mb-0">
                  Los datos del modo invitado quedan guardados en este navegador.
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={cancelLogout}>Cancelar</Button>
              <Button variant="primary" onClick={handleLogout}>Cerrar sesión</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </PomodoroProvider>
    </DataProvider>
  )
}
