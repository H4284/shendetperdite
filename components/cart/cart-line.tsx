"use client";

import Link from "next/link";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Price } from "@/components/storefront/price";
import { CartStepper } from "@/components/cart/cart-stepper";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types/cart";
import { t } from "@/lib/i18n/sq";

export function CartLine({
  item,
  busy,
  onQty,
  onRemove,
}: {
  item: CartItem;
  busy?: boolean;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <article className="flex gap-3 border-b py-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {item.image ? (
          <CatalogImage src={item.image} alt={item.name} fill sizes="80px" />
        ) : null}
      </Link>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/products/${item.slug}`} className="font-semibold leading-snug hover:underline">
              {item.name}
            </Link>
            {item.variantLabel ? (
              <p className="text-sm text-muted-foreground">{item.variantLabel}</p>
            ) : null}
          </div>
          <Price
            price={item.price}
            compareAtPrice={item.compareAtPrice}
            className="shrink-0 justify-end text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CartStepper value={item.qty} max={item.maxQty} disabled={busy} onChange={onQty} />
          <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={onRemove}>
            {t("cart.remove")}
          </Button>
        </div>
      </div>
    </article>
  );
}
