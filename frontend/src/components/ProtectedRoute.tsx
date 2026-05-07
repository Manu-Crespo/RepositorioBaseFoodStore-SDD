import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

type Role = 'admin' | 'stock' | 'customer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role as Role;
    if (!allowedRoles.includes(userRole)) {
      // User doesn't have required role - show access denied
      return <Navigate to="/access-denied" replace />;
    }
  }

  return <>{children}</>;
}