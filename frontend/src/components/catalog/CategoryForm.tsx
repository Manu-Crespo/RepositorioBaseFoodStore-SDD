/** CategoryForm component for creating/editing categories. */

import { useState, useEffect } from 'react';
import type { CategoryCreate, CategoryUpdate, CategoryTree } from '../../shared/types';

interface CategoryFormProps {
  category?: CategoryTree | null;
  parentId?: string | null;
  parentCategories?: Array<{ id: string; name: string }>;
  onSubmit: (data: CategoryCreate | CategoryUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({
  category,
  parentId,
  parentCategories = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState('');
  const [parentIdValue, setParentIdValue] = useState<string>(parentId || category?.parent_id || '');
  const [error, setError] = useState<string | null>(null);

  // Filter parent categories — exclude the category itself and its descendants when editing
  const availableParents = parentCategories.filter((p) => p.id !== category?.id);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentIdValue(category.parent_id || '');
    } else {
      setName('');
      setParentIdValue(parentId || '');
    }
  }, [category, parentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      if (category) {
        // Update
        const updateData: CategoryUpdate = {
          name: name.trim(),
          description: description.trim() || undefined,
          parent_id: parentIdValue || undefined,
        };
        await onSubmit(updateData);
      } else {
        // Create
        const createData: CategoryCreate = {
          name: name.trim(),
          description: description.trim() || undefined,
          parent_id: parentIdValue || undefined,
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
          placeholder="Nombre de la categoría"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descripción opcional"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría padre
        </label>
        <select
          id="parent"
          value={parentIdValue}
          onChange={(e) => setParentIdValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">Categoría padre</option>
          {availableParents.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
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
          {isLoading ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}