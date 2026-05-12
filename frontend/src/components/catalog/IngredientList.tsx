/** IngredientList component with allergen filters. */

import { useState } from 'react';
import type { IngredientResponse, Allergen } from '../../shared/types';
import { ALLERGEN_LABELS } from './constants';

interface IngredientListProps {
  ingredients: IngredientResponse[];
  isLoading?: boolean;
  onEdit?: (ingredient: IngredientResponse) => void;
  onDelete?: (ingredient: IngredientResponse) => void;
  onPageChange?: (page: number) => void;
  total?: number;
  page?: number;
  limit?: number;
}

export function IngredientList({
  ingredients,
  isLoading = false,
  onEdit,
  onDelete,
  onPageChange,
  total = 0,
  page = 1,
  limit = 20,
}: IngredientListProps) {
  const [filterAllergen, setFilterAllergen] = useState<Allergen | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter ingredients based on search and allergen
  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = searchTerm
      ? ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesAllergen = filterAllergen
      ? ingredient.allergens.includes(filterAllergen)
      : true;
    return matchesSearch && matchesAllergen;
  });

  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-slate-400">Cargando ingredientes...</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500"
          />
        </div>
        <select
          value={filterAllergen}
          onChange={(e) => setFilterAllergen(e.target.value as Allergen | '')}
          className="px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">Todos los alérgenos</option>
          {Object.entries(ALLERGEN_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700 border-b border-slate-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-200">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-200">Alérgenos</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredIngredients.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No se encontraron ingredientes
                </td>
              </tr>
            ) : (
              filteredIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="px-4 py-3">
                    <span className="text-slate-100">{ingredient.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ingredient.allergens.length === 0 ? (
                        <span className="text-sm text-slate-500">Sin alérgenos</span>
                      ) : (
                        ingredient.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="px-2 py-0.5 bg-amber-900/30 text-amber-400 text-xs rounded"
                          >
                            {ALLERGEN_LABELS[allergen] || allergen}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => onEdit?.(ingredient)}
                        className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete?.(ingredient)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 border border-slate-600 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-slate-400">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-slate-600 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
