"use client";

import { create } from "zustand";

/** Stub cart store. Real cart behavior is EPIC 4. */
export type CartAddItemInput = {
  productId: string;
  variantId: string;
  sku: string;
  qty?: number;
};

type CartState = {
  itemCount: number;
  addItem: (item: CartAddItemInput) => void;
};

export const useCartStore = create<CartState>()((set) => ({
  itemCount: 0,
  addItem: (item) =>
    set((state) => ({
      itemCount: state.itemCount + Math.max(1, item.qty ?? 1),
    })),
}));
