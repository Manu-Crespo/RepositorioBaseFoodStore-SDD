import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

interface PaymentState {
  status: PaymentStatus;
  orderId: string | null;
  error: string | null;
}

interface PaymentActions {
  setPending: () => void;
  setSuccess: (orderId: string) => void;
  setFailed: (error: string) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState & PaymentActions>()(
  persist(
    (set) => ({
      status: 'idle',
      orderId: null,
      error: null,
      setPending: () => set({ status: 'pending', error: null }),
      setSuccess: (orderId) => set({ status: 'success', orderId, error: null }),
      setFailed: (error) => set({ status: 'failed', error }),
      reset: () => set({ status: 'idle', orderId: null, error: null }),
    }),
    {
      name: 'payment-storage',
    }
  )
);