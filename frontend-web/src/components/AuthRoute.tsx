import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading…</div>;
  }

  return user ? <Navigate to="/" replace /> : <Outlet />;
};
