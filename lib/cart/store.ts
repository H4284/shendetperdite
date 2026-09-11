"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppliedDiscount, CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  discountCode?: string;
  discount: AppliedDiscount | null;
  drawerOpen: boolean;
  lastRemoved: CartItem | null;
  replaceItems: (items: CartItem[]) => void;
  setDiscount: (discount: AppliedDiscount | null, code?: string) => void;
  clearDiscount: () => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  removeLocal: (variantId: string) => CartItem | null;
  restoreRemoved: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: undefined,
      discount: null,
      drawerOpen: false,
      lastRemoved: null,
      replaceItems: (items) => set({ items }),
      setDiscount: (discount, code) =>
        set({
          discount,
          discountCode: discount ? (code ?? discount.code) : undefined,
        }),
      clearDiscount: () => set({ discount: null, discountCode: undefined }),
      clearCart: () =>
        set({
          items: [],
          discount: null,
          discountCode: undefined,
          lastRemoved: null,
        }),
      setDrawerOpen: (open) => set({ drawerOpen: open }),
      removeLocal: (variantId) => {
        const item = get().items.find((entry) => entry.variantId === variantId) ?? null;
        set({
          items: get().items.filter((entry) => entry.variantId !== variantId),
          lastRemoved: item,
        });
        return item;
      },
      restoreRemoved: () => {
        const item = get().lastRemoved;
        if (!item) return;
        const exists = get().items.some((entry) => entry.variantId === item.variantId);
        set({
          items: exists ? get().items : [...get().items, item],
          lastRemoved: null,
        });
      },
    }),
    {
      name: "cart_v1",
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discount: state.discount,
      }),
    },
  ),
);
