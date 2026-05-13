import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../shared/utils/cn';
import { Button } from './Button';
import { AnimatedMount } from './AnimatedMount';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: 'simple' | 'card' | 'glass';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  className,
  title,
  description,
  icon,
  variant = 'simple',
  action,
  ...props
}: EmptyStateProps) {
  return (
    <AnimatedMount variant="slide-up">
      <div
        className={cn(
          'flex flex-col items-center justify-center py-16 px-6 text-center',
          variant === 'card' && 'bg-slate-800 border border-slate-700 rounded-3xl shadow-xl',
          variant === 'glass' && 'bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl',
          className,
        )}
        {...props}
      >
        {icon && (
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
            <div className="relative text-slate-600 [&>svg]:w-20 [&>svg]:h-20 animate-fade-in">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-2xl font-display font-bold text-slate-100 mb-3 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-base text-slate-400 mb-8 max-w-sm leading-relaxed">
            {description}
          </p>
        )}
        {action && (
          <Button 
            onClick={action.onClick}
            variant="primary"
            className="px-8 py-3 rounded-2xl font-black uppercase tracking-wider text-xs"
          >
            {action.label}
          </Button>
        )}
      </div>
    </AnimatedMount>
  );
}

// Common empty state icons (using more stylish SVG)
export function EmptyBoxIcon() {
  return (
    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <defs>
        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} stroke="url(#boxGradient)"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

export function EmptySearchIcon() {
  return (
    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} stroke="url(#searchGradient)"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function EmptyListIcon() {
  return (
    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <defs>
        <linearGradient id="listGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} stroke="url(#listGradient)"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

