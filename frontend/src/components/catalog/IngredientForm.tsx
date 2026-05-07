/** IngredientForm component for creating/editing ingredients. */

import { useState, useEffect } from 'react';
import type { IngredientCreate, IngredientUpdate, IngredientResponse, Allergen } from '../../shared/types';
import { ALLERGEN_OPTIONS } from './constants';

interface IngredientFormProps {
  ingredient?: IngredientResponse | null;
  onSubmit: (data: IngredientCreate | IngredientUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function IngredientForm({
  ingredient,
  onSubmit,
  onCancel,
  isLoading = false,
}: IngredientFormProps) {
  const [name, setName] = useState('');
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setAllergens(ingredient.allergens);
    } else {
      setName('');
      setAllergens([]);
    }
  }, [ingredient]);

  const handleAllergenToggle = (allergen: Allergen) => {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      if (ingredient) {
        const updateData: IngredientUpdate = {
          name: name.trim(),
          allergens,
        };
        await onSubmit(updateData);
      } else {
        const createData: IngredientCreate = {
          name: name.trim(),
          allergens,
        };
        await onSubmit(createData);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del ingrediente"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alérgenos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ALLERGEN_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                allergens.includes(option.value) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={allergens.includes(option.value)}
                onChange={() => handleAllergenToggle(option.value)}
                className="rounded text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : ingredient ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}