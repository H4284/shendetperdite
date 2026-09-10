import { cn } from "cn";
import { formatPrice } from "@/lib/format";

export function Price({
  price,
  compareAtPrice,
  className,
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
}) {
  const onSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className="font-semibold text-foreground">{formatPrice(price)}</span>
      {onSale ? (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice)}
        </span>
      ) : null}
    </div>
  );
}
