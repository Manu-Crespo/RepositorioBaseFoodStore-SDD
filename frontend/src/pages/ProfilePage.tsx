/** ProfilePage - User profile management with edit and password change. */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getProfile, updateProfile, changePassword } from '../shared/api/auth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { AnimatedMount } from '../components/ui/AnimatedMount';
import type { User } from '../stores/authStore';

// Icons
const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

interface ProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
        setEditForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setMessage({ type: 'error', text: 'Error al cargar el perfil' });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Handle profile edit
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const data = await updateProfile({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        phone: editForm.phone || null,
      });
      setProfile(data);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (err) {
      console.error('Failed to update profile:', err);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError(null);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      // Password changed successfully - logout user
      setShowPasswordModal(false);
      setMessage({ type: 'success', text: 'Contraseña cambiada. Iniciá sesión de nuevo.' });

      // Clear stored auth and redirect to login
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: { message?: string } } } };
      const detail = error.response?.data?.detail;
      if (detail?.message) {
        setPasswordError(detail.message);
      } else {
        setPasswordError('Error al cambiar la contraseña');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedMount variant="slide-up">
          <h1 className="text-3xl font-display font-bold text-slate-100 mb-8">Mi Perfil</h1>
        </AnimatedMount>

        {/* Success/Error Message */}
        {message && (
          <AnimatedMount variant="slide-up">
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </div>
          </AnimatedMount>
        )}

        {/* Profile Card */}
        <AnimatedMount variant="slide-up" delay={100}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                    <Input
                      label="Apellido"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <Input
                    label="Teléfono"
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+54 11 1234 5678"
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        if (profile) {
                          setEditForm({
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            phone: profile.phone || '',
                          });
                        }
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400">Nombre</label>
                      <p className="text-slate-200 font-medium">{profile?.first_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Apellido</label>
                      <p className="text-slate-200 font-medium">{profile?.last_name}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Email</label>
                    <p className="text-slate-200 font-medium">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Teléfono</label>
                    <p className="text-slate-200 font-medium">{profile?.phone || 'No registrado'}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedMount>

        {/* Password Change Card */}
        <AnimatedMount variant="slide-up" delay={200}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockIcon />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Cambiá tu contraseña para mantener tu cuenta segura.
              </p>
              <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>
        </AnimatedMount>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <AnimatedMount variant="scale-in">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Contraseña Actual"
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, current_password: e.target.value })
                      }
                      placeholder="Tu contraseña actual"
                    />
                    <Input
                      label="Nueva Contraseña"
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, new_password: e.target.value })
                      }
                      placeholder="Mínimo 8 caracteres"
                    />
                    <Input
                      label="Confirmar Nueva Contraseña"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                      }
                      placeholder="Repetí la contraseña"
                    />
                    {passwordError && (
                      <p className="text-red-400 text-sm">{passwordError}</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button onClick={handlePasswordChange} disabled={isSaving}>
                        {isSaving ? 'Cambiando...' : 'Cambiar Contraseña'}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPasswordForm({
                            current_password: '',
                            new_password: '',
                            confirm_password: '',
                          });
                          setPasswordError(null);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedMount>
          </div>
        )}
      </div>
    </div>
  );
}