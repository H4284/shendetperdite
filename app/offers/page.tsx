import type { Metadata } from "next";
import { CatalogListing } from "@/components/storefront/catalog-listing";
import { getBrands, listSaleProducts } from "@/lib/catalog";
import { t } from "@/lib/i18n/sq";
import { absoluteUrl } from "@/lib/seo/site-url";
import type { ListProductsResult } from "@/types/catalog";

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const title = t("offers.title");
  const description = t("offers.description");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/offers") },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/offers"),
    },
  };
}

export default async function OffersPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);

  let listing: ListProductsResult = { items: [], page, pageSize: 12, total: 0 };
  let brandNames: Record<string, string> = {};

  try {
    const [saleListing, brands] = await Promise.all([
      listSaleProducts({ page, pageSize: 12 }),
      getBrands(),
    ]);
    listing = saleListing;
    brandNames = Object.fromEntries(brands.map((brand) => [brand.id, brand.name]));
  } catch (error) {
    console.error("Failed to list sale products", error);
  }

  return (
    <CatalogListing
      title={t("offers.title")}
      description={t("offers.description")}
      crumbs={[
        { name: t("catalog.home"), href: "/" },
        { name: t("offers.nav"), href: "/offers" },
      ]}
      products={listing.items}
      brandNames={brandNames}
      page={listing.page}
      pageSize={listing.pageSize}
      total={listing.total}
      basePath="/offers"
    />
  );
}
