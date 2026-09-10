import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogListing } from "@/components/storefront/catalog-listing";
import {
  fetchActiveCategorySlugs,
  getBrands,
  getCategoryBySlug,
  getCategoryTree,
  listProducts,
} from "@/lib/catalog";
import { categoryMap, categoryPath } from "@/lib/catalog/tree";
import type { ListProductsResult } from "@/types/catalog";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await fetchActiveCategorySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: slug };
    return {
      title: category.seo.title,
      description: category.seo.description,
    };
  } catch {
    return { title: slug };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const [category, tree, brands] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryTree(),
    getBrands(),
  ]);

  if (!category) notFound();

  let listing: ListProductsResult = { items: [], page, pageSize: 8, total: 0 };
  try {
    listing = await listProducts({
      categoryId: category.id,
      page,
      pageSize: 8,
    });
  } catch (error) {
    console.error("Failed to list category products", error);
  }
  const path = categoryPath(tree, category);
  const byId = categoryMap(tree);
  const node = byId.get(category.id);
  const parent = category.parentId ? byId.get(category.parentId) : undefined;
  const chipsSource =
    node && node.children.length > 0 ? node.children : (parent?.children ?? []);

  return (
    <CatalogListing
      title={category.name}
      description={category.description}
      crumbs={path.map((entry) => ({
        name: entry.name,
        href: `/categories/${entry.slug}`,
      }))}
      chips={chipsSource.map((chip) => ({
        name: chip.name,
        href: `/categories/${chip.slug}`,
        active: chip.slug === category.slug,
      }))}
      products={listing.items}
      brandNames={Object.fromEntries(brands.map((brand) => [brand.id, brand.name]))}
      page={listing.page}
      pageSize={listing.pageSize}
      total={listing.total}
      basePath={`/categories/${category.slug}`}
    />
  );
}
