/** CartPage - Carrito de compras con items, cantidades y total. */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores';
import { Button, Card, CardContent, EmptyState, AnimatedMount } from '../components/ui';

/* ---------- SVG Icons ---------- */

const CartIcon = () => (
  <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

/* ---------- Cart Item Row ---------- */

interface CartItemRowProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const subtotal = item.price * item.quantity;

  return (
    <AnimatedMount variant="slide-up">
      <div className="flex items-center gap-4 py-4 border-b border-slate-700/50 last:border-b-0">
        {/* Image placeholder */}
        <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
          <p className="text-sm text-amber-400 font-medium mt-0.5">${item.price.toFixed(2)}</p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center border border-slate-600 rounded-lg">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
            aria-label="Disminuir cantidad"
          >
            <MinusIcon />
          </button>
          <span className="px-3 py-1.5 text-sm text-slate-100 font-medium min-w-[2rem] text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= 99}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
            aria-label="Aumentar cantidad"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Subtotal */}
        <p className="text-sm font-semibold text-slate-100 w-20 text-right tabular-nums">
          ${subtotal.toFixed(2)}
        </p>

        {/* Remove */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          aria-label={`Eliminar ${item.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </AnimatedMount>
  );
}

/* ---------- Page Component ---------- */

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = getTotal();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout - in a real app this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clearCart();
    setIsCheckingOut(false);
  };

  /* ---------- Empty State ---------- */
  if (items.length === 0) {
    return (
      <div className="p-6">
        <AnimatedMount variant="fade-in">
          <EmptyState
            icon={<CartIcon />}
            title="Tu carrito está vacío"
            description="Agregá productos desde el catálogo para empezar tu pedido"
            action={{
              label: 'Ver Catálogo',
              onClick: () => window.location.href = '/catalogo',
            }}
          />
        </AnimatedMount>
      </div>
    );
  }

  /* ---------- Cart Items ---------- */
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-100">
          Carrito de Compras
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-900/20"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="lg:col-span-2">
          <Card variant="bordered">
            <CardContent className="p-4 sm:p-6">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Resumen del pedido</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Productos ({items.length})</span>
                    <span className="text-slate-300">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Envío</span>
                    <span className="text-emerald-400">Gratis</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between text-base font-semibold">
                    <span className="text-slate-100">Total</span>
                    <span className="text-amber-400 tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                  className="w-full mt-6"
                >
                  {isCheckingOut ? 'Procesando...' : 'Confirmar pedido'}
                </Button>

                <Link
                  to="/catalogo"
                  className="block text-center text-sm text-slate-500 hover:text-amber-400 transition-colors mt-4"
                >
                  Seguir comprando
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
