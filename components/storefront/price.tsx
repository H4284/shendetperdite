import { cn } from "cn";
import { formatPrice, saleDiscountPercent } from "@/lib/format";
import { t } from "@/lib/i18n/sq";

export function Price({
  price,
  compareAtPrice,
  className,
  showDiscountBadge = false,
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  showDiscountBadge?: boolean;
}) {
  const onSale = compareAtPrice != null && compareAtPrice > price;
  const percent = showDiscountBadge ? saleDiscountPercent(price, compareAtPrice) : null;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={onSale ? "font-semibold text-primary" : "font-semibold text-foreground"}>
        {formatPrice(price)}
      </span>
      {onSale ? (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice)}
        </span>
      ) : null}
      {percent != null ? (
        <span className="text-xs font-semibold text-primary">
          {t("catalog.salePercent", { percent })}
        </span>
      ) : null}
    </div>
  );
}
