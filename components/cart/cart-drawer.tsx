"use client";

import { useEffect } from "react";
import { CartPanel } from "@/components/cart/cart-panel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { refreshCart } from "@/lib/cart/client";
import { useCartStore } from "@/lib/cart/store";
import { t } from "@/lib/i18n/sq";

export function CartDrawer() {
  const open = useCartStore((state) => state.drawerOpen);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  useEffect(() => {
    if (open) void refreshCart();
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 data-[side=right]:w-full sm:max-w-md"
        showCloseButton
      >
        <SheetHeader className="border-b">
          <SheetTitle>{t("cart.title")}</SheetTitle>
        </SheetHeader>
        <CartPanel onContinue={() => setDrawerOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
