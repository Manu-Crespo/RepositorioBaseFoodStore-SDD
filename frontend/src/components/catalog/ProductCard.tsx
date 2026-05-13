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
        className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700/50 hover:border-amber-500/30 transition-all group"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
          📦
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
            {product.name}
          </p>
          <p className="text-xs font-medium text-amber-500/90">${product.price.toFixed(2)}</p>
        </div>
        {isOutOfStock && (
          <Badge variant="error" size="sm">Sin stock</Badge>
        )}
      </div>
    );
  }

  return (
    <Card
      variant="interactive"
      className={`group relative flex flex-col h-full ${isOutOfStock ? 'opacity-80 grayscale-[0.5]' : ''}`}
      onClick={() => onClick?.(product)}
    >
      {/* Image Container with Gradient Placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 via-slate-800 to-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
            <span className="relative text-5xl filter drop-shadow-lg">
              {product.name.toLowerCase().includes('hamburguesa') ? '🍔' : 
               product.name.toLowerCase().includes('pizza') ? '🍕' : 
               product.name.toLowerCase().includes('papa') ? '🍟' : 
               product.name.toLowerCase().includes('bebida') ? '🥤' : '🛒'}
            </span>
          </div>
        </div>
        
        {/* Badges on top of image */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {isOutOfStock ? (
            <Badge variant="error" className="shadow-lg backdrop-blur-md bg-red-900/80">Sin stock</Badge>
          ) : product.stock < 10 ? (
            <Badge variant="warning" className="shadow-lg backdrop-blur-md bg-amber-900/80">¡Últimos {product.stock}!</Badge>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-display font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Precio</span>
            <span className="text-2xl font-black text-amber-400 leading-none">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          {!isOutOfStock && (
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20 group-hover:scale-110 active:scale-95 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
        </div>

        {/* Categories & Allergens Footer */}
        {(product.categories?.length || product.allergens?.length) ? (
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-1.5">
            {product.categories?.slice(0, 2).map((cat) => (
              <Badge key={cat.id} variant="default" size="sm" className="bg-slate-700/50 text-slate-400 lowercase font-bold">
                #{cat.name}
              </Badge>
            ))}
            {product.allergens?.slice(0, 2).map((allergen) => (
              <Badge key={allergen} variant="warning" size="sm" className="bg-amber-900/20 border-transparent text-amber-500/80 font-black">
                {allergen}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}