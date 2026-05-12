/** CataloguePage - Catálogo público con stagger entrance, transiciones y panel de filtros mobile. */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCatalogueStore } from '../stores';
import { ProductCard, ProductFilters, Pagination } from '../components/catalog';
import { EmptyState, EmptySearchIcon, ProductCardSkeletonGrid, AnimatedMount } from '../components/ui';
import type { CatalogueProduct } from '../shared/types';

export function CataloguePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    products,
    categories,
    allergens,
    total,
    page,
    limit,
    filters,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    fetchAllergens,
    setFilters,
    clearFilters,
  } = useCatalogueStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Read category_id from URL on mount
  useEffect(() => {
    const catId = searchParams.get('category_id');
    if (catId) {
      setFilters({ category_id: catId });
      fetchProducts({ category_id: catId });
    } else {
      fetchProducts();
    }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchAllergens();
  }, [fetchCategories, fetchAllergens]);

  const handleProductClick = (product: CatalogueProduct) => {
    navigate(`/catalogo/producto/${product.id}`);
  };

  const handleFilterChange = async (newFilters: Partial<typeof filters>) => {
    setIsTransitioning(true);
    setFilters(newFilters);
    await fetchProducts({ ...filters, ...newFilters });
    setTimeout(() => setIsTransitioning(false), 250);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
    fetchProducts({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    clearFilters();
    fetchProducts();
  };

  const hasActiveFilters = filters.search || filters.category_id || filters.exclude_allergens?.length;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-100">
            Catálogo de Productos
          </h1>
          {!isLoading && (
            <p className="text-sm text-slate-500 mt-1">
              {total > 0
                ? `Mostrando ${products.length} de ${total} productos`
                : 'Productos disponibles'}
            </p>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2
            bg-slate-800 border border-slate-700 rounded-lg
            text-slate-300 text-sm font-medium
            hover:bg-slate-700 hover:border-slate-600
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-expanded={mobileFiltersOpen}
          aria-controls="mobile-filters-panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm animate-fade-in" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ========== FILTERS SIDEBAR ========== */}
        {/* Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              categories={categories}
              allergens={allergens}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        </div>

        {/* Mobile slide-in panel */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />

            {/* Panel */}
            <div
              id="mobile-filters-panel"
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw]
                bg-slate-800 border-l border-slate-700 shadow-2xl
                animate-slide-left overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-slate-100">Filtros</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700"
                  aria-label="Cerrar filtros"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <ProductFilters
                  filters={filters}
                  categories={categories}
                  allergens={allergens}
                  onFilterChange={(f) => {
                    handleFilterChange(f);
                    setMobileFiltersOpen(false);
                  }}
                  onClear={() => {
                    handleClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========== PRODUCT GRID ========== */}
        <div className="lg:col-span-3">
          {isLoading && !isTransitioning ? (
            <ProductCardSkeletonGrid count={6} />
          ) : products.length === 0 ? (
            <div className="animate-fade-in">
              {hasActiveFilters ? (
                <EmptyState
                  title="No se encontraron productos"
                  description="Intentá con otros filtros o limpiá los actuales"
                  icon={<EmptySearchIcon />}
                  action={{
                    label: 'Limpiar filtros',
                    onClick: handleClearFilters,
                  }}
                />
              ) : (
                <EmptyState
                  title="No hay productos disponibles"
                  description="El catálogo está vacío en este momento"
                />
              )}
            </div>
          ) : (
            <>
              {/* Transition wrapper */}
              <div
                className={`transition-opacity duration-250 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product, i) => (
                    <AnimatedMount key={product.id} variant="slide-up" delay={i * 50}>
                      <ProductCard
                        product={product}
                        onClick={handleProductClick}
                      />
                    </AnimatedMount>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalItems={total}
                      itemsPerPage={limit}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
