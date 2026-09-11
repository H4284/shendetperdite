"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CartDiscountForm } from "@/components/cart/cart-discount";
import { CartEmpty } from "@/components/cart/cart-empty";
import { CartLine } from "@/components/cart/cart-line";
import { CartShippingProgress } from "@/components/cart/cart-shipping";
import { Button } from "@/components/ui/button";
import { restoreRemovedItem, updateCartQty } from "@/lib/cart/client";
import { formatEuroAmount } from "@/lib/cart/money";
import { cartSubtotal, cartTotal } from "@/lib/cart/selectors";
import { useCartStore } from "@/lib/cart/store";
import { writeCartToAccount } from "@/lib/cart/sync";
import { t } from "@/lib/i18n/sq";

export function CartPanel({
  layout = "drawer",
  onContinue,
}: {
  layout?: "drawer" | "page";
  onContinue?: () => void;
}) {
  const items = useCartStore((state) => state.items);
  const discount = useCartStore((state) => state.discount);
  const removeLocal = useCartStore((state) => state.removeLocal);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const subtotal = cartSubtotal(items);
  const total = cartTotal(items, discount);

  useEffect(() => {
    const finish = () => setMounted(true);
    if (useCartStore.persist.hasHydrated()) finish();
    return useCartStore.persist.onFinishHydration(finish);
  }, []);

  async function onQty(variantId: string, qty: number) {
    setBusyId(variantId);
    try {
      await updateCartQty(variantId, qty);
    } finally {
      setBusyId(null);
    }
  }

  function onRemove(variantId: string) {
    const removed = removeLocal(variantId);
    void writeCartToAccount();
    if (!removed) return;
    toast(t("cart.removed"), {
      duration: 5000,
      action: {
        label: t("cart.undo"),
        onClick: () => {
          void restoreRemovedItem();
        },
      },
    });
  }

  if (!mounted) {
    return <div className="flex-1 px-4 py-8 text-sm text-muted-foreground">{t("cart.title")}…</div>;
  }

  if (items.length === 0) {
    return <CartEmpty onContinue={onContinue} />;
  }

  return (
    <div
      className={
        layout === "page"
          ? "grid gap-8 lg:grid-cols-[1fr_20rem]"
          : "flex h-full min-h-0 flex-col"
      }
    >
      <div className={layout === "page" ? "" : "min-h-0 flex-1 overflow-y-auto px-4"}>
        {items.map((item) => (
          <CartLine
            key={item.variantId}
            item={item}
            busy={busyId === item.variantId}
            onQty={(qty) => onQty(item.variantId, qty)}
            onRemove={() => onRemove(item.variantId)}
          />
        ))}
      </div>
      <aside
        className={
          layout === "page" ? "h-fit space-y-4 rounded-2xl border p-4" : "space-y-4 border-t p-4"
        }
      >
        <CartDiscountForm />
        <CartShippingProgress subtotal={subtotal} discount={discount} />
        <div className="flex items-center justify-between text-base font-semibold">
          <span>{t("cart.subtotal")}</span>
          <span>{formatEuroAmount(total)}</span>
        </div>
        <Button
          size="lg"
          className="h-11 w-full"
          nativeButton={false}
          render={<Link href="/checkout" onClick={onContinue} />}
        >
          {t("cart.checkout")}
        </Button>
        <Button
          variant="link"
          className="w-full"
          nativeButton={false}
          render={<Link href="/" onClick={onContinue} />}
        >
          {t("cart.continue")}
        </Button>
      </aside>
    </div>
  );
}
