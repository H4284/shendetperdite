"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CartStepper } from "@/components/cart/cart-stepper";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { Price } from "@/components/storefront/price";
import { ProductStickyCta } from "@/components/storefront/product-sticky-cta";
import { StockStatus } from "@/components/storefront/stock-badge";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { useStoreSettings } from "@/components/store-settings-provider";
import { siteConfig } from "@/config/site";
import { formatPrice, formatUnitPrice, variantLabel } from "@/lib/format";
import { t } from "@/lib/i18n/sq";
import type { ProductWithVariants } from "@/types/catalog";

function findVariant(
  product: ProductWithVariants,
  sku: string | null,
) {
  return (
    product.variants.find((variant) => variant.sku === sku) ??
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0]
  );
}

export function ProductDetails({
  product,
  brandName,
  initialSku,
}: {
  product: ProductWithVariants;
  brandName: string;
  initialSku: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const atcRef = useRef<HTMLDivElement>(null);
  const [sku, setSku] = useState(
    findVariant(product, initialSku)?.sku ?? null,
  );
  const variant = findVariant(product, sku);
  const { freeShippingFrom } = useStoreSettings();
  const [selected, setSelected] = useState<Record<string, string>>(
    variant?.optionValues ?? {},
  );
  const [qty, setQty] = useState(1);
  const maxQty = Math.max(1, variant?.stockQty ?? 1);

  const titleLabel = useMemo(() => {
    if (!variant) return product.name;
    const label = variantLabel(variant.optionValues);
    return label ? `${product.name} - ${label}` : product.name;
  }, [product.name, variant]);

  useEffect(() => {
    document.title = `${titleLabel} | ${siteConfig.name}`;
  }, [titleLabel]);

  useEffect(() => {
    setQty(1);
  }, [variant?.id]);

  function setVariantSku(nextSku: string, nextSelected: Record<string, string>) {
    setSku(nextSku);
    setSelected(nextSelected);
    router.replace(`${pathname}?variant=${encodeURIComponent(nextSku)}`, {
      scroll: false,
    });
  }

  function onSelect(optionName: string, value: string) {
    const next = { ...selected, [optionName]: value };
    const match = product.variants.find((entry) =>
      Object.entries(next).every(
        ([name, trialValue]) => entry.optionValues[name] === trialValue,
      ),
    );
    if (!match) return;
    setVariantSku(match.sku, next);
  }

  function onQtyChange(next: number) {
    if (!Number.isFinite(next)) return;
    setQty(Math.min(maxQty, Math.max(1, Math.floor(next))));
  }

  const galleryImages = product.images.slice().sort((a, b) => a.order - b.order);
  if (variant?.image && !galleryImages.some((image) => image.url === variant.image)) {
    galleryImages.unshift({
      url: variant.image,
      alt: product.name,
      order: -1,
    });
  }

  const compareAt = variant
    ? (variant.compareAtPrice ?? product.compareAtPrice)
    : null;
  const atcDisabled = !variant || variant.stockQty <= 0;

  return (
    <div className="grid gap-8 pb-24 md:pb-0 lg:grid-cols-2">
      <ProductGallery
        images={galleryImages}
        selectedUrl={variant?.image}
      />
      <div className="space-y-5">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {brandName}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{titleLabel}</h1>
        <p className="text-muted-foreground">{product.shortDescription}</p>
        {variant ? (
          <Price
            price={variant.price}
            compareAtPrice={compareAt}
            className="text-xl"
            showDiscountBadge
            showVat
          />
        ) : null}
        {product.unit ? (
          <p className="text-sm text-muted-foreground">
            {formatUnitPrice(product.unit.amount, product.unit.unit)}
          </p>
        ) : null}
        <StockStatus inStock={(variant?.stockQty ?? 0) > 0} />
        {variant?.sku ? (
          <p className="text-xs text-muted-foreground">
            {t("product.sku", { sku: variant.sku })}
          </p>
        ) : null}
        <VariantSelector
          options={product.options}
          variants={product.variants}
          selected={selected}
          onSelect={onSelect}
        />
        <div ref={atcRef} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <CartStepper
            value={qty}
            max={maxQty}
            disabled={atcDisabled}
            onChange={onQtyChange}
          />
          <AddToCartButton
            productId={product.id}
            variantId={variant?.id}
            qty={qty}
            disabled={atcDisabled}
            className="h-11 w-full sm:w-auto"
          />
        </div>
        <aside className="rounded-2xl border p-4 text-sm">
          <p className="font-semibold tracking-tight">{t("product.trustTitle")}</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{t("product.trustDelivery")}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <Link
                href="/returns"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("product.trustReturns")}
              </Link>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{t("product.trustPayment")}</span>
            </li>
          </ul>
        </aside>
        <aside className="rounded-2xl border bg-primary/5 p-4 text-sm">
          <p className="font-semibold">{t("product.shippingTitle")}</p>
          <p className="mt-2">
            {t("product.freeShipping", {
              amount: formatPrice(freeShippingFrom),
            })}
          </p>
          <p className="mt-1 text-muted-foreground">{t("product.delivery")}</p>
        </aside>
      </div>
      {variant ? (
        <ProductStickyCta
          price={variant.price}
          compareAtPrice={compareAt}
          productId={product.id}
          variantId={variant.id}
          qty={qty}
          disabled={atcDisabled}
          observeRef={atcRef}
        />
      ) : null}
    </div>
  );
}
