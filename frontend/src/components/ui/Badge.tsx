import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-200',
  success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-700',
  warning: 'bg-amber-900/50 text-amber-400 border border-amber-700',
  error: 'bg-red-900/50 text-red-400 border border-red-700',
  info: 'bg-blue-900/50 text-blue-400 border border-blue-700',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

// Role-specific badges
export const roleBadgeVariant: Record<string, BadgeVariant> = {
  admin: 'error',
  stock: 'warning',
  customer: 'info',
};

export function RoleBadge({ role }: { role: string }) {
  const variant = roleBadgeVariant[role] || 'default';
  return (
    <Badge variant={variant}>
      {role}
    </Badge>
  );
}