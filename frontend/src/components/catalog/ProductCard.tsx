/** ProductCard component for displaying products in lists. */

import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ProductBase {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  categories?: { id: string; name: string }[];
  allergens?: string[];
}

interface ProductCardProps<T extends ProductBase> {
  product: T;
  onClick?: (product: T) => void;
  variant?: 'default' | 'compact';
}

export function ProductCard<T extends ProductBase>({ product, onClick, variant = 'default' }: ProductCardProps<T>) {
  const isOutOfStock = product.stock <= 0;

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick?.(product)}
        className="flex items-center gap-3 p-2 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
      >
        <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center text-slate-500">
          📦
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{product.name}</p>
          <p className="text-sm text-slate-400">${product.price.toFixed(2)}</p>
        </div>
        {isOutOfStock && (
          <Badge variant="error">Sin stock</Badge>
        )}
      </div>
    );
  }

  return (
    <Card
      variant="interactive"
      className={`overflow-hidden cursor-pointer ${isOutOfStock ? 'opacity-75' : ''}`}
      onClick={() => onClick?.(product)}
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-slate-700 flex items-center justify-center">
        <span className="text-4xl text-slate-500">🛒</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-slate-100 mb-1 line-clamp-2">{product.name}</h3>

        {product.description && (
          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{product.description}</p>
        )}

        {/* Price and stock */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-400">${product.price.toFixed(2)}</span>
          {isOutOfStock ? (
            <Badge variant="error">Sin stock</Badge>
          ) : (
            <span className="text-sm text-emerald-400">{product.stock} disponibles</span>
          )}
        </div>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.categories.slice(0, 2).map((cat: { id: string; name: string }) => (
              <span key={cat.id} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                {cat.name}
              </span>
            ))}
            {product.categories.length > 2 && (
              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                +{product.categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Allergens warning */}
        {product.allergens && product.allergens.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.allergens.slice(0, 3).map((allergen: string) => (
              <span
                key={allergen}
                className="px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs rounded"
              >
                ⚠️ {allergen}
              </span>
            ))}
            {product.allergens.length > 3 && (
              <span className="px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs rounded">
                +{product.allergens.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}