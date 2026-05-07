/** StockGuard - Allows STOCK or ADMIN roles for product management pages. */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface StockGuardProps {
  children: React.ReactNode;
}

export function StockGuard({ children }: StockGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not stock or admin - show access denied
  if (user?.role !== 'admin' && user?.role !== 'stock') {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}