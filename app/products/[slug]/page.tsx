import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { ProductCarousel } from "@/components/storefront/product-carousel";
import { ProductDetails } from "@/components/storefront/product-details";
import { ProductViewTracker } from "@/components/analytics/product-view-tracker";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ProductJsonLd } from "@/components/storefront/product-json-ld";
import { siteConfig } from "@/config/site";
import {
  fetchActiveProductSlugs,
  getBrands,
  getCategoryTree,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog";
import { categoryMap, productCategoryPath } from "@/lib/catalog/tree";
import { variantLabel } from "@/lib/format";
import { Markdown } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/seo/site-url";
import { t } from "@/lib/i18n/sq";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await fetchActiveProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { variant: sku } = await searchParams;
  const product = await getProductBySlug(slug);
  if (!product) return { title: slug };

  const variant =
    product.variants.find((entry) => entry.sku === sku) ??
    product.variants.find((entry) => entry.isDefault) ??
    product.variants[0];
  const label = variant ? variantLabel(variant.optionValues) : "";
  const title = label ? `${product.name} - ${label}` : product.name;
  const image = product.images[0];

  return {
    title: { absolute: `${title} | ${siteConfig.name}` },
    description: product.shortDescription,
    alternates: { canonical: absoluteUrl(`/products/${product.slug}`) },
    openGraph: {
      title,
      description: product.shortDescription,
      url: absoluteUrl(`/products/${product.slug}`),
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.shortDescription,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { variant: sku } = await searchParams;
  const [product, brands, tree] = await Promise.all([
    getProductBySlug(slug),
    getBrands(),
    getCategoryTree(),
  ]);

  if (!product) notFound();

  const brand = brands.find((entry) => entry.id === product.brandId) ?? null;
  const related = await getRelatedProducts(product);
  const brandNames = Object.fromEntries(
    brands.map((entry) => [entry.id, entry.name]),
  );
  const categoryPath = productCategoryPath(tree, product.categoryIds);
  const byId = categoryMap(tree);
  const categories = product.categoryIds
    .map((id) => byId.get(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const crumbs = [
    ...categoryPath.map((entry) => ({
      name: entry.name,
      href: `/categories/${entry.slug}`,
    })),
    { name: product.name },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      <ProductJsonLd product={product} brand={brand} />
      <BreadcrumbJsonLd items={crumbs} />
      <ProductViewTracker
        id={product.id}
        name={product.name}
        brand={brand?.name}
        price={product.minPrice}
      />
      <Breadcrumbs items={crumbs} />
      <ProductDetails
        product={product}
        brandName={brand?.name ?? ""}
        initialSku={sku ?? null}
      />
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("product.description")}</h2>
        <Markdown content={product.description} />
      </section>
      {categories.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">{t("product.categories")}</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <ProductCarousel
        title={t("product.similar")}
        products={related}
        brandNames={brandNames}
      />
      <ProductCarousel
        title={t("product.alsoBought")}
        products={related}
        brandNames={brandNames}
      />
    </div>
  );
}
