import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logout as logoutApi } from '../../shared/api/auth';
import { RoleBadge } from '../ui/Badge';
import { useHeaderNavigation } from '../../hooks/useNavigationItems';

// Simple user icon
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Logout icon
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Logo / Brand
const Logo = ({ onMenuToggle }: { onMenuToggle?: () => void }) => (
  <div className="flex items-center gap-2">
    {onMenuToggle && (
      <button
        onClick={onMenuToggle}
        className="p-2 text-slate-400 hover:text-slate-200 md:hidden"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    )}
    <Link to="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18l-1.5 13H4.5L3 7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V5a3 3 0 016 0v2" />
        </svg>
      </div>
      <span className="text-xl font-display font-semibold text-slate-100 hidden sm:inline">Foodstore</span>
    </Link>
  </div>
);

export function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navigation = useHeaderNavigation();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors
    }
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Logo onMenuToggle={onMenuToggle} />

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* User info */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <UserIcon />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-slate-200">
                    {user.first_name} {user.last_name}
                  </span>
                  <RoleBadge role={user.role} />
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}