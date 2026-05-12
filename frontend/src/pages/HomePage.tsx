/** HomePage - Landing page con hero, categorías destacadas y productos populares. */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { catalogueApi } from '../shared/api/catalogue';
import { ProductCard } from '../components/catalog';
import { Card, CardContent, Badge, Skeleton } from '../components/ui';
import { AnimatedMount } from '../components/ui/AnimatedMount';
import type { CatalogueProduct, CatalogueCategory } from '../shared/types';

/* ---------- SVG Icons ---------- */

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

/** Match category name to an emoji icon using case-insensitive keyword matching. */
function getCategoryIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('hamburguesa')) return '🍔';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('papas') || n.includes('frita') || n.includes('comida rápida')) return '🍟';
  if (n.includes('gaseosa') || n.includes('bebida') || n.includes('refresco') || n.includes('soda')) return '🥤';
  if (n.includes('postre') || n.includes('dulce')) return '🍰';
  if (n.includes('ensalada')) return '🥗';
  if (n.includes('italiana') || n.includes('pasta')) return '🍝';
  if (n.includes('mexicana') || n.includes('taco')) return '🌮';
  if (n.includes('sushi')) return '🍣';
  if (n.includes('carne') || n.includes('asado')) return '🥩';
  if (n.includes('pollo')) return '🍗';
  if (n.includes('pescado') || n.includes('mariscos')) return '🐟';
  if (n.includes('desayuno') || n.includes('medialuna') || n.includes('factura')) return '🥞';
  if (n.includes('café') || n.includes('cafe')) return '☕';
  if (n.includes('vegetariano') || n.includes('vegano') || n.includes('verdura')) return '🥗';
  return '📦';
}

interface CategoryCardProps {
  category: CatalogueCategory;
  index: number;
  onClick: (id: string) => void;
}

function CategoryCard({ category, index, onClick }: CategoryCardProps) {
  const icon = getCategoryIcon(category.name);

  return (
    <AnimatedMount variant="slide-up" delay={index * 60} className="aspect-square">
      <button
        onClick={() => onClick(category.id)}
        className="group relative flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl w-full h-full
          bg-slate-800/50 border border-slate-700/50
          hover:bg-slate-700/50 hover:border-amber-500/30
          hover:shadow-lg hover:shadow-amber-500/5
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label={`Ver productos de ${category.name}`}
      >
        <span className="text-2xl transition-transform duration-200 group-hover:scale-110" role="img" aria-hidden="true">
          {icon}
        </span>
        <span className="text-sm font-medium text-slate-200 group-hover:text-amber-400 transition-colors duration-200">
          {category.name}
        </span>
        {category.product_count > 0 && (
          <Badge variant="info" size="sm">
            {category.product_count}
          </Badge>
        )}
      </button>
    </AnimatedMount>
  );
}

function ProductCardSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="card" />
        </div>
      ))}
    </div>
  );
}

/* ---------- HomePage Component ---------- */

export function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CatalogueCategory[]>([]);
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [catRes, prodRes] = await Promise.all([
          catalogueApi.getCategories(),
          catalogueApi.getProducts({ limit: 8, sort_by: 'created_at', sort_order: 'desc' }),
        ]);
        if (!cancelled) {
          setCategories((catRes.data ?? []).filter((cat) => cat.parent_id !== null));
          setProducts(prodRes.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar datos');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCategories(false);
          setIsLoadingProducts(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/catalogo?category_id=${categoryId}`);
  };

  const handleProductClick = (product: CatalogueProduct) => {
    navigate(`/catalogo/producto/${product.id}`);
  };

  return (
    <div className="min-h-screen">
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/40">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <AnimatedMount variant="slide-up">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Pedí online, retirá en local
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-100 leading-tight">
                Descubrí los mejores{' '}
                <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                  sabores
                </span>
              </h1>

              <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
                Explorá nuestro catálogo de productos frescos y deliciosos.
                Hacé tu pedido online y retiralo cuando quieras.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/catalogo"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3.5
                    bg-gradient-to-r from-amber-500 to-amber-600
                    hover:from-amber-400 hover:to-amber-500
                    font-bold rounded-xl
                    border border-amber-400/20 hover:border-amber-300/40
                    shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40
                    hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-200 ease-out
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span className="text-white [-webkit-text-stroke:0.5px_#000]">Ver Catálogo</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.9)]">
                    <ArrowRightIcon />
                  </span>
                </Link>

                {categories.length > 0 && (
                  <a
                    href="#categorias"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                      bg-slate-800/80 border border-slate-700/60
                      hover:bg-slate-700/80 hover:border-slate-600
                      text-slate-200 font-medium rounded-xl
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Explorar Categorías
                  </a>
                )}
              </div>
            </div>
          </AnimatedMount>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent" />
      </section>

      {/* ========== POPULAR PRODUCTS SECTION ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error ? (
          <Card variant="bordered" className="max-w-md mx-auto text-center">
            <CardContent className="py-8">
              <p className="text-slate-400 mb-4">No pudimos cargar los productos</p>
              <Link
                to="/catalogo"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Ir al catálogo →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <AnimatedMount variant="slide-up">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
                  Productos Destacados
                </h2>
                <p className="mt-2 text-slate-400">
                  Los últimos productos agregados a nuestro catálogo
                </p>
              </div>
            </AnimatedMount>

            {isLoadingProducts ? (
              <ProductCardSkeletons />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product, i) => (
                    <AnimatedMount key={product.id} variant="slide-up" delay={i * 60}>
                      <ProductCard product={product} onClick={handleProductClick} />
                    </AnimatedMount>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <Link
                    to="/catalogo"
                    className="inline-flex items-center gap-2 px-6 py-3
                      bg-slate-800 border border-slate-700
                      hover:bg-slate-700 hover:border-amber-500/30
                      text-slate-200 font-medium rounded-lg
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Ver todos los productos
                    <ArrowRightIcon />
                  </Link>
                </div>
              </>
            ) : (
              <Card variant="bordered" className="max-w-md mx-auto text-center">
                <CardContent className="py-8">
                  <p className="text-slate-400 mb-4">No hay productos disponibles</p>
                  <Link
                    to="/catalogo"
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    Ir al catálogo →
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      {isLoadingCategories ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-3 mb-8">
            <Skeleton variant="text" className="h-8 w-48" />
            <Skeleton variant="text" className="h-4 w-72" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="aspect-square" />
            ))}
          </div>
        </section>
      ) : categories.length > 0 ? (
        <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimatedMount variant="slide-up">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
                Categorías
              </h2>
              <p className="mt-2 text-slate-400">
                Explorá nuestros productos por categoría
              </p>
            </div>
          </AnimatedMount>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} onClick={handleCategoryClick} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
