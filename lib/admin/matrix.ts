import type { ProductOption } from "@/types/catalog";

export function variantMatrix(options: ProductOption[]) {
  const axes = options
    .map((option) => ({
      name: option.name.trim(),
      values: option.values.map((value) => value.trim()).filter(Boolean),
    }))
    .filter((option) => option.name && option.values.length > 0)
    .slice(0, 2);

  if (axes.length === 0) return [{} as Record<string, string>];

  return axes.reduce<Record<string, string>[]>(
    (rows, axis) => {
      if (rows.length === 0) {
        return axis.values.map((value) => ({ [axis.name]: value }));
      }
      return rows.flatMap((row) =>
        axis.values.map((value) => ({ ...row, [axis.name]: value })),
      );
    },
    [],
  );
}

export function optionKey(optionValues: Record<string, string>) {
  return Object.entries(optionValues)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}:${value}`)
    .join("|");
}
