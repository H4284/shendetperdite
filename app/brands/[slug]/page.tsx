import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogListing } from "@/components/storefront/catalog-listing";
import {
  fetchActiveBrandSlugs,
  getBrandBySlug,
  getBrands,
  listProducts,
} from "@/lib/catalog";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await fetchActiveBrandSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: slug };
  return {
    title: brand.seo.title,
    description: brand.seo.description,
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const [brand, brands] = await Promise.all([getBrandBySlug(slug), getBrands()]);

  if (!brand) notFound();

  const listing = await listProducts({
    brandId: brand.id,
    page,
    pageSize: 8,
  });

  return (
    <CatalogListing
      title={brand.name}
      description={brand.description}
      crumbs={[{ name: brand.name, href: `/brands/${brand.slug}` }]}
      products={listing.items}
      brandNames={Object.fromEntries(brands.map((entry) => [entry.id, entry.name]))}
      page={listing.page}
      pageSize={listing.pageSize}
      total={listing.total}
      basePath={`/brands/${brand.slug}`}
    />
  );
}
