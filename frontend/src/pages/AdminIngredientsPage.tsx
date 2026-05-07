/** AdminIngredientsPage - CRUD de ingredientes. */

import { useEffect, useState } from 'react';
import { useIngredientStore } from '../stores';
import { IngredientList, IngredientForm } from '../components/catalog';
import type { IngredientResponse, IngredientCreate, IngredientUpdate } from '../shared/types';

export function AdminIngredientsPage() {
  const {
    ingredients,
    total,
    page,
    limit,
    isLoading,
    error,
    fetchIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    clearError,
  } = useIngredientStore();

  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<IngredientResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchIngredients({ page: 1, limit: 20 });
  }, [fetchIngredients]);

  const handlePageChange = (newPage: number) => {
    fetchIngredients({ page: newPage, limit });
  };

  const handleCreate = async (data: IngredientCreate | IngredientUpdate) => {
    setFormLoading(true);
    try {
      await createIngredient(data as IngredientCreate);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating ingredient:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: IngredientCreate | IngredientUpdate) => {
    if (!editingIngredient) return;
    setFormLoading(true);
    try {
      await updateIngredient(editingIngredient.id, data as IngredientUpdate);
      setEditingIngredient(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error updating ingredient:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (ingredient: IngredientResponse) => {
    if (!confirm(`¿Eliminar ingrediente "${ingredient.name}"?`)) return;
    try {
      await deleteIngredient(ingredient.id);
    } catch (err) {
      console.error('Error deleting ingredient:', err);
    }
  };

  const handleEdit = (ingredient: IngredientResponse) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const handleSubmit = async (data: IngredientCreate | IngredientUpdate) => {
    if (editingIngredient) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Ingredientes</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingIngredient(null);
          }}
          className="px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + Nuevo ingrediente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredient list */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-4">
          <IngredientList
            ingredients={ingredients}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            total={total}
            page={page}
            limit={limit}
          />
        </div>

        {/* Ingredient form */}
        {showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-fit">
            <h2 className="text-lg font-medium text-slate-100 mb-4">
              {editingIngredient ? 'Editar ingrediente' : 'Nuevo ingrediente'}
            </h2>
            <IngredientForm
              ingredient={editingIngredient}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingIngredient(null);
              }}
              isLoading={formLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}