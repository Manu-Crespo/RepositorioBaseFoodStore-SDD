import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}