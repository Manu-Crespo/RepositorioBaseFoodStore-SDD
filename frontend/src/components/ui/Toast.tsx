import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactElement,
} from 'react';
import { cn } from '../../shared/utils/cn';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-700 bg-emerald-900/80 text-emerald-200',
  error: 'border-red-700 bg-red-900/80 text-red-200',
  warning: 'border-amber-700 bg-amber-900/80 text-amber-200',
  info: 'border-blue-700 bg-blue-900/80 text-blue-200',
};

const variantIcons: Record<ToastVariant, ReactElement> = {
  success: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

/* ── Toast Item ── */

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const { id, variant, message, action, duration } = toast;

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'animate-slide-right',
        variantStyles[variant],
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{variantIcons[variant]}</div>
      <p className="flex-1 text-sm">{message}</p>
      <div className="flex items-center gap-2 flex-shrink-0">
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onRemove(id);
            }}
            className="text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
        <button
          onClick={() => onRemove(id)}
          className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Cerrar notificación"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Auto-dismiss */}
      {variant !== 'error' && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30 rounded-full animate-shrink"
          style={{
            animation: `shrink ${duration || 4000}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

/* ── Toast Container ── */

export function ToastContainer() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  const { toasts, removeToast } = ctx as unknown as { toasts: Toast[]; removeToast: (id: string) => void };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}

/* ── Hook ── */
let toastCounter = 0;

export function useToast(): { addToast: (toast: Omit<Toast, 'id'>) => void } {
  const [, setTick] = useState(0);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { ...toast, id };
    const duration = toast.duration ?? (toast.variant === 'error' ? 0 : 4000);

    setTick((t) => t + 1);

    if (duration > 0) {
      setTimeout(() => {
        setTick((t) => t + 1);
      }, duration);
    }
  }, []);

  return { addToast };
}

/* ── Provider ── */

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { ...toast, id };
    const duration = toast.duration ?? (toast.variant === 'error' ? 0 : 4000);

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast } as unknown as ToastContextType}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook to add toasts from anywhere
export function useAddToast(): (toast: Omit<Toast, 'id'>) => void {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useAddToast must be used within a ToastProvider');
  }
  return ctx.addToast;
}
