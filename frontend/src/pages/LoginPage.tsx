import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { login as loginApi } from '../shared/api/auth';
import { Button, Input } from '../components/ui';
import { AnimatedMount } from '../components/ui/AnimatedMount';

/* ---------- SVG Icons ---------- */

const StoreLogoIcon = () => (
  <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M3 7l3-3h12l3 3M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7M7 10h2v3H7v-3zm4 0h2v3h-2v-3zm4 0h2v3h-2v-3z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  /* ---------- Validation ---------- */

  const emailError = !email && touched.email ? 'El email es requerido' : '';
  const passwordError = !password && touched.password ? 'La contraseña es requerida' : '';
  const emailFormatError = email && touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? 'Formato de email inválido'
    : '';

  const displayError = error || emailError || passwordError || emailFormatError;

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (!email || !password) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setIsLoading(true);

    try {
      const data = await loginApi(email, password);
      login(data.access_token, data.user);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <AnimatedMount variant="slide-up">
        <div className="w-full max-w-md relative">
          {/* Glass card */}
          <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl shadow-slate-900/50 p-8 sm:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                <StoreLogoIcon />
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-100">
                Iniciar Sesión
              </h1>
              <p className="text-slate-400 mt-1">Accedé a tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Server error */}
              {error && (
                <div className="mb-5 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm animate-fade-in" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="tu@email.com"
                  required
                  isValid={touched.email && email.length > 0 && !emailFormatError}
                />

                <Input
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Validation errors inline */}
              {displayError && !error && (
                <p className="mt-3 text-sm text-red-400 animate-fade-in" role="alert">
                  {emailFormatError || emailError || passwordError}
                </p>
              )}

              <div className="flex items-center justify-between mt-6">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500
                      focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900
                      cursor-pointer"
                  />
                  Recordarme
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full mt-6"
              >
                Iniciar Sesión
              </Button>

              <div className="text-center text-sm mt-6">
                <span className="text-slate-500">¿No tenés cuenta? </span>
                <Link
                  to="/register"
                  state={{ from }}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Registrate
                </Link>
              </div>
            </form>
          </div>
        </div>
      </AnimatedMount>
    </div>
  );
}
