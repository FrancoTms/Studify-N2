import { Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Sidebar from '../components/Sidebar'
import AppNavbar from '../components/AppNavbar'

export default function AppLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <AppNavbar />
        <Container as="main" fluid className="px-3 px-lg-5 py-4" style={{ maxWidth: 1180 }}>
          <Outlet />
        </Container>
      </div>
    </div>
  )
}