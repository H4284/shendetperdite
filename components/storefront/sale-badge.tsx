import { Badge } from "@/components/ui/badge";
import { saleDiscountPercent } from "@/lib/format";
import { t } from "@/lib/i18n/sq";

export function SaleBadge({
  price,
  compareAtPrice,
}: {
  price: number;
  compareAtPrice?: number | null;
}) {
  const percent = saleDiscountPercent(price, compareAtPrice);
  if (percent == null) return null;

  return (
    <Badge className="pointer-events-none shadow-sm" variant="default">
      {t("catalog.salePercent", { percent })}
    </Badge>
  );
}
