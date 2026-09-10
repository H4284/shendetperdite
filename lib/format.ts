const euro = new Intl.NumberFormat("sq-AL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function formatPrice(amount: number) {
  return euro.format(amount);
}

export function formatUnitPrice(amount: number, unit: string) {
  return `${formatPrice(amount)}/${unit}`;
}

export function variantLabel(optionValues: Record<string, string>) {
  return Object.values(optionValues).filter(Boolean).join(" / ");
}
