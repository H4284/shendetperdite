import Link from "next/link";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { t } from "@/lib/i18n/sq";
import type { Brand } from "@/types/catalog";

export function TrustedBrands({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t("home.trustedBrands")}
      </h2>
      <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-5">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="flex h-20 items-center justify-center rounded-xl border bg-card px-4 py-3 hover:bg-muted"
            aria-label={brand.name}
          >
            {brand.logo ? (
              <div className="relative h-10 w-full">
                <CatalogImage
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-sm font-semibold">{brand.name}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
