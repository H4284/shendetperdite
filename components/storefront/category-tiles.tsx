import Link from "next/link";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { t } from "@/lib/i18n/sq";

export type HomeCategoryTile = {
  name: string;
  slug: string;
  image: string;
};

export function CategoryTiles({ categories }: { categories: HomeCategoryTile[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t("home.categories")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("home.categoriesSubtitle")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-2xl bg-card"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <CatalogImage
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="px-2 py-3 text-center text-sm font-semibold group-hover:text-primary">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
