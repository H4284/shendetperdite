"use client";

import { readAnalyticsConsent } from "@/lib/analytics/consent";

export type AnalyticsItem = {
  item_id?: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

type TrackPayload = {
  currency?: string;
  value?: number;
  items?: AnalyticsItem[];
  transaction_id?: string;
  search_term?: string;
  shipping_tier?: string;
  payment_type?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  num_items?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const META_MAP: Partial<Record<string, string>> = {
  page_view: "PageView",
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  search: "Search",
};

export function track(event: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  if (!readAnalyticsConsent()) return;

  const currency = payload.currency ?? "EUR";

  window.gtag?.("event", event, {
    currency,
    value: payload.value,
    items: payload.items,
    transaction_id: payload.transaction_id,
    search_term: payload.search_term,
    shipping_tier: payload.shipping_tier,
    payment_type: payload.payment_type,
  });

  const metaEvent = META_MAP[event];
  if (metaEvent && window.fbq) {
    const metaPayload: Record<string, unknown> = {
      currency,
      value: payload.value,
      content_ids: payload.content_ids ?? payload.items?.map((item) => item.item_id).filter(Boolean),
      content_name: payload.content_name ?? payload.items?.[0]?.item_name,
      content_type: payload.content_type ?? "product",
      num_items: payload.num_items ?? payload.items?.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
      search_string: payload.search_term,
    };
    window.fbq("track", metaEvent, metaPayload);
  }
}

export function trackPurchase(input: {
  orderNumber: string;
  total: number;
  items: { name: string; qty: number; price: number; id?: string }[];
}) {
  track("purchase", {
    transaction_id: input.orderNumber,
    value: input.total,
    currency: "EUR",
    items: input.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.qty,
    })),
    content_ids: input.items.map((item) => item.id).filter(Boolean) as string[],
    num_items: input.items.reduce((sum, item) => sum + item.qty, 0),
  });
}
