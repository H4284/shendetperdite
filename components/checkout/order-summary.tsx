"use client";

import { formatEuroAmount } from "@/lib/cart/money";
import {
  cartSubtotal,
  discountAmount,
  freeShippingRemaining,
} from "@/lib/cart/selectors";
import { shippingCostFor } from "@/lib/checkout/totals";
import { Button } from "@/components/ui/button";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { t } from "@/lib/i18n/sq";
import type { AppliedDiscount, CartItem } from "@/types/cart";
import type { ShippingMethod } from "@/types/checkout";

export function OrderSummary({
  items,
  discount,
  shippingMethod,
  submitting,
}: {
  items: CartItem[];
  discount: AppliedDiscount | null;
  shippingMethod: ShippingMethod | null;
  submitting?: boolean;
}) {
  const subtotal = cartSubtotal(items);
  const discountValue = discountAmount(subtotal, discount);
  const shipping = shippingMethod
    ? shippingCostFor(subtotal, shippingMethod, discount)
    : 0;
  const total = Math.max(0, subtotal - discountValue + shipping);
  const remaining = freeShippingRemaining(
    subtotal,
    shippingMethod?.freeFrom ?? Number.POSITIVE_INFINITY,
  );
  const shippingLabel =
    shipping === 0 ? t("checkout.shippingFree") : formatEuroAmount(shipping);

  return (
    <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold">{t("checkout.summary")}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.variantId} className="flex gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image ? (
                <CatalogImage src={item.image} alt={item.name} fill sizes="56px" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              {item.variantLabel ? (
                <p className="truncate text-sm text-muted-foreground">{item.variantLabel}</p>
              ) : null}
              <p className="text-sm">
                {t("checkout.line", {
                  qty: item.qty,
                  price: formatEuroAmount(item.price),
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t pt-3 text-sm">
        <div className="flex justify-between">
          <dt>{t("cart.subtotal")}</dt>
          <dd>{formatEuroAmount(subtotal)}</dd>
        </div>
        {discountValue > 0 ? (
          <div className="flex justify-between">
            <dt>{t("checkout.discount")}</dt>
            <dd>−{formatEuroAmount(discountValue)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt>{t("checkout.shippingCost")}</dt>
          <dd>{shippingLabel}</dd>
        </div>
        {remaining > 0 && shipping > 0 ? (
          <p className="text-muted-foreground">
            {t("checkout.remaining", { amount: formatEuroAmount(remaining) })}
          </p>
        ) : null}
        <div className="flex justify-between text-base font-semibold">
          <dt>{t("checkout.total")}</dt>
          <dd>{formatEuroAmount(total)}</dd>
        </div>
      </dl>
      <Button type="submit" size="lg" className="h-11 w-full" disabled={submitting}>
        {submitting ? t("checkout.submitting") : t("checkout.submit")}
      </Button>
    </aside>
  );
}
