import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <div>Cargando…</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
export const AuthRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <div>Cargando…</div>
  return user ? <Navigate to="/" replace /> : <Outlet />
}
