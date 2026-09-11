"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ProductViewTracker({
  id,
  name,
  brand,
  price,
}: {
  id: string;
  name: string;
  brand?: string;
  price: number;
}) {
  useEffect(() => {
    track("view_item", {
      currency: "EUR",
      value: price,
      items: [{ item_id: id, item_name: name, item_brand: brand, price, quantity: 1 }],
      content_ids: [id],
      content_name: name,
    });
  }, [id, name, brand, price]);

  return null;
}
