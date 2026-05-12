/** ProductDetailPage - Detalle de producto con layout asimétrico y galería. */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalogueStore, useCartStore } from '../stores';
import { PageLoader, EmptyState, Badge, Button, AnimatedMount } from '../components/ui';

/* ---------- SVG Icons ---------- */

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

/* ---------- Quantity Selector ---------- */

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-slate-600 rounded-lg bg-slate-800/50">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
        aria-label="Disminuir cantidad"
      >
        <MinusIcon />
      </button>
      <span className="px-4 py-2 text-slate-100 font-medium min-w-[3rem] text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
        aria-label="Aumentar cantidad"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

/* ---------- Related Product Card ---------- */

interface RelatedProductCardProps {
  product: { id: string; name: string; price: number };
  onClick: (id: string) => void;
}

function RelatedProductCard({ product, onClick }: RelatedProductCardProps) {
  return (
    <button
      onClick={() => onClick(product.id)}
      className="group text-left p-4 rounded-xl bg-slate-800/50 border border-slate-700/50
        hover:bg-slate-700/50 hover:border-amber-500/30
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-amber-500/50"
    >
      <div className="aspect-square bg-slate-700 rounded-lg mb-3 flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h4 className="text-sm font-medium text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-2">
        {product.name}
      </h4>
      <p className="text-sm font-bold text-amber-400 mt-1">${product.price.toFixed(2)}</p>
    </button>
  );
}

/* ---------- Page Component ---------- */

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, fetchProduct } = useCatalogueStore();
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [prevId, setPrevId] = useState(id);

  // Reset state when id changes (during render as recommended by React)
  if (id !== prevId) {
    setPrevId(id);
    setQuantity(1);
    setAddedToCart(false);
  }

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  const handleAddToCart = (product: typeof currentProduct) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleRelatedClick = (productId: string) => {
    navigate(`/catalogo/producto/${productId}`);
  };

  /* ---------- Loading State ---------- */
  if (isLoading) {
    return (
      <div className="p-6">
        <PageLoader />
      </div>
    );
  }

  /* ---------- Error State ---------- */
  if (error) {
    return (
      <div className="p-6">
        <AnimatedMount variant="fade-in">
          <EmptyState
            title="Error al cargar producto"
            description={error}
            action={{
              label: 'Volver al catálogo',
              onClick: () => navigate('/catalogo'),
            }}
          />
        </AnimatedMount>
      </div>
    );
  }

  /* ---------- Not Found ---------- */
  if (!currentProduct) {
    return (
      <div className="p-6">
        <AnimatedMount variant="fade-in">
          <EmptyState
            title="Producto no encontrado"
            description="El producto que buscás no está disponible"
            action={{
              label: 'Volver al catálogo',
              onClick: () => navigate('/catalogo'),
            }}
          />
        </AnimatedMount>
      </div>
    );
  }

  const p = currentProduct;
  const isOutOfStock = p.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/catalogo')}
        className="group inline-flex items-center gap-2 mb-6 text-slate-400 hover:text-amber-400 transition-colors duration-200"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">
          <ArrowLeftIcon />
        </span>
        Volver al catálogo
      </button>

      {/* ========== ASYMMETRIC LAYOUT ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* ----- Image Gallery (3/5) ----- */}
        <AnimatedMount variant="slide-up" className="lg:col-span-3">
          <div className="relative">
            {/* Main image */}
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800
              flex items-center justify-center border border-slate-700/50 overflow-hidden
              shadow-xl shadow-slate-900/30">
              <svg className="w-24 h-24 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all duration-200
                    flex items-center justify-center bg-slate-700/50
                    ${i === 0 ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-slate-700 hover:border-slate-600'}`}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-current={i === 0 ? 'true' : undefined}
                >
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </AnimatedMount>

        {/* ----- Product Info (2/5) ----- */}
        <AnimatedMount variant="slide-up" delay={100} className="lg:col-span-2">
          <div className="space-y-6">
            {/* Categories */}
            {p.categories && p.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.categories.map((cat) => (
                  <Badge key={cat.id} variant="info" size="sm">{cat.name}</Badge>
                ))}
              </div>
            )}

            {/* Name & Description */}
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-100">{p.name}</h1>
              {p.description && (
                <p className="mt-3 text-slate-400 leading-relaxed">{p.description}</p>
              )}
            </div>

            {/* Price spotlight */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-400/5 border border-amber-500/20">
              <p className="text-sm text-amber-400/70 font-medium mb-1">Precio</p>
              <p className="text-4xl font-bold text-amber-400 tabular-nums">
                ${p.price.toFixed(2)}
              </p>
            </div>

            {/* Stock */}
            {isOutOfStock ? (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400 text-sm">
                Sin stock disponible
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {p.stock} disponibles
              </div>
            )}

            {/* Ingredients */}
            {p.ingredients && p.ingredients.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-300 mb-2">Ingredientes</p>
                <div className="flex flex-wrap gap-2">
                  {p.ingredients.map((ingredient) => (
                    <Badge
                      key={ingredient.id}
                      variant={ingredient.is_allergen ? 'warning' : 'default'}
                      size="sm"
                    >
                      {ingredient.name}
                      {ingredient.is_allergen && (
                        <span className="ml-1 text-amber-300" title="Alérgeno">⚡</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {p.allergens && p.allergens.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-300 mb-2">Alérgenos</p>
                <div className="flex flex-wrap gap-2">
                  {p.allergens.map((allergen) => (
                    <Badge key={allergen} variant="warning" size="sm">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">Cantidad:</span>
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                </div>

                <Button
                  onClick={() => handleAddToCart(p)}
                  isLoading={false}
                  className="w-full"
                  variant={addedToCart ? 'secondary' : 'primary'}
                >
                  {addedToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Agregado al carrito
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCartIcon />
                      Agregar al carrito — ${(p.price * quantity).toFixed(2)}
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Related Products */}
            {p.related_products && p.related_products.length > 0 && (
              <div className="pt-4 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Productos relacionados</h3>
                <div className="grid grid-cols-2 gap-3">
                  {p.related_products.map((related) => (
                    <RelatedProductCard
                      key={related.id}
                      product={related}
                      onClick={handleRelatedClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </AnimatedMount>
      </div>
    </div>
  );
}
