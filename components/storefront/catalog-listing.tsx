import Link from "next/link";
import { cn } from "cn";
import { Breadcrumbs, type Crumb } from "@/components/storefront/breadcrumbs";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { Pagination } from "@/components/storefront/pagination";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { Product } from "@/types/catalog";

export function CatalogListing({
  title,
  description,
  crumbs,
  chips,
  products,
  brandNames,
  page,
  pageSize,
  total,
  basePath,
  image,
}: {
  title: string;
  description?: string;
  crumbs: Crumb[];
  chips?: { name: string; href: string; active?: boolean }[];
  products: Product[];
  brandNames: Record<string, string>;
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  image?: string | null;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <Breadcrumbs items={crumbs} />
      {image ? (
        <div className="relative h-40 overflow-hidden rounded-2xl md:h-56">
          <CatalogImage
            src={image}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {chips && chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                chip.active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {chip.name}
            </Link>
          ))}
        </div>
      ) : null}
      <ProductGrid products={products} brandNames={brandNames} />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath={basePath}
      />
    </div>
  );
}
