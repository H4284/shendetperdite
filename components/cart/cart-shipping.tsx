import { useStoreSettings } from "@/components/store-settings-provider";
import { formatEuroAmount } from "@/lib/cart/money";
import {
  freeShippingRemaining,
  hasFreeShipping,
} from "@/lib/cart/selectors";
import type { AppliedDiscount } from "@/types/cart";
import { t } from "@/lib/i18n/sq";

export function CartShippingProgress({
  subtotal,
  discount,
}: {
  subtotal: number;
  discount: AppliedDiscount | null;
}) {
  const threshold = useStoreSettings().freeShippingFrom;
  const remaining = freeShippingRemaining(subtotal, threshold);
  const earned = hasFreeShipping(subtotal, discount, threshold);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="space-y-2">
      <p className="text-sm">
        {t("cart.shipping")} —{" "}
        <span className="font-semibold tracking-wide">
          {t("cart.shippingCheckout")}
        </span>
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${earned ? 100 : progress}%` }}
        />
      </div>
      <p className="text-sm">
        {earned
          ? t("cart.freeShippingWon")
          : t("cart.remaining", { amount: formatEuroAmount(remaining) })}
      </p>
    </div>
  );
}
