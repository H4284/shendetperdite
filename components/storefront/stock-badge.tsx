import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n/sq";

export function StockBadge({ inStock }: { inStock: boolean }) {
  if (inStock) return null;

  return (
    <Badge variant="destructive" className="pointer-events-none">
      {t("catalog.outOfStock")}
    </Badge>
  );
}

export function StockStatus({ inStock }: { inStock: boolean }) {
  return (
    <p
      className={
        inStock ? "text-sm text-emerald-700 dark:text-emerald-400" : "text-sm text-destructive"
      }
    >
      {inStock ? t("catalog.inStock") : t("catalog.outOfStock")}
    </p>
  );
}
