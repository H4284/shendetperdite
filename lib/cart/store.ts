"use client";

import { create } from "zustand";

/** Stub cart store. Real cart behavior is EPIC 4. */
type CartState = {
  itemCount: number;
};

export const useCartStore = create<CartState>()(() => ({
  itemCount: 0,
}));
