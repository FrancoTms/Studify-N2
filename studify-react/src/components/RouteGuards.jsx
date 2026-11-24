import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/contexts'

// Solo deja pasar si hay una sesión iniciada; si no, manda al login y recuerda a dónde quería ir
export function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

// Login y registro: si ya hay sesión, va directo al inicio
export function PublicOnly({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (user) return <Navigate to={location.state?.from ?? '/'} replace />
  return children
}
