/** ProductFilters component for filtering products in catalogue. */

import { useCallback } from 'react';
import { Button } from '../ui/Button';
import type { CatalogueFilters, CatalogueCategory, Allergen, AllergenInfo } from '../../shared/types';
import { ALLERGEN_OPTIONS } from './constants';

interface ProductFiltersProps {
  filters: CatalogueFilters;
  categories: CatalogueCategory[];
  allergens: AllergenInfo[];
  onFilterChange: (filters: Partial<CatalogueFilters>) => void;
  onClear: () => void;
}

export function ProductFilters({
  filters,
  categories,
  allergens: _allergens,
  onFilterChange,
  onClear,
}: ProductFiltersProps) {
  void _allergens; // Reserved for future use
  const handleChange = (key: keyof CatalogueFilters, value: unknown) => {
    onFilterChange({ [key]: value || undefined });
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
      // Enter key to apply filter
      if (e.key === 'Enter') {
        const target = e.target as HTMLInputElement;
        target.blur();
      }
      // Arrow keys for quick navigation
      if (e.key === 'ArrowDown' && e.altKey) {
        const select = e.target as HTMLSelectElement;
        select.focus();
        e.preventDefault();
      }
    },
    []
  );

  const handleAllergenToggle = (allergen: Allergen) => {
    const current = filters.exclude_allergens || [];
    const updated = current.includes(allergen)
      ? current.filter((a) => a !== allergen)
      : [...current, allergen];
    onFilterChange({ exclude_allergens: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="product-filters space-y-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-slate-300 mb-1">
          Buscar
        </label>
        <input
          id="search"
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos..."
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500"
          aria-label="Buscar productos"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
          Categoría
        </label>
        <select
          id="category"
          value={filters.category_id || ''}
          onChange={(e) => handleChange('category_id', e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.product_count})
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-slate-300 mb-1">
            Precio mínimo
          </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
            <input
              id="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={filters.min_price || ''}
              onChange={(e) => handleChange('min_price', e.target.value)}
              placeholder="0"
              className="w-full pl-6 pr-2 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-slate-300 mb-1">
            Precio máximo
          </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
            <input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={filters.max_price || ''}
              onChange={(e) => handleChange('max_price', e.target.value)}
              placeholder="999"
              className="w-full pl-6 pr-2 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Allergens to exclude */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Excluir alérgenos
        </label>
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAllergenToggle(option.value)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                filters.exclude_allergens?.includes(option.value)
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="sortBy" className="block text-sm font-medium text-slate-300 mb-1">
          Ordenar por
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            id="sortBy"
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleChange('sort_by', e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="created_at">Fecha</option>
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
          </select>
          <select
            id="sortOrder"
            value={filters.sort_order || 'desc'}
            onChange={(e) => handleChange('sort_order', e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      {/* Clear filters */}
      <Button variant="secondary" onClick={onClear} className="w-full">
        Limpiar filtros
      </Button>
    </div>
  );
}