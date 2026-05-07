import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { login as loginApi } from '../shared/api/auth';
import { Button, Input, Card, CardContent } from '../components/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginApi(email, password);
      login(data.access_token, data.user);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-100">
              Iniciar Sesión
            </h2>
            <p className="text-slate-400 mt-2">Accede a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />

              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-dark-900"
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
              <span className="text-slate-500">¿No tienes cuenta? </span>
              <Link to="/register" state={{ from }} className="text-amber-400 hover:text-amber-300">
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}