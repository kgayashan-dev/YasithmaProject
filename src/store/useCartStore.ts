'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProductItem {
  productId: string;
  name: string;
  slug: string;
  netWeight: string;
  priceLkr: number;
  imageUrl: string;
  stockQuantity: number;
  quantity: number;
}

interface CartState {
  items: CartProductItem[];
  wishlistIds: string[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartProductItem, 'quantity'>, qty?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  getSubtotal: () => number;
  getTotalCount: () => number;
}

// Create a Zustand store for managing the shopping cart state
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlistIds: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }), // Open the shopping cart drawer
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (incoming, qty = 1) => {
        const current = get().items;
        const existingIndex = current.findIndex((i) => i.productId === incoming.productId);

        if (existingIndex > -1) {
          const updated = [...current];
          const newQty = Math.min(updated[existingIndex].quantity + qty, incoming.stockQuantity);
          updated[existingIndex].quantity = newQty;
          set({ items: updated, isDrawerOpen: true });
        } else {
          set({
            items: [...current, { ...incoming, quantity: Math.min(qty, incoming.stockQuantity) }],
            isDrawerOpen: true,
          });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
              : item
          ),
        });
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      clearCart: () => set({ items: [] }),

      toggleWishlist: (productId) => {
        const current = get().wishlistIds;
        set({
          wishlistIds: current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        });
      },

      getSubtotal: () =>
        get().items.reduce((acc, item) => acc + item.priceLkr * item.quantity, 0),

      getTotalCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'yasithma-cart-storage',
      partialize: (state) => ({
        items: state.items,
        wishlistIds: state.wishlistIds,
      }),
    }
  )
);
