import { Outlet } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  return (
    <>
      <AppNavbar brand="Studify" />
      <div className="app-shell">
        <Sidebar activeItem="Inicio" />
        <main className="app-main" id="inicio">
          <Outlet />
        </main>
      </div>
    </>
  )
}
