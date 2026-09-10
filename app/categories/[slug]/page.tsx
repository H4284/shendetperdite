import { notFound } from "next/navigation";
import type { Metadata } from "next";
import liveMedia from "@/content/live-media.json";
import { CatalogListing } from "@/components/storefront/catalog-listing";
import { findNavBySlug, findNavParentSlug, siteConfig } from "@/config/site";
import {
  fetchActiveCategorySlugs,
  getBrands,
  getCategoryBySlug,
  getCategoryTree,
  listProducts,
} from "@/lib/catalog";
import { categoryMap, categoryPath } from "@/lib/catalog/tree";
import type { Category, ListProductsResult } from "@/types/catalog";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function categoryFromNav(slug: string): Category | null {
  const nav = findNavBySlug(slug);
  if (!nav) return null;
  const parentId = findNavParentSlug(slug);
  const image =
    liveMedia.categories[slug as keyof typeof liveMedia.categories] ??
    (parentId
      ? liveMedia.categories[parentId as keyof typeof liveMedia.categories]
      : undefined) ??
    null;
  return {
    id: parentId ?? slug,
    name: nav.name,
    slug,
    description: "",
    image,
    parentId,
    order: 0,
    isActive: true,
    seo: { title: nav.name, description: nav.name },
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await fetchActiveCategorySlugs();
    const navSlugs = siteConfig.nav.flatMap((item) => [
      item.slug,
      ...item.children.map((child) => child.slug),
    ]);
    return [...new Set([...slugs, ...navSlugs])].map((slug) => ({ slug }));
  } catch {
    return siteConfig.nav.flatMap((item) => [
      { slug: item.slug },
      ...item.children.map((child) => ({ slug: child.slug })),
    ]);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = (await getCategoryBySlug(slug)) ?? categoryFromNav(slug);
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
  const [stored, tree, brands] = await Promise.all([
    getCategoryBySlug(slug),
    getCategoryTree(),
    getBrands(),
  ]);
  const category = stored ?? categoryFromNav(slug);

  if (!category) notFound();

  const listingId = stored?.id ?? category.id;
  let listing: ListProductsResult = { items: [], page, pageSize: 8, total: 0 };
  try {
    listing = await listProducts({
      categoryId: listingId,
      page,
      pageSize: 8,
    });
  } catch (error) {
    console.error("Failed to list category products", error);
  }
  const path = categoryPath(tree, category);
  const byId = categoryMap(tree);
  const node = byId.get(stored?.id ?? "");
  const parent = category.parentId ? byId.get(category.parentId) : undefined;
  const navParent = siteConfig.nav.find((item) => item.slug === (category.parentId ?? slug));
  const chipsSource =
    node && node.children.length > 0
      ? node.children
      : (parent?.children ??
        navParent?.children.map((child) => ({
          name: child.name,
          slug: child.slug,
        })) ??
        []);

  return (
    <CatalogListing
      title={category.name}
      description={category.description}
      crumbs={(path.length > 0 ? path : [category]).map((entry) => ({
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
      image={category.image}
    />
  );
}
