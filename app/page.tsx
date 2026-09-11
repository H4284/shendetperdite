import { Suspense } from "react";
import homeCategories from "@/content/home-categories.json";
import storeBenefits from "@/content/store-benefits.json";
import { BrandPromo } from "@/components/storefront/brand-promo";
import { CategoryTiles } from "@/components/storefront/category-tiles";
import { HeroSlider } from "@/components/storefront/hero-slider";
import { NewsletterSignup } from "@/components/storefront/newsletter-signup";
import { ProductCarousel } from "@/components/storefront/product-carousel";
import { ProductGridSkeleton } from "@/components/storefront/skeletons";
import { StoreBenefits } from "@/components/storefront/store-benefits";
import { TrustedBrands } from "@/components/storefront/trusted-brands";
import {
  getBestSellers,
  getBrands,
  getNewProducts,
  getSaleProducts,
} from "@/lib/catalog";
import {
  activeBrandPromos,
  activeHeroSlides,
  getHomeBrands,
  getHomeContent,
} from "@/lib/content/home";
import { t } from "@/lib/i18n/sq";
import type { Brand, Product } from "@/types/catalog";

export const revalidate = 3600;

function brandNames(brands: Brand[]) {
  return Object.fromEntries(brands.map((brand) => [brand.id, brand.name]));
}

async function HomeCarousel({
  title,
  subtitle,
  loader,
}: {
  title: string;
  subtitle?: string;
  loader: () => Promise<Product[]>;
}) {
  try {
    const [products, brands] = await Promise.all([loader(), getBrands()]);
    return (
      <ProductCarousel
        title={title}
        subtitle={subtitle}
        products={products}
        brandNames={brandNames(brands)}
      />
    );
  } catch (error) {
    console.error("Failed to load carousel", error);
    return null;
  }
}

async function HomeBrands({ trustedBrandIds }: { trustedBrandIds: string[] }) {
  try {
    const brands = await getHomeBrands({
      heroSlides: [],
      brandPromos: [],
      trustedBrandIds,
    });
    return <TrustedBrands brands={brands} />;
  } catch (error) {
    console.error("Failed to load brands", error);
    return null;
  }
}

export default async function HomePage() {
  const content = await getHomeContent();
  const slides = activeHeroSlides(content);
  const promos = activeBrandPromos(content);

  return (
    <>
      <HeroSlider slides={slides} />
      <StoreBenefits items={storeBenefits} />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12">
        <CategoryTiles categories={homeCategories} />
        {promos.length ? <BrandPromo blocks={promos} /> : null}
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeCarousel
            title={t("home.limitedOffers")}
            subtitle={t("home.limitedOffersSubtitle")}
            loader={getSaleProducts}
          />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeCarousel
            title={t("home.bestSellers")}
            subtitle={t("home.bestSellersSubtitle")}
            loader={getBestSellers}
          />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeCarousel
            title={t("home.newArrivals")}
            subtitle={t("home.newArrivalsSubtitle")}
            loader={getNewProducts}
          />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton count={5} />}>
          <HomeBrands trustedBrandIds={content.trustedBrandIds} />
        </Suspense>
        <NewsletterSignup />
      </div>
    </>
  );
}
