"use client";

import { useCartStore } from "@/lib/cart/store";
import { writeCartToAccount } from "@/lib/cart/sync";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { CheckoutInput } from "@/lib/checkout/schema";
import type { CartItem } from "@/types/cart";

type OrderSuccess = {
  id: string;
  orderNumber: string;
  total: number;
  token: string;
};

export class OutOfStockClientError extends Error {
  sku: string;
  constructor(sku: string) {
    super("out_of_stock");
    this.sku = sku;
  }
}

export async function placeOrder(checkout: CheckoutInput): Promise<OrderSuccess> {
  const { items, discountCode, clearCart, replaceItems } = useCartStore.getState();
  const { auth } = getFirebaseClient();
  const token = await auth.currentUser?.getIdToken().catch(() => null);

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      checkout,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        qty: item.qty,
      })),
      discountCode,
    }),
  });

  const data = (await response.json()) as OrderSuccess & {
    error?: string;
    sku?: string;
    items?: CartItem[];
  };

  if (response.status === 409 && data.error === "out_of_stock") {
    if (Array.isArray(data.items)) replaceItems(data.items);
    throw new OutOfStockClientError(data.sku ?? "UNKNOWN");
  }
  if (!response.ok) {
    throw new Error(data.error ?? "order_failed");
  }

  clearCart();
  await writeCartToAccount();
  return data;
}
