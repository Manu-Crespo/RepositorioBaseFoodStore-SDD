import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

type Theme = 'light' | 'dark';
type Modal = string | null;

interface UIState {
  theme: Theme;
  activeModal: Modal;
  toasts: Toast[];
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  openModal: (modal: Modal) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      theme: 'light',
      activeModal: null,
      toasts: [],
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      openModal: (modal) => set({ activeModal: modal }),
      closeModal: () => set({ activeModal: null }),
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);