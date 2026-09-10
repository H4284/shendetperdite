"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { Price } from "@/components/storefront/price";
import { StockStatus } from "@/components/storefront/stock-badge";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/lib/cart/store";
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
  const addItem = useCartStore((state) => state.addItem);
  const [sku, setSku] = useState(
    findVariant(product, initialSku)?.sku ?? null,
  );
  const variant = findVariant(product, sku);
  const [selected, setSelected] = useState<Record<string, string>>(
    variant?.optionValues ?? {},
  );

  const titleLabel = useMemo(() => {
    if (!variant) return product.name;
    const label = variantLabel(variant.optionValues);
    return label ? `${product.name} - ${label}` : product.name;
  }, [product.name, variant]);

  useEffect(() => {
    document.title = `${titleLabel} | ${siteConfig.name}`;
  }, [titleLabel]);

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

  function onAddToCart() {
    if (!variant || variant.stockQty <= 0) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
    });
    toast.success(t("product.addedToCart"));
  }

  const galleryImages = product.images.slice().sort((a, b) => a.order - b.order);
  if (variant?.image && !galleryImages.some((image) => image.url === variant.image)) {
    galleryImages.unshift({
      url: variant.image,
      alt: product.name,
      order: -1,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
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
            compareAtPrice={variant.compareAtPrice ?? product.compareAtPrice}
            className="text-xl"
          />
        ) : null}
        {product.unit ? (
          <p className="text-sm text-muted-foreground">
            {formatUnitPrice(product.unit.amount, product.unit.unit)}
          </p>
        ) : null}
        <StockStatus inStock={(variant?.stockQty ?? 0) > 0} />
        <VariantSelector
          options={product.options}
          variants={product.variants}
          selected={selected}
          onSelect={onSelect}
        />
        <Button
          size="lg"
          className="h-11 w-full sm:w-auto"
          disabled={!variant || variant.stockQty <= 0}
          onClick={onAddToCart}
        >
          {t("product.addToCart")}
        </Button>
        <aside className="rounded-xl border bg-muted/40 p-4 text-sm">
          <p className="font-semibold">{t("product.shippingTitle")}</p>
          <p className="mt-2">
            {t("product.freeShipping", {
              amount: formatPrice(siteConfig.freeShippingFrom),
            })}
          </p>
          <p className="mt-1 text-muted-foreground">{t("product.delivery")}</p>
        </aside>
      </div>
    </div>
  );
}
