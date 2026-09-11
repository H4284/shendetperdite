"use client";

import { toast } from "sonner";
import { cartRequestItemSchema, type CartRequestItem } from "@/types/cart";
import { track } from "@/lib/analytics";
import { useCartStore } from "@/lib/cart/store";
import { cartSubtotal } from "@/lib/cart/selectors";
import { t } from "@/lib/i18n/sq";
import { formatEuroAmount } from "@/lib/cart/money";
import { writeCartToAccount } from "@/lib/cart/sync";

type ValidateResponse = {
  items: import("@/types/cart").CartItem[];
  clamped: { variantId: string; requested: number; qty: number }[];
};

type DiscountResponse =
  | { ok: true; discount: import("@/types/cart").AppliedDiscount }
  | { ok: false; error: string; minSubtotal?: number };

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as T;
  if (!response.ok) throw data;
  return data;
}

function requestItemsFromStore(): CartRequestItem[] {
  return useCartStore.getState().items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    qty: item.qty,
  }));
}

function toastClamped(clamped: ValidateResponse["clamped"]) {
  if (clamped.length > 0) toast.message(t("cart.clamped"));
}

async function refreshDiscount() {
  const { discountCode, items, clearDiscount, setDiscount } = useCartStore.getState();
  if (!discountCode) return;
  const subtotal = cartSubtotal(items);
  if (items.length === 0 || subtotal === 0) {
    clearDiscount();
    return;
  }
  try {
    const result = await postJson<DiscountResponse>("/api/cart/discount", {
      code: discountCode,
      subtotal,
    });
    if (result.ok) setDiscount(result.discount, result.discount.code);
    else {
      clearDiscount();
      toast.error(discountErrorMessage(result.error, result.minSubtotal));
    }
  } catch {
    clearDiscount();
  }
}

export function discountErrorMessage(error: string, minSubtotal?: number) {
  if (error === "expired") return t("cart.discountExpired");
  if (error === "min_subtotal") {
    return t("cart.discountMin", {
      amount: formatEuroAmount(minSubtotal ?? 0),
    });
  }
  if (error === "not_started" || error === "usage_limit") return t("cart.discountInvalid");
  return t("cart.discountInvalid");
}

export async function refreshCart() {
  const current = requestItemsFromStore();
  if (current.length === 0) return { items: [], clamped: [] };
  const result = await postJson<ValidateResponse>("/api/cart/validate", {
    items: current,
  });
  useCartStore.getState().replaceItems(result.items);
  toastClamped(result.clamped);
  await refreshDiscount();
  await writeCartToAccount();
  return result;
}

export async function addToCart(input: CartRequestItem) {
  const parsed = cartRequestItemSchema.parse(input);
  const existing = requestItemsFromStore();
  const merged = [...existing, parsed];
  const result = await postJson<ValidateResponse>("/api/cart/validate", {
    items: merged,
  });
  useCartStore.getState().replaceItems(result.items);
  useCartStore.getState().setDrawerOpen(true);
  toastClamped(result.clamped);
  const added = result.items.find((item) => item.variantId === parsed.variantId);
  if (!added) {
    toast.error(t("catalog.outOfStock"));
  } else if (!result.clamped.some((entry) => entry.variantId === parsed.variantId)) {
    toast.success(t("product.addedToCart"));
    track("add_to_cart", {
      value: added.price * added.qty,
      currency: "EUR",
      items: [
        {
          item_id: added.variantId,
          item_name: added.name,
          item_variant: added.variantLabel,
          price: added.price,
          quantity: added.qty,
        },
      ],
      content_ids: [added.variantId],
      num_items: added.qty,
    });
  }
  await refreshDiscount();
  await writeCartToAccount();
  return result;
}

export async function updateCartQty(variantId: string, qty: number) {
  const items = requestItemsFromStore().map((item) =>
    item.variantId === variantId ? { ...item, qty: Math.max(1, qty) } : item,
  );
  const result = await postJson<ValidateResponse>("/api/cart/validate", {
    items,
  });
  useCartStore.getState().replaceItems(result.items);
  toastClamped(result.clamped);
  await refreshDiscount();
  await writeCartToAccount();
  return result;
}

export async function applyCartDiscount(code: string): Promise<DiscountResponse> {
  const subtotal = cartSubtotal(useCartStore.getState().items);
  try {
    const result = await postJson<DiscountResponse>("/api/cart/discount", {
      code,
      subtotal,
    });
    if (!result.ok) {
      useCartStore.getState().clearDiscount();
      return result;
    }
    useCartStore.getState().setDiscount(result.discount, result.discount.code);
    await writeCartToAccount();
    return result;
  } catch (error) {
    useCartStore.getState().clearDiscount();
    if (error && typeof error === "object" && "ok" in error) {
      return error as DiscountResponse;
    }
    return { ok: false as const, error: "invalid" };
  }
}

export async function restoreRemovedItem() {
  useCartStore.getState().restoreRemoved();
  await refreshCart();
}
