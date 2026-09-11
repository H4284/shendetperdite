"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart/client";
import { t } from "@/lib/i18n/sq";

export function AddToCartButton({
  productId,
  variantId,
  disabled,
  className,
  size = "lg",
}: {
  productId: string;
  variantId: string | null | undefined;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "lg";
}) {
  const [busy, setBusy] = useState(false);
  const unavailable = disabled || !variantId;

  async function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!variantId || busy) return;
    setBusy(true);
    try {
      await addToCart({ productId, variantId, qty: 1 });
    } catch {
      toast.error(t("error.body"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      size={size}
      className={className}
      disabled={unavailable || busy}
      onClick={onClick}
    >
      {busy ? t("cart.loading") : t("product.addToCart")}
    </Button>
  );
}
