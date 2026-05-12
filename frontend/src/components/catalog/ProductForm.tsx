/** ProductForm component for creating/editing products. */

import { useState, useEffect } from 'react';
import type { ProductCreate, ProductUpdate, ProductResponse, CategoryTree, IngredientResponse } from '../../shared/types';

interface ProductFormProps {
  product?: ProductResponse | null;
  categories: CategoryTree[];
  ingredients: IngredientResponse[];
  onSubmit: (data: ProductCreate | ProductUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  categories,
  ingredients,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [ingredientIds, setIngredientIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategoryIds(product.categories?.map((c) => c.id) || []);
      setIngredientIds(product.ingredients?.map((i) => i.id) || []);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategoryIds([]);
      setIngredientIds([]);
    }
  }, [product]);

  const handleCategoryToggle = (categoryId: string) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleIngredientToggle = (ingredientId: string) => {
    setIngredientIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setError('El stock debe ser 0 o mayor');
      return;
    }

    try {
      if (product) {
        const updateData: ProductUpdate = {
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceNum,
          stock: stockNum,
          category_ids: categoryIds,
          ingredient_ids: ingredientIds,
        };
        await onSubmit(updateData);
      } else {
        const createData: ProductCreate = {
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceNum,
          stock: stockNum,
          category_ids: categoryIds,
          ingredient_ids: ingredientIds,
        };
        await onSubmit(createData);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Flatten categories for display
  const flatCategories = categories.reduce<{ id: string; name: string; depth: number }[]>((acc, cat) => {
    const addWithDepth = (c: CategoryTree, depth: number) => {
      acc.push({ id: c.id, name: c.name, depth });
      c.children?.forEach((child) => addWithDepth(child, depth + 1));
    };
    addWithDepth(cat, 0);
    return acc;
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Nombre del producto"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
        </div>
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
          placeholder="Descripción del producto"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          Stock *
        </label>
        <input
          id="stock"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
        <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
          {flatCategories.length === 0 ? (
            <p className="text-sm text-gray-400">No hay categorías disponibles</p>
          ) : (
            flatCategories.filter((cat) => cat.depth > 0).map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-50 ${
                  categoryIds.includes(cat.id) ? 'bg-blue-50' : ''
                }`}
                style={{ paddingLeft: `${cat.depth * 16 + 8}px` }}
              >
                <input
                  type="checkbox"
                  checked={categoryIds.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ingredientes</label>
        <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
          {ingredients.length === 0 ? (
            <p className="text-sm text-gray-400">No hay ingredientes disponibles</p>
          ) : (
            ingredients.map((ing) => (
              <label
                key={ing.id}
                className={`flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-50 ${
                  ingredientIds.includes(ing.id) ? 'bg-blue-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={ingredientIds.includes(ing.id)}
                  onChange={() => handleIngredientToggle(ing.id)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm">{ing.name}</span>
              </label>
            ))
          )}
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
          {isLoading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}