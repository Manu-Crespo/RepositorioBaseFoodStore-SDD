import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { register } from '../shared/api/auth';
import { login as loginApi } from '../shared/api/auth';
import { Button, Input, Card, CardContent } from '../components/ui';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For phone, only allow numbers and common phone chars
    if (name === 'phone') {
      if (!/^[\d\s\+\-\(\)]*$/.test(value)) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      setError('All fields are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || undefined,
      });
      const data = await loginApi(formData.email, formData.password);
      login(data.access_token, {
        id: '',
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'customer',
        is_active: true,
        created_at: new Date().toISOString(),
      });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
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
              Crear Cuenta
            </h2>
            <p className="text-slate-400 mt-2">Regístrate en Food Store</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Apellido"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />

              <Input
                label="Teléfono (opcional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+54 11 1234 5678"
              />

              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Mín 8 caracteres, mayúscula, minúscula, número
                </p>
              </div>

              <Input
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Crear Cuenta
            </Button>

            <div className="text-center text-sm mt-6">
              <span className="text-slate-500">¿Ya tienes cuenta? </span>
              <Link to="/login" state={{ from }} className="text-amber-400 hover:text-amber-300">
                Iniciar Sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}