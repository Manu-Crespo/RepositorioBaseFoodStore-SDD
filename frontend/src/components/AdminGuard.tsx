import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not admin - show access denied
  if (user?.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}