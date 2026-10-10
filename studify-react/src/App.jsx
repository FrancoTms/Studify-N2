import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/login'
import NotFound from './pages/NotFound'
import useTheme from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout theme={theme} onToggleTheme={toggleTheme} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}