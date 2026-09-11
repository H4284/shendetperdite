import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n/sq";

export function FreeShippingBanner({ amount }: { amount: number }) {
  return (
    <section className="rounded-xl bg-emerald-700 px-4 py-5 text-center text-white">
      <p className="inline-flex items-center gap-2 text-sm font-medium md:text-base">
        <Truck className="size-5" />
        {t("home.freeShipping", { amount: formatPrice(amount) })}
      </p>
    </section>
  );
}
