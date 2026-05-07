/** CataloguePage - Catálogo público con filtros. */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalogueStore } from '../stores';
import { ProductCard, ProductFilters, Pagination } from '../components/catalog';
import { EmptyState, EmptySearchIcon, ProductCardSkeletonGrid } from '../components/ui';
import type { CatalogueProduct } from '../shared/types';

export function CataloguePage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchCategories();
    fetchAllergens();
    fetchProducts();
  }, [fetchProducts, fetchCategories, fetchAllergens]);

  const handleProductClick = (product: CatalogueProduct) => {
    navigate(`/catalogo/producto/${product.id}`);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    fetchProducts({ ...filters, ...newFilters });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
    fetchProducts({ page: newPage });
  };

  const handleClearFilters = () => {
    clearFilters();
    fetchProducts();
  };

  // Has active filters
  const hasActiveFilters = filters.search || filters.category_id || filters.exclude_allergens?.length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-display font-bold text-slate-100 mb-6">Catálogo de Productos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            categories={categories}
            allergens={allergens}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : products.length === 0 ? (
            hasActiveFilters ? (
              <EmptyState
                title="No se encontraron productos"
                description="Intenta con otros filtros o limpia los actuales"
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
            )
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">
                Mostrando {products.length} de {total} productos
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>

              {total > limit && (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalItems={total}
                    itemsPerPage={limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}