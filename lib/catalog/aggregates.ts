export type VariantAggregateInput = {
  id: string;
  price: number;
  stockQty: number;
  isDefault?: boolean;
};

export type ProductAggregates = {
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  defaultVariantId: string | null;
};

export function computeProductAggregates(
  variants: VariantAggregateInput[],
  fallbackPrice = 0,
): ProductAggregates {
  if (variants.length === 0) {
    return {
      minPrice: fallbackPrice,
      maxPrice: fallbackPrice,
      totalStock: 0,
      defaultVariantId: null,
    };
  }

  const prices = variants.map((variant) => variant.price);
  const defaultVariant =
    variants.find((variant) => variant.isDefault) ?? variants[0];

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    totalStock: variants.reduce((sum, variant) => sum + variant.stockQty, 0),
    defaultVariantId: defaultVariant.id,
  };
}
