import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const newItems = existing
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            : [...state.items, item];
          
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total };
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return { items: newItems, total };
        }),
      clearCart: () => set({ items: [], total: 0 }),
      getTotal: () => get().total,
    }),
    {
      name: 'cart-storage',
    }
  )
);