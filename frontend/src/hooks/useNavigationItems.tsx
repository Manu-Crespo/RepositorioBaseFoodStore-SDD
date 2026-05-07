import { useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';

export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  roles: ('admin' | 'stock' | 'customer')[];
  children?: NavigationItem[];
}

// Icon components (simple SVG icons)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const IngredientIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const ProductIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CatalogueIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Navigation items configuration
const navigationConfig: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <DashboardIcon />,
    roles: ['admin', 'stock'],
  },
  {
    label: 'Pedidos',
    path: '/orders',
    icon: <OrdersIcon />,
    roles: ['admin'],
  },
  {
    label: 'Gestión',
    path: '',
    icon: <ProductIcon />,
    roles: ['admin', 'stock'],
    children: [
      {
        label: 'Categorías',
        path: '/admin/categorias',
        icon: <CategoryIcon />,
        roles: ['admin', 'stock'],
      },
      {
        label: 'Ingredientes',
        path: '/admin/ingredientes',
        icon: <IngredientIcon />,
        roles: ['admin', 'stock'],
      },
      {
        label: 'Productos',
        path: '/admin/productos',
        icon: <ProductIcon />,
        roles: ['admin', 'stock'],
      },
    ],
  },
  {
    label: 'Usuarios',
    path: '/admin/usuarios',
    icon: <UsersIcon />,
    roles: ['admin'],
  },
];

// Public navigation (non-authenticated)
const publicNavigation: NavigationItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: <HomeIcon />,
    roles: [],
  },
  {
    label: 'Catálogo',
    path: '/catalogo',
    icon: <CatalogueIcon />,
    roles: [],
  },
  {
    label: 'Login',
    path: '/login',
    icon: <ProfileIcon />,
    roles: [],
  },
  {
    label: 'Register',
    path: '/register',
    icon: <ProfileIcon />,
    roles: [],
  },
];

// Customer navigation (authenticated but not admin/stock)
const customerNavigation: NavigationItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: <HomeIcon />,
    roles: ['customer'],
  },
  {
    label: 'Catálogo',
    path: '/catalogo',
    icon: <CatalogueIcon />,
    roles: ['customer'],
  },
  {
    label: 'Carrito',
    path: '/cart',
    icon: <CartIcon />,
    roles: ['customer'],
  },
  {
    label: 'Pedidos',
    path: '/orders',
    icon: <OrdersIcon />,
    roles: ['customer'],
  },
  {
    label: 'Perfil',
    path: '/profile',
    icon: <ProfileIcon />,
    roles: ['customer'],
  },
];

export function useNavigationItems(): NavigationItem[] {
  const { isAuthenticated, user } = useAuthStore();

  return useMemo(() => {
    // Not authenticated - show public navigation
    if (!isAuthenticated || !user) {
      return publicNavigation;
    }

    // Customer role - show customer navigation
    if (user.role === 'customer') {
      return customerNavigation;
    }

    // Admin or Stock role - filter navigation by role
    const userRole = user.role as 'admin' | 'stock';
    return navigationConfig.filter((item) =>
      item.roles.includes(userRole)
    );
  }, [isAuthenticated, user]);
}

export function useHeaderNavigation(): NavigationItem[] {
  const { isAuthenticated, user } = useAuthStore();

  return useMemo(() => {
    if (!isAuthenticated || !user) {
      return publicNavigation.filter(item => item.path !== '/login' && item.path !== '/register');
    }

    return customerNavigation;
  }, [isAuthenticated, user]);
}