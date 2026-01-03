'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItemWithProduct } from '@/types';

interface CartState {
  items: CartItemWithProduct[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: CartItemWithProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      addItem: (item: CartItemWithProduct) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.product.id === item.product.id
          );
          
          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map((i) =>
                i.product.id === item.product.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          // Add new item
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
