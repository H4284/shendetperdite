import { unstable_cache } from "next/cache";
import heroSlides from "@/content/hero-slides.json";
import brandPromos from "@/content/promos.json";
import { getAdminDb } from "@/lib/firebase/admin";
import { getBrands } from "@/lib/catalog";
import {
  homeContentSchema,
  type BrandPromo,
  type HeroSlide,
  type HomeContent,
} from "@/types/content";
import type { Brand } from "@/types/catalog";

export const HOME_TAG = "home";

const fallbackHome = (): HomeContent => ({
  heroSlides: heroSlides.map((slide, order) => ({
    ...slide,
    textColor: slide.textColor === "light" ? "light" : "dark",
    order,
    active: true,
  })),
  brandPromos: brandPromos.map((block, order) => ({
    ...block,
    order,
    active: true,
  })),
  trustedBrandIds: [],
});

async function fetchHomeContent(): Promise<HomeContent> {
  try {
    const snap = await getAdminDb().collection("content").doc("home").get();
    if (!snap.exists) return fallbackHome();
    const parsed = homeContentSchema.partial().parse(snap.data() ?? {});
    const fallback = fallbackHome();
    return {
      heroSlides: parsed.heroSlides?.length ? parsed.heroSlides : fallback.heroSlides,
      brandPromos: parsed.brandPromos?.length ? parsed.brandPromos : fallback.brandPromos,
      trustedBrandIds: parsed.trustedBrandIds ?? [],
    };
  } catch (error) {
    console.error("Failed to load home content", error);
    return fallbackHome();
  }
}

export async function getHomeContent() {
  return unstable_cache(fetchHomeContent, ["home-content"], {
    tags: [HOME_TAG],
  })();
}

export function activeHeroSlides(content: HomeContent): HeroSlide[] {
  return content.heroSlides
    .filter((slide) => slide.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function activeBrandPromos(content: HomeContent): BrandPromo[] {
  return content.brandPromos
    .filter((block) => block.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function orderedBrands(brands: Brand[], trustedBrandIds: string[]) {
  if (trustedBrandIds.length === 0) return brands;
  const byId = new Map(brands.map((brand) => [brand.id, brand]));
  const ordered = trustedBrandIds
    .map((id) => byId.get(id))
    .filter((brand): brand is Brand => Boolean(brand));
  const rest = brands.filter((brand) => !trustedBrandIds.includes(brand.id));
  return [...ordered, ...rest];
}

export async function getHomeBrands(content: HomeContent) {
  const brands = await getBrands();
  return orderedBrands(brands, content.trustedBrandIds);
}
