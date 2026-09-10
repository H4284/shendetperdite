import Link from "next/link";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Price } from "@/components/storefront/price";
import { StockBadge } from "@/components/storefront/stock-badge";
import { variantLabel } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductCard({
  product,
  brandName,
}: {
  product: Product;
  brandName: string;
}) {
  const primary = product.images[0];
  const hover = product.images[1] ?? product.images[0];
  const optionHint = product.options
    .map((option) => option.values[0])
    .filter(Boolean);
  const label = optionHint.length > 0 ? variantLabel(
    Object.fromEntries(product.options.map((option) => [option.name, option.values[0]])),
  ) : null;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {primary ? (
            <>
              <CatalogImage
                src={primary.url}
                alt={primary.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="transition-opacity duration-300 group-hover:opacity-0"
              />
              {hover ? (
                <CatalogImage
                  src={hover.url}
                  alt={hover.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : null}
          <div className="absolute top-2 left-2">
            <StockBadge inStock={product.totalStock > 0} />
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
          />
        </div>
      </Link>
    </article>
  );
}
