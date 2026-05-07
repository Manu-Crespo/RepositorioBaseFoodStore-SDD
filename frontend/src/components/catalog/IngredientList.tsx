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
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
        Cargando ingredientes...
      </div>
    );
  }

  return (
    <div className="ingredient-list space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterAllergen}
          onChange={(e) => setFilterAllergen(e.target.value as Allergen | '')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Alérgenos</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredIngredients.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron ingredientes
                </td>
              </tr>
            ) : (
              filteredIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{ingredient.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ingredient.allergens.length === 0 ? (
                        <span className="text-sm text-gray-400">Sin alérgenos</span>
                      ) : (
                        ingredient.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
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
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete?.(ingredient)}
                        className="p-1 text-red-600 hover:text-red-800"
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
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}