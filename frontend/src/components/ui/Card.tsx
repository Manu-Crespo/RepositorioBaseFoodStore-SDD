import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';

type CardVariant = 'default' | 'interactive' | 'elevated' | 'bordered' | 'glass';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  animated?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-slate-800 border border-slate-700 rounded-xl',
  interactive:
    'bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/30',
  elevated:
    'bg-slate-800 border border-slate-700 rounded-xl shadow-lg shadow-black/10',
  bordered:
    'bg-transparent border border-slate-700 rounded-xl',
  glass:
    'bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl',
};


export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', animated, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          'transition-all duration-200 ease-out',
          animated && 'animate-fade-in',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/* ── Card sub-components ── */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-b border-slate-700 flex items-center justify-between gap-4',
        className,
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  ),
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-slate-700', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-display font-semibold text-slate-100', className)}
      {...props}
    >
      {children}
    </h3>
  ),
);

CardTitle.displayName = 'CardTitle';
