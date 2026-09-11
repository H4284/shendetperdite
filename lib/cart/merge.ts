import type { CartItem } from "@/types/cart";

export function mergeCartItems(base: CartItem[], incoming: CartItem[]) {
  const byVariant = new Map<string, CartItem>();

  for (const item of [...base, ...incoming]) {
    const existing = byVariant.get(item.variantId);
    if (!existing) {
      byVariant.set(item.variantId, { ...item });
      continue;
    }
    byVariant.set(item.variantId, {
      ...existing,
      ...item,
      qty: existing.qty + item.qty,
    });
  }

  return [...byVariant.values()];
}

export function setLineQty(items: CartItem[], variantId: string, qty: number) {
  if (qty <= 0) return items.filter((item) => item.variantId !== variantId);
  return items.map((item) =>
    item.variantId === variantId ? { ...item, qty } : item,
  );
}

export function removeLine(items: CartItem[], variantId: string) {
  return items.filter((item) => item.variantId !== variantId);
}
