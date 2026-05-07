import type { HTMLAttributes } from 'react';
import { cn } from '../../shared/utils/cn';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ className, size = 'md', ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <svg
        className={cn('animate-spin text-amber-500', sizeStyles[size])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// Full page loader
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

// Inline loader with text
export function LoadingText({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <LoadingSpinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}