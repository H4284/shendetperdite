import type { Metadata } from "next";
import { ProductGrid } from "@/components/storefront/product-grid";
import { getBrands, searchProducts } from "@/lib/catalog";
import { t } from "@/lib/i18n/sq";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `${t("search.title")}: ${q}` : t("search.title"),
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  let products: Awaited<ReturnType<typeof searchProducts>> = [];
  let brands: Awaited<ReturnType<typeof getBrands>> = [];
  try {
    [products, brands] = await Promise.all([
      q ? searchProducts(q) : Promise.resolve([]),
      getBrands(),
    ]);
  } catch (error) {
    console.error("Failed to search products", error);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("search.title")}</h1>
      {q ? (
        <p className="text-muted-foreground">“{q}”</p>
      ) : (
        <p className="text-muted-foreground">{t("search.hint")}</p>
      )}
      {q && products.length === 0 ? (
        <p className="text-muted-foreground">{t("search.empty")}</p>
      ) : (
        <ProductGrid
          products={products}
          brandNames={Object.fromEntries(brands.map((brand) => [brand.id, brand.name]))}
        />
      )}
    </div>
  );
}
