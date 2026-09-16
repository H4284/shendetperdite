const euro = new Intl.NumberFormat("sq-AL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function formatPrice(amount: number) {
  return euro.format(amount);
}

/** Percent off when compare-at is higher than price; otherwise null. */
export function saleDiscountPercent(price: number, compareAtPrice?: number | null) {
  if (compareAtPrice == null || compareAtPrice <= price) return null;
  const percent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return percent >= 1 ? percent : null;
}

export function formatUnitPrice(amount: number, unit: string) {
  return `${formatPrice(amount)}/${unit}`;
}

export function variantLabel(optionValues: Record<string, string>) {
  return Object.values(optionValues).filter(Boolean).join(" / ");
}
