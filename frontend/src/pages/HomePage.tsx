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
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800/50">
        {/* Advanced decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Main mesh gradients */}
          <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[80%] rounded-full bg-amber-600/10 blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-amber-500/5 blur-[100px]" />
          <div className="absolute bottom-0 right-[20%] w-[40%] h-[40%] rounded-full bg-slate-800 blur-[80px]" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-44">
          <AnimatedMount variant="slide-up">
            <div className="max-w-4xl">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-black uppercase tracking-widest mb-8 shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Sabor Artesanal & Envío Rápido
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter mb-8">
                Lo mejor del <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                  sabor local
                </span>
              </h1>

              <p className="mt-4 text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed font-medium">
                Ingredientes frescos, recetas clásicas y la comodidad de pedir 
                desde donde estés. <span className="text-slate-200">Tu próxima comida favorita te espera.</span>
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-5">
                <Link
                  to="/catalogo"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-4
                    bg-amber-500 text-slate-950 font-black rounded-2xl
                    hover:bg-amber-400 hover:scale-[1.03] active:scale-[0.97]
                    transition-all duration-300 ease-out
                    shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-4 focus:ring-offset-slate-900"
                >
                  <span className="text-lg uppercase tracking-tight text-slate-950">Explorar Menú</span>
                  <div className="p-1 bg-black/10 rounded-full group-hover:translate-x-1 transition-transform text-slate-950">
                    <ArrowRightIcon />
                  </div>
                </Link>


                <a
                  href="#categorias"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4
                    bg-slate-800/40 backdrop-blur-md border border-slate-700/50
                    hover:bg-slate-700/60 hover:border-amber-500/30
                    text-slate-100 font-bold rounded-2xl
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-4 focus:ring-offset-slate-900"
                >
                  Categorías
                </a>
              </div>
              
              {/* Stats/Features sutiles */}
              <div className="mt-16 pt-10 border-t border-slate-800/50 flex flex-wrap gap-x-12 gap-y-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">15min</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Entrega promedio</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">100%</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fresco & Natural</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">+5k</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clientes felices</span>
                </div>
              </div>
            </div>
          </AnimatedMount>
        </div>

        {/* Bottom decorative fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
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
