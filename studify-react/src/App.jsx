import AppNavbar from './components/AppNavbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <>
      <AppNavbar brand="Studify" />
      <div className="container-fluid">
        <div className="row">
          <Sidebar activeItem="Inicio" />
          <Dashboard />
        </div>
      </div>
    </>
  )
}
