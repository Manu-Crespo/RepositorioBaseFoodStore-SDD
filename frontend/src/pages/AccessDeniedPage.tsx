import { Link } from 'react-router-dom';
import { Button, AnimatedMount } from '../components/ui';

/* ---------- SVG Icons ---------- */

const LockIcon = () => (
  <svg className="w-20 h-20 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CatalogueIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export function AccessDeniedPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <AnimatedMount variant="slide-up">
        <div className="w-full max-w-md relative">
          {/* Glass card */}
          <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl shadow-slate-900/50 p-8 sm:p-10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <LockIcon />
              </div>
            </div>

            <h1 className="text-2xl font-display font-bold text-slate-100 mb-2">
              Acceso Denegado
            </h1>

            <p className="text-slate-400 mb-8 leading-relaxed">
              No tenés permisos para acceder a esta página.
              Si creés que esto es un error, contactá al administrador.
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
                  <span className="flex items-center justify-center gap-2">
                    <CatalogueIcon />
                    Ver Catálogo
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedMount>
    </div>
  );
}
