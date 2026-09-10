import liveMedia from "@/content/live-media.json";
import type { Brand, Category, CategoryTreeNode, Product } from "@/types/catalog";

const PLACEHOLDER = "placehold.co";

function isPlaceholder(url: string | null | undefined) {
  return !url || url.includes(PLACEHOLDER);
}

function categoryImage(slug: string | undefined) {
  if (!slug) return undefined;
  return liveMedia.categories[slug as keyof typeof liveMedia.categories];
}

export function applyLiveCategoryMedia(category: Category): Category {
  const image = categoryImage(category.slug) ?? categoryImage(category.parentId ?? undefined);
  if (!image) return category;
  return { ...category, image };
}

export function applyLiveBrandMedia(brand: Brand): Brand {
  const logo = liveMedia.brands[brand.slug as keyof typeof liveMedia.brands];
  if (logo) return { ...brand, logo };
  if (isPlaceholder(brand.logo)) return { ...brand, logo: null };
  return brand;
}

export function applyLiveProductMedia(product: Product): Product {
  const media =
    liveMedia.products[product.id as keyof typeof liveMedia.products] ??
    liveMedia.products[product.slug as keyof typeof liveMedia.products];

  if (media) {
    return {
      ...product,
      images: [
        { url: media.image, alt: product.name, order: 0 },
        {
          url: media.hover && media.hover !== media.image ? media.hover : media.image,
          alt: product.name,
          order: 1,
        },
      ],
    };
  }

  if (!product.images.some((image) => isPlaceholder(image.url))) return product;

  const fallback = product.categoryIds.map((id) => categoryImage(id)).find(Boolean);
  if (!fallback) return product;

  return {
    ...product,
    images: [{ url: fallback, alt: product.name, order: 0 }],
  };
}

export function applyLiveCategoryTree(nodes: CategoryTreeNode[]): CategoryTreeNode[] {
  return nodes.map((node) => ({
    ...applyLiveCategoryMedia(node),
    children: applyLiveCategoryTree(node.children),
  }));
}
