import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { register } from '../shared/api/auth';
import { login as loginApi } from '../shared/api/auth';
import { Button, Input } from '../components/ui';
import { AnimatedMount } from '../components/ui/AnimatedMount';

/* ---------- SVG Icons ---------- */

const UserPlusIcon = () => (
  <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

/* ---------- Password Strength ---------- */

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const STRENGTH_META: Record<StrengthLevel, { label: string; color: string; bar: string; width: string }> = {
  0: { label: '', color: '', bar: 'bg-slate-700', width: 'w-0' },
  1: { label: 'Débil', color: 'text-red-400', bar: 'bg-red-500', width: 'w-1/4' },
  2: { label: 'Regular', color: 'text-orange-400', bar: 'bg-orange-500', width: 'w-2/4' },
  3: { label: 'Buena', color: 'text-yellow-400', bar: 'bg-yellow-500', width: 'w-3/4' },
  4: { label: 'Fuerte', color: 'text-emerald-400', bar: 'bg-emerald-500', width: 'w-full' },
};

function getPasswordStrength(pwd: string): StrengthLevel {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score <= 3) return 3;
  return 4;
}

interface PasswordStrengthBarProps {
  password: string;
}

function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const level = getPasswordStrength(password);
  const meta = STRENGTH_META[level];

  if (!password) return null;

  return (
    <div className="mt-2 animate-fade-in" aria-label={`Fortaleza: ${meta.label}`} role="status">
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${meta.bar} rounded-full transition-all duration-300 ease-out ${meta.width}`}
        />
      </div>
      {meta.label && (
        <p className={`text-xs mt-1 font-medium ${meta.color}`}>
          {meta.label}
        </p>
      )}
    </div>
  );
}

/* ---------- Page Component ---------- */

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  /* ---------- Validation ---------- */

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return null;
    if (pwd.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Falta una mayúscula';
    if (!/[a-z]/.test(pwd)) return 'Falta una minúscula';
    if (!/[0-9]/.test(pwd)) return 'Falta un número';
    return null;
  };

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    if (touched.firstName && !formData.firstName) errors.firstName = 'Requerido';
    if (touched.lastName && !formData.lastName) errors.lastName = 'Requerido';
    if (touched.email) {
      if (!formData.email) errors.email = 'Requerido';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    }
    if (touched.password) {
      const pwErr = validatePassword(formData.password);
      if (pwErr) errors.password = pwErr;
    }
    if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    return errors;
  }, [touched, formData]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^[\d\s+\-()]*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const hasErrors = Object.values(fieldErrors).some(Boolean);
    if (hasErrors) return;

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
      login(data.access_token, data.user);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <AnimatedMount variant="slide-up">
        <div className="w-full max-w-lg relative">
          {/* Glass card */}
          <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl shadow-slate-900/50 p-8 sm:p-10">
            {/* Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                <UserPlusIcon />
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-100">
                Crear Cuenta
              </h1>
              <p className="text-slate-400 mt-1">Registrate en Foodstore</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Server error */}
              {error && (
                <div className="mb-5 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm animate-fade-in" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                    required
                    error={fieldErrors.firstName}
                  />
                  <Input
                    label="Apellido"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                    required
                    error={fieldErrors.lastName}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="tu@email.com"
                  required
                  error={fieldErrors.email}
                  isValid={touched.email && formData.email.length > 0 && !fieldErrors.email}
                />

                <Input
                  label="Teléfono (opcional)"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+54 11 1234 5678"
                />

                <div>
                  <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    required
                    error={fieldErrors.password}
                    isValid={touched.password && formData.password.length > 0 && !fieldErrors.password}
                  />
                  <PasswordStrengthBar password={formData.password} />
                </div>

                <Input
                  label="Confirmar Contraseña"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  required
                  error={fieldErrors.confirmPassword}
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
                <span className="text-slate-500">¿Ya tenés cuenta? </span>
                <Link
                  to="/login"
                  state={{ from }}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
      </AnimatedMount>
    </div>
  );
}
