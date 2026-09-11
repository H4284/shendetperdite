import type { MetadataRoute } from "next";
import {
  fetchActiveBrandSlugs,
  fetchActiveCategorySlugs,
  fetchActiveProductSlugs,
} from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 3600;

const staticPaths = [
  "/",
  "/about",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
  "/search",
  "/cart",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.6,
  }));

  try {
    const [products, categories, brands] = await Promise.all([
      fetchActiveProductSlugs(),
      fetchActiveCategorySlugs(),
      fetchActiveBrandSlugs(),
    ]);
    return [
      ...staticEntries,
      ...categories.map((slug) => ({
        url: absoluteUrl(`/categories/${slug}`),
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...brands.map((slug) => ({
        url: absoluteUrl(`/brands/${slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...products.map((slug) => ({
        url: absoluteUrl(`/products/${slug}`),
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.9,
      })),
    ];
  } catch (error) {
    console.error("sitemap generation failed", error);
    return staticEntries;
  }
}
