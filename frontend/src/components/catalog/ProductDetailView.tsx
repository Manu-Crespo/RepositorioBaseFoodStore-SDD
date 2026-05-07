/** ProductDetailView component for displaying product details. */

import type { CatalogueProductDetail } from '../../shared/types';
import { ALLERGEN_LABELS } from './constants';

interface ProductDetailViewProps {
  product: CatalogueProductDetail;
  onAddToCart?: (product: CatalogueProductDetail) => void;
  onRelatedClick?: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductDetailView({
  product,
  onAddToCart,
  onRelatedClick,
  isLoading = false,
}: ProductDetailViewProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-detail space-y-6">
      {/* Breadcrumbs */}
      {product.categories && product.categories.length > 0 && (
        <nav className="text-sm text-gray-500">
          {product.categories.map((cat, idx) => (
            <span key={cat.id}>
              {idx > 0 ? ' > ' : ''}
              <span className="hover:text-gray-700 cursor-pointer">{cat.name}</span>
            </span>
          ))}
        </nav>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-6xl text-gray-300">🛒</span>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {isOutOfStock ? (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Sin stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {product.stock} disponibles
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600">{product.description}</p>
          )}

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-2">⚠️ Alérgenos</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="px-2 py-1 bg-white text-orange-700 text-sm rounded border border-orange-200"
                  >
                    {ALLERGEN_LABELS[allergen] || allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          {!isOutOfStock && onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Agregando...' : 'Agregar al carrito'}
            </button>
          )}
        </div>
      </div>

      {/* Related products */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Productos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.related_products.map((related) => (
              <div
                key={related.id}
                onClick={() => onRelatedClick?.(related.id)}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-2xl text-gray-300">🛒</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{related.name}</h3>
                <p className="text-sm font-bold text-gray-900">${related.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}