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
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      login: (accessToken, refreshToken, user) => {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
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
          const { refreshToken: refreshTokenApi } = await import('../shared/api/auth');
          const data = await refreshTokenApi(state.refreshToken || '');
          
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
          });
        } catch {
          // Refresh failed or network error - logout
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
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);