import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  interactive?: boolean;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-slate-800 border border-slate-700 rounded-xl',
          'transition-all duration-200',
          variant === 'interactive' && 'hover:shadow-lg hover:border-slate-600 hover:scale-[1.01]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-slate-700', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
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
  )
);

CardFooter.displayName = 'CardFooter';