"use client";

import { useEffect, useState } from "react";
import { CatalogImage } from "@/components/storefront/catalog-image";
import { t } from "@/lib/i18n/sq";
import type { CatalogImage as CatalogImageType } from "@/types/catalog";

export function ProductGallery({
  images,
  selectedUrl,
}: {
  images: CatalogImageType[];
  selectedUrl?: string | null;
}) {
  const ordered = [...images].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(
    selectedUrl && ordered.some((image) => image.url === selectedUrl)
      ? selectedUrl
      : (ordered[0]?.url ?? ""),
  );

  useEffect(() => {
    if (selectedUrl) setActive(selectedUrl);
  }, [selectedUrl]);

  const current =
    ordered.find((image) => image.url === active) ?? ordered[0];

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <CatalogImage
          src={current.url}
          alt={current.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {ordered.length > 1 ? (
        <ul
          className="flex gap-2 overflow-x-auto"
          aria-label={t("product.gallery")}
        >
          {ordered.map((image, index) => (
            <li key={`${image.url}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(image.url)}
                className={
                  current.url === image.url
                    ? "relative size-16 overflow-hidden rounded-md ring-2 ring-primary"
                    : "relative size-16 overflow-hidden rounded-md ring-1 ring-border"
                }
                aria-label={t("product.thumbnail", { n: index + 1 })}
              >
                <CatalogImage
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="64px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
