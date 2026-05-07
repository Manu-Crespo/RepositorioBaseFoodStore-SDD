import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

// Lock icon
const LockIcon = () => (
  <svg
    className="w-16 h-16 text-amber-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

// Home icon
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

export function AccessDeniedPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-6">
            <LockIcon />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-100 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-slate-400 mb-6">
            No tienes permisos para acceder a esta página. Contacta al administrador si crees que esto es un error.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="primary" className="w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <HomeIcon />
                  Volver al inicio
                </span>
              </Button>
            </Link>
            <Link to="/catalogo">
              <Button variant="secondary" className="w-full sm:w-auto">
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}