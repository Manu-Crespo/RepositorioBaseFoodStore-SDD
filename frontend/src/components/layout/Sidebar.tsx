import { NavLink } from 'react-router-dom';
import { useNavigationItems, type NavigationItem } from '../../hooks/useNavigationItems';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../shared/utils/cn';

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigationItems = useNavigationItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-950 border-r border-slate-800 overflow-y-auto z-50',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:z-auto'
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-200 md:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ item }: { item: NavigationItem }) {
  const { user } = useAuthStore();

  // If item has children, render as collapsible group
  if (item.children && item.children.length > 0) {
    return (
      <div className="space-y-1">
        <div className="px-3 py-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {item.label}
        </div>
        {item.children.map((child, idx) => (
          <SidebarItem key={idx} item={child} />
        ))}
      </div>
    );
  }

  // Skip if user doesn't have permission
  if (item.roles.length > 0 && user && !item.roles.includes(user.role as any)) {
    return null;
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          'hover:bg-slate-800 hover:text-slate-100',
          isActive
            ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
            : 'text-slate-400'
        )
      }
    >
      {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
      <span>{item.label}</span>
    </NavLink>
  );
}