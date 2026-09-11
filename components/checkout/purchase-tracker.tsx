"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/analytics/purchase";

export function PurchaseTracker({
  orderNumber,
  total,
  items,
}: {
  orderNumber: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackPurchase({ orderNumber, total, items });
  }, [orderNumber, total, items]);

  return null;
}
