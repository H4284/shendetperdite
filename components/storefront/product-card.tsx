import Link from "next/link";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Price } from "@/components/storefront/price";
import { SaleBadge } from "@/components/storefront/sale-badge";
import { StockBadge } from "@/components/storefront/stock-badge";
import { cn } from "cn";
import { variantLabel } from "@/lib/format";
import { t } from "@/lib/i18n/sq";
import type { Product } from "@/types/catalog";

export function ProductCard({
  product,
  brandName,
}: {
  product: Product;
  brandName: string;
}) {
  const inStock = product.totalStock > 0;
  const primary = product.images[0];
  const hover = product.images[1] ?? product.images[0];
  const optionHint = product.options
    .map((option) => option.values[0])
    .filter(Boolean);
  const label =
    optionHint.length > 0
      ? variantLabel(
          Object.fromEntries(
            product.options.map((option) => [option.name, option.values[0]]),
          ),
        )
      : null;

  return (
    <article className={cn("group", !inStock && "opacity-95")}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          {primary ? (
            <>
              <CatalogImage
                src={primary.url}
                alt={primary.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={cn(
                  "transition-opacity duration-300 group-hover:opacity-0",
                  !inStock && "opacity-50 grayscale",
                )}
              />
              {hover ? (
                <CatalogImage
                  src={hover.url}
                  alt={hover.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={cn(
                    "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    !inStock && "grayscale group-hover:opacity-50",
                  )}
                />
              ) : null}
            </>
          ) : null}
          {!inStock ? (
            <div
              className="pointer-events-none absolute inset-0 bg-background/25"
              aria-hidden
            />
          ) : null}
          <div className="absolute top-2 left-2 z-10">
            <StockBadge inStock={inStock} />
          </div>
          <div className="absolute top-2 right-2 z-10">
            <SaleBadge
              price={product.minPrice}
              compareAtPrice={product.compareAtPrice}
            />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {brandName}
          </p>
          <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:underline">
            {product.name}
          </h3>
          {label ? (
            <p className="text-xs text-muted-foreground">{label}</p>
          ) : null}
          <Price
            price={product.minPrice}
            compareAtPrice={product.compareAtPrice}
            showVat
          />
        </div>
      </Link>
      {inStock && product.defaultVariantId ? (
        <AddToCartButton
          productId={product.id}
          variantId={product.defaultVariantId}
          size="sm"
          className="mt-3 w-full"
        />
      ) : !inStock ? (
        <div
          className="mt-3 flex h-8 w-full items-center justify-center rounded-lg border border-dashed text-xs font-medium text-muted-foreground"
          aria-disabled
        >
          {t("catalog.outOfStock")}
        </div>
      ) : null}
    </article>
  );
}
