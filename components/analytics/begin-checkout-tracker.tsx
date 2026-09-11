"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import type { CartItem } from "@/types/cart";

export function BeginCheckoutTracker({
  items,
  value,
}: {
  items: CartItem[];
  value: number;
}) {
  useEffect(() => {
    if (items.length === 0) return;
    track("begin_checkout", {
      currency: "EUR",
      value,
      items: items.map((item) => ({
        item_id: item.variantId,
        item_name: item.name,
        item_variant: item.variantLabel,
        price: item.price,
        quantity: item.qty,
      })),
      content_ids: items.map((item) => item.variantId),
      num_items: items.reduce((sum, item) => sum + item.qty, 0),
    });
  }, [items, value]);

  return null;
}
