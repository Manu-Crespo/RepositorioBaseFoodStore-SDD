/** AdminProductsPage - CRUD de productos admin. */

import { useEffect, useState } from 'react';
import { useProductStore, useCategoryStore, useIngredientStore } from '../stores';
import { ProductCard, ProductForm } from '../components/catalog';
import type { ProductResponse, ProductCreate, ProductUpdate } from '../shared/types';

export function AdminProductsPage() {
  const {
    products,
    total,
    page,
    limit,
    filters,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    setFilters,
    clearFilters,
    clearError,
  } = useProductStore();

  const { tree: categoriesTree, fetchTree } = useCategoryStore();
  const { ingredients, fetchIngredients } = useIngredientStore();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    fetchProducts();
    fetchTree();
    fetchIngredients({ limit: 100 });
  }, [fetchProducts, fetchTree, fetchIngredients]);

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
    fetchProducts({ page: newPage });
  };

  const handleCreate = async (data: ProductCreate | ProductUpdate) => {
    setFormLoading(true);
    try {
      await createProduct(data as ProductCreate);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating product:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: ProductCreate | ProductUpdate) => {
    if (!editingProduct) return;
    setFormLoading(true);
    try {
      await updateProduct(editingProduct.id, data as ProductUpdate);
      setEditingProduct(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error updating product:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (product: ProductResponse) => {
    if (!confirm(`¿Eliminar producto "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await updateStock(productId, newStock, 'set');
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (data: ProductCreate | ProductUpdate) => {
    if (editingProduct) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Productos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="px-3 py-2 border border-slate-600 rounded hover:bg-slate-700"
          >
            {viewMode === 'grid' ? '📋' : '📦'}
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingProduct(null);
            }}
            className="px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
          >
            + Nuevo producto
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300">
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filters.search || ''}
          onChange={(e) => {
            setFilters({ search: e.target.value });
            fetchProducts({ search: e.target.value });
          }}
          className="px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={() => {
            clearFilters();
            fetchProducts();
          }}
          className="px-3 py-2 text-slate-400 hover:text-slate-200"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product list */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-400">Cargando...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No hay productos</div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleEdit(product)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-200">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-200">Precio</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-200">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-200">Categorías</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-200">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-100">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-slate-400 line-clamp-1">{product.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-200">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 text-slate-100 rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.categories?.slice(0, 2).map((cat) => (
                            <span key={cat.id} className="px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 text-amber-400 hover:text-amber-300"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 border border-slate-600 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-slate-400">
                Página {page} de {Math.ceil(total / limit)}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
                className="px-3 py-1 border border-slate-600 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Product form */}
        {showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-fit">
            <h2 className="text-lg font-medium text-slate-100 mb-4">
              {editingProduct ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <ProductForm
              product={editingProduct}
              categories={categoriesTree}
              ingredients={ingredients}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              isLoading={formLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}