import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/site-url";
import type { Brand, ProductWithVariants } from "@/types/catalog";

export function ProductJsonLd({
  product,
  brand,
}: {
  product: ProductWithVariants;
  brand: Brand | null;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((image) => image.url),
    sku: product.variants.find((variant) => variant.isDefault)?.sku,
    brand: brand
      ? {
          "@type": "Brand",
          name: brand.name,
        }
      : undefined,
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      sku: variant.sku,
      price: variant.price,
      priceCurrency: "EUR",
      availability:
        variant.stockQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(
        `/products/${product.slug}?variant=${encodeURIComponent(variant.sku)}`,
      ),
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
