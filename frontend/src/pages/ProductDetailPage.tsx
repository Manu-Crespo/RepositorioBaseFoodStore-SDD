/** ProductDetailPage - Detalle de producto público. */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalogueStore, useCartStore } from '../stores';
import { ProductDetailView } from '../components/catalog';
import { PageLoader, EmptyState } from '../components/ui';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, fetchProduct } = useCatalogueStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  const handleAddToCart = async (product: typeof currentProduct) => {
    if (!product) return;
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: undefined,
    });
    alert('Producto agregado al carrito');
  };

  const handleRelatedClick = (productId: string) => {
    navigate(`/catalogo/producto/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Error al cargar producto"
          description={error}
          action={{
            label: 'Volver al catálogo',
            onClick: () => navigate('/catalogo'),
          }}
        />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="p-6">
        <EmptyState
          title="Producto no encontrado"
          description="El producto que buscas no está disponible"
          action={{
            label: 'Volver al catálogo',
            onClick: () => navigate('/catalogo'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/catalogo')}
        className="mb-4 text-amber-400 hover:text-amber-300 flex items-center gap-2 transition-colors"
      >
        ← Volver al catálogo
      </button>

      <ProductDetailView
        product={currentProduct}
        onAddToCart={handleAddToCart}
        onRelatedClick={handleRelatedClick}
      />
    </div>
  );
}