import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout({ showSidebar = false }: { showSidebar?: boolean }) {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasSidebar = showSidebar && (user?.role === 'admin' || user?.role === 'stock');

  return (
    <div className="min-h-screen bg-dark-900">
      <Header onMenuToggle={hasSidebar ? () => setSidebarOpen(true) : undefined} />
      <div className="flex pt-16">
        {hasSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <main className={`flex-1 ${hasSidebar ? 'md:ml-64 ml-0' : ''} p-4 md:p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Convenience components
export function AuthLayout() {
  return <Layout showSidebar />;
}

export function PublicLayout() {
  return <Layout showSidebar={false} />;
}