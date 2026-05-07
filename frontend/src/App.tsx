import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout, AuthLayout } from './components/layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';
import { AdminGuard } from './components/AdminGuard';
import { StockGuard } from './components/StockGuard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminIngredientsPage } from './pages/AdminIngredientsPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { CataloguePage } from './pages/CataloguePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No sidebar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          {/* Public Catalogue */}
          <Route path="/catalogo" element={<CataloguePage />} />
          <Route path="/catalogo/producto/:id" element={<ProductDetailPage />} />
        </Route>

        {/* Protected Routes - With sidebar for admin/stock */}
        <Route element={<AuthLayout />}>
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminPage />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />

          {/* Stock/Admin Management Routes */}
          <Route
            path="/admin/categorias"
            element={
              <StockGuard>
                <AdminCategoriesPage />
              </StockGuard>
            }
          />
          <Route
            path="/admin/ingredientes"
            element={
              <StockGuard>
                <AdminIngredientsPage />
              </StockGuard>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <StockGuard>
                <AdminProductsPage />
              </StockGuard>
            }
          />
        </Route>

        {/* Access Denied Page */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold mb-4 text-slate-100">Welcome to Food Store</h2>
      <p className="text-slate-400">Your favorite food delivery app</p>
    </main>
  );
}

function CartPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-display font-bold text-slate-100 mb-4">Cart Page</h2>
      <p className="text-slate-400">Your shopping cart is empty</p>
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-display font-bold text-slate-100 mb-4">Orders Page</h2>
      <p className="text-slate-400">No orders yet</p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-display font-bold text-slate-100 mb-4">Profile Page</h2>
      <p className="text-slate-400">Manage your profile</p>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-display font-bold text-slate-100 mb-4">Admin Dashboard</h2>
      <p className="text-slate-400">Welcome to the admin panel</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-display font-bold text-slate-100 mb-4">Admin Dashboard</h2>
      <p className="text-slate-400">Manage your store</p>
    </div>
  );
}

export default App;