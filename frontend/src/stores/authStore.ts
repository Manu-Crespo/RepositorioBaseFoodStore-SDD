import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setAccessToken: (token: string) => void;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      login: (accessToken, user) => {
        set({
          accessToken,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      refreshToken: async () => {
        const state = get();
        if (!state.accessToken) return;

        // Check if token is expired
        try {
          const decoded = jwtDecode<{ exp: number }>(state.accessToken);
          if (decoded.exp * 1000 > Date.now()) {
            // Token still valid
            return;
          }
        } catch {
          // Invalid token
        }

        // Token expired - need to refresh
        try {
          const response = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            credentials: 'include', // Use httpOnly cookie
          });

          if (response.ok) {
            const data = await response.json();
            set({
              accessToken: data.access_token,
              isAuthenticated: true,
            });
          } else {
            // Refresh failed - logout
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
            });
          }
        } catch {
          // Network error - logout
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);