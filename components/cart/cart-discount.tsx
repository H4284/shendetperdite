"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyCartDiscount, discountErrorMessage } from "@/lib/cart/client";
import { useCartStore } from "@/lib/cart/store";
import { t } from "@/lib/i18n/sq";

export function CartDiscountForm() {
  const discount = useCartStore((state) => state.discount);
  const [code, setCode] = useState(discount?.code ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await applyCartDiscount(code);
      if (!result.ok) {
        const message = discountErrorMessage(
          result.error,
          "minSubtotal" in result ? result.minSubtotal : undefined,
        );
        setError(message);
        toast.error(message);
        return;
      }
      toast.success(t("cart.discountApplied"));
    } catch {
      const message = t("cart.discountInvalid");
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label className="text-sm font-medium" htmlFor="discount-code">
        {t("cart.discountLabel")}
      </label>
      <div className="flex gap-2">
        <Input
          id="discount-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={t("cart.discountPlaceholder")}
          className="h-10"
          autoCapitalize="characters"
        />
        <Button type="submit" variant="outline" className="h-10" disabled={busy || !code.trim()}>
          {t("cart.apply")}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {discount && !error ? (
        <p className="text-sm text-primary">{discount.code}</p>
      ) : null}
    </form>
  );
}
