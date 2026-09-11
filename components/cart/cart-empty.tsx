import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";

export function CartEmpty({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShoppingBag className="size-10" />
      </span>
      <p className="text-lg font-semibold">{t("cart.empty")}</p>
      <Button nativeButton={false} render={<Link href="/" onClick={onContinue} />}>
        {t("cart.emptyCta")}
      </Button>
    </div>
  );
}
