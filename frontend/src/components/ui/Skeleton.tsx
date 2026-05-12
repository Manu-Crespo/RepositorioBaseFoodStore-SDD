import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';

type SkeletonVariant = 'text' | 'card' | 'circle' | 'table-row';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const variantDefaults: Record<SkeletonVariant, { className: string }> = {
  text: { className: 'h-4 w-full rounded' },
  card: { className: 'h-48 w-full rounded-xl' },
  circle: { className: 'h-10 w-10 rounded-full' },
  'table-row': { className: 'h-12 w-full rounded-lg' },
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, style, ...props }, ref) => {
    const defaults = variantDefaults[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'animate-shimmer',
          defaults.className,
          className,
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton compositions
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4" aria-hidden="true">
      <Skeleton variant="card" className="h-40" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton variant="table-row" className="bg-slate-700" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="table-row" />
      ))}
    </div>
  );
}
