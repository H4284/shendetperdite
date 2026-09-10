import Link from "next/link";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { t } from "@/lib/i18n/sq";
import type { CategoryTreeNode } from "@/types/catalog";

export function CategoryTiles({ categories }: { categories: CategoryTreeNode[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{t("home.categories")}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-xl border bg-card"
          >
            <div className="relative aspect-[4/3] bg-muted">
              {category.image ? (
                <CatalogImage
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              ) : null}
            </div>
            <p className="px-3 py-3 text-sm font-semibold group-hover:underline">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
