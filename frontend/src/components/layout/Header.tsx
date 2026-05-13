import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { logout as logoutApi } from '../../shared/api/auth';
import { RoleBadge } from '../ui/Badge';
import { useHeaderNavigation } from '../../hooks/useNavigationItems';
import { Dropdown } from '../ui/Dropdown';

// Simple user icon
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Settings icon
const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-200">
        <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18l-1.5 13H4.5L3 7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V5a3 3 0 016 0v2" />
        </svg>
      </div>
      <span className="text-xl font-display font-bold text-slate-100 hidden sm:inline tracking-tight group-hover:text-amber-400 transition-colors">
        FoodStore
      </span>
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

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      onClick: () => navigate('/profile'),
      icon: <UserIcon />,
    },
    {
      label: 'Configuración',
      onClick: () => {},
      icon: <SettingsIcon />,
    },
    {
      label: 'Cerrar Sesión',
      onClick: handleLogout,
      icon: <LogoutIcon />,
      variant: 'danger' as const,
      separator: true,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 z-50 transition-all duration-300">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Logo onMenuToggle={onMenuToggle} />

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all relative py-1 ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-slate-400 hover:text-slate-100'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-500 after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-100 leading-none mb-1">
                  {user.first_name} {user.last_name}
                </span>
                <RoleBadge role={user.role} />
              </div>

              <Dropdown
                align="right"
                trigger={
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-amber-500/50 hover:bg-slate-700/50 transition-all group overflow-hidden">
                    <div className="text-slate-400 group-hover:text-amber-400 transition-colors">
                      <UserIcon />
                    </div>
                  </div>
                }
                items={userMenuItems}
              />
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
              >
                Regístrate
              </Link>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}