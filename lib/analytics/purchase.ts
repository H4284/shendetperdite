"use client";

type PurchasePayload = {
  orderNumber: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
};

export function trackPurchase(payload: PurchasePayload) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "purchase", {
    transaction_id: payload.orderNumber,
    value: payload.total,
    currency: "EUR",
    items: payload.items.map((item) => ({
      item_name: item.name,
      quantity: item.qty,
      price: item.price,
    })),
  });

  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("track", "Purchase", {
    value: payload.total,
    currency: "EUR",
  });
}
