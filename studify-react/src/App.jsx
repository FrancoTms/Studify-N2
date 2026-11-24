import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { PublicOnly, RequireAuth } from './components/RouteGuards'
import Login from './pages/login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Subjects from './pages/Subjects'
import SubjectDetail from './pages/SubjectDetail'
import Notes from './pages/Notes'
import Exams from './pages/Exams'
import Calendar from './pages/Calendar'
import Focus from './pages/Focus'
import Stats from './pages/Stats'
import Techniques from './pages/Techniques'
import Assistant from './pages/Assistant'
import Wikipedia from './pages/Wikipedia'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import useTheme from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Routes>
      {/* Páginas públicas: si ya hay sesión, redirigen al inicio */}
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/registro" element={<PublicOnly><Register /></PublicOnly>} />

      {/* Páginas privadas: necesitan una sesión iniciada */}
      <Route
        element={
          <RequireAuth>
            <AppLayout theme={theme} onToggleTheme={toggleTheme} />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="/tareas" element={<Tasks />} />
        <Route path="/materias" element={<Subjects />} />
        <Route path="/materias/:subjectId" element={<SubjectDetail />} />
        <Route path="/apuntes" element={<Notes />} />
        <Route path="/examenes" element={<Exams />} />
        <Route path="/calendario" element={<Calendar />} />
        <Route path="/pomodoro" element={<Focus />} />
        <Route path="/estadisticas" element={<Stats />} />
        <Route path="/tecnicas" element={<Techniques />} />
        <Route path="/asistente" element={<Assistant />} />
        <Route path="/wikipedia" element={<Wikipedia />} />
        <Route path="/configuracion" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
