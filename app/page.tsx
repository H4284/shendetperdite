import { Suspense } from "react";
import heroSlides from "@/content/hero-slides.json";
import promos from "@/content/promos.json";
import { BrandPromo } from "@/components/storefront/brand-promo";
import { CategoryTiles } from "@/components/storefront/category-tiles";
import { FreeShippingBanner } from "@/components/storefront/free-shipping-banner";
import { HeroSlider } from "@/components/storefront/hero-slider";
import { NewsletterSignup } from "@/components/storefront/newsletter-signup";
import { ProductCarousel } from "@/components/storefront/product-carousel";
import { ProductGridSkeleton } from "@/components/storefront/skeletons";
import { TrustedBrands } from "@/components/storefront/trusted-brands";
import {
  getBestSellers,
  getBrands,
  getCategoryTree,
  getNewProducts,
  getSaleProducts,
} from "@/lib/catalog";
import { t } from "@/lib/i18n/sq";
import type { Brand, Product } from "@/types/catalog";

export const revalidate = 3600;

function brandNames(brands: Brand[]) {
  return Object.fromEntries(brands.map((brand) => [brand.id, brand.name]));
}

async function HomeCategories() {
  try {
    const tree = await getCategoryTree();
    return <CategoryTiles categories={tree} />;
  } catch (error) {
    console.error("Failed to load categories", error);
    return null;
  }
}

async function HomeCarousel({
  title,
  loader,
}: {
  title: string;
  loader: () => Promise<Product[]>;
}) {
  try {
    const [products, brands] = await Promise.all([loader(), getBrands()]);
    return (
      <ProductCarousel
        title={title}
        products={products}
        brandNames={brandNames(brands)}
      />
    );
  } catch (error) {
    console.error("Failed to load carousel", error);
    return null;
  }
}

async function HomeBrands() {
  try {
    const brands = await getBrands();
    return <TrustedBrands brands={brands} />;
  } catch (error) {
    console.error("Failed to load brands", error);
    return null;
  }
}

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={heroSlides} />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12">
        <Suspense fallback={<ProductGridSkeleton count={5} />}>
          <HomeCategories />
        </Suspense>
        <BrandPromo blocks={promos} />
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeCarousel title={t("home.limitedOffers")} loader={getSaleProducts} />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeCarousel title={t("home.bestSellers")} loader={getBestSellers} />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeCarousel title={t("home.newArrivals")} loader={getNewProducts} />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton count={5} />}>
          <HomeBrands />
        </Suspense>
        <NewsletterSignup />
        <FreeShippingBanner />
      </div>
    </>
  );
}
