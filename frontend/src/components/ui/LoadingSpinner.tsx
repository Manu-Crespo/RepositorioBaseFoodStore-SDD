import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        role="status"
        aria-label={text || 'Cargando'}
        {...props}
      >
        <div className="relative">
          <svg
            className={cn('animate-spin text-amber-500', sizeStyles[size])}
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-10"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {/* Inner pulse circle */}
          <div className={cn(
            "absolute inset-0 m-auto bg-amber-500/20 rounded-full animate-pulse",
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
          )} />
        </div>
        {text && (
          <span className="text-sm font-medium text-slate-500 animate-pulse">{text}</span>
        )}
      </div>
    );
  },
);


LoadingSpinner.displayName = 'LoadingSpinner';

// Full page loader
export function PageLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Inline loader
export function LoadingText({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <LoadingSpinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
