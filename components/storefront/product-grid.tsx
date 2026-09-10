import { ProductCard } from "@/components/storefront/product-card";
import { t } from "@/lib/i18n/sq";
import type { Product } from "@/types/catalog";

export function ProductGrid({
  products,
  brandNames,
}: {
  products: Product[];
  brandNames: Record<string, string>;
}) {
  if (products.length === 0) {
    return <p className="text-muted-foreground">{t("catalog.empty")}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          brandName={brandNames[product.brandId] ?? ""}
        />
      ))}
    </div>
  );
}
