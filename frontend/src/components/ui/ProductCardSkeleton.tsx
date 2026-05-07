/** ProductCardSkeleton - Skeleton loading para tarjetas de productos. */

export function ProductCardSkeleton() {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-slate-700/50" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-slate-700/50 rounded w-3/4" />

        {/* Description */}
        <div className="h-4 bg-slate-700/50 rounded w-full" />
        <div className="h-4 bg-slate-700/50 rounded w-2/3" />

        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-slate-700/50 rounded w-20" />
          <div className="h-9 bg-slate-700/50 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

/** ProductCardSkeleton - Skeleton grid para el catálogo. */
export function ProductCardSkeletonGrid({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}