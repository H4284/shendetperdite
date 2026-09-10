"use client";

import { useMemo } from "react";
import { cn } from "cn";
import type { ProductOption, Variant } from "@/types/catalog";

export function VariantSelector({
  options,
  variants,
  selected,
  onSelect,
}: {
  options: ProductOption[];
  variants: Variant[];
  selected: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
}) {
  const availability = useMemo(() => {
    return variants.filter((variant) =>
      Object.entries(selected).every(
        ([name, value]) => !value || variant.optionValues[name] === value,
      ),
    );
  }, [selected, variants]);

  function isDisabled(optionName: string, value: string) {
    const trial = { ...selected, [optionName]: value };
    return !variants.some((variant) =>
      Object.entries(trial).every(
        ([name, trialValue]) =>
          !trialValue || variant.optionValues[name] === trialValue,
      ),
    );
  }

  if (options.length === 0) return null;

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <fieldset key={option.name} className="space-y-2">
          <legend className="text-sm font-medium">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const active = selected[option.name] === value;
              const disabled = isDisabled(option.name, value);
              const inStock = availability.some(
                (variant) =>
                  variant.optionValues[option.name] === value &&
                  variant.stockQty > 0,
              );

              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(option.name, value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    disabled && "cursor-not-allowed opacity-40",
                  )}
                  aria-pressed={active}
                >
                  {value}
                  {!disabled && !inStock ? (
                    <span className="sr-only"> pa stok</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
