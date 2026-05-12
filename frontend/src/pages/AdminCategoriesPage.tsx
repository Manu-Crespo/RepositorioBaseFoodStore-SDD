/** AdminCategoriesPage - CRUD de categorías. */

import { useEffect, useState } from 'react';
import { useCategoryStore } from '../stores';
import { CategoryTree, CategoryForm } from '../components/catalog';
import type { CategoryTree as CategoryTreeType, CategoryCreate, CategoryUpdate } from '../shared/types';

export function AdminCategoriesPage() {
  const { 
    tree, 
    fetchTree, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    isLoading, 
    error, 
    clearError 
  } = useCategoryStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryTreeType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTreeType | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const handleCreate = async (data: CategoryCreate | CategoryUpdate) => {
    setFormLoading(true);
    try {
      await createCategory(data as CategoryCreate);
      setShowForm(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: CategoryCreate | CategoryUpdate) => {
    if (!editingCategory) return;
    setFormLoading(true);
    try {
      await updateCategory(editingCategory.id, data as CategoryUpdate);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (category: CategoryTreeType) => {
    if (!confirm(`¿Eliminar categoría "${category.name}"?`)) return;
    try {
      await deleteCategory(category.id);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleEdit = (category: CategoryTreeType) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (data: CategoryCreate | CategoryUpdate) => {
    if (editingCategory) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Categorías</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
          }}
          className="px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + Nueva categoría
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category tree */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-medium text-slate-100 mb-4">Estructura de categorías</h2>
          {isLoading ? (
            <div className="text-center py-8 text-slate-400">Cargando...</div>
          ) : (
            <CategoryTree
              categories={tree}
              onSelect={setSelectedCategory}
              selectedId={selectedCategory?.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editable
            />
          )}
        </div>

        {/* Category form */}
        {showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h2 className="text-lg font-medium text-slate-100 mb-4">
              {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <CategoryForm
              category={editingCategory}
              parentCategories={tree}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
              isLoading={formLoading}
            />
          </div>
        )}

        {/* Selected category details */}
        {selectedCategory && !showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h2 className="text-lg font-medium text-slate-100 mb-4">Detalles</h2>
            <div className="space-y-2 text-slate-300">
              <p><span className="font-medium text-slate-100">Nombre:</span> {selectedCategory.name}</p>
              <p><span className="font-medium text-slate-100">ID:</span> {selectedCategory.id}</p>
              <p><span className="font-medium text-slate-100">Orden:</span> {selectedCategory.order}</p>
              <p><span className="font-medium text-slate-100">Subcategorías:</span> {selectedCategory.children?.length || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}