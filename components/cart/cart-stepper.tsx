"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n/sq";

export function CartStepper({
  value,
  max,
  disabled,
  onChange,
}: {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="inline-flex h-10 items-center rounded-lg border">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 rounded-r-none"
        disabled={disabled || value <= 1}
        aria-label="-"
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        disabled={disabled}
        aria-label={t("cart.qty")}
        className="h-10 w-12 rounded-none border-0 border-x text-center md:text-sm"
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 rounded-l-none"
        disabled={disabled || value >= max}
        aria-label="+"
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
