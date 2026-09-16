"use client";

import { useEffect, useRef, useState } from "react";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Price } from "@/components/storefront/price";

export function ProductStickyCta({
  price,
  compareAtPrice,
  productId,
  variantId,
  qty = 1,
  disabled,
  observeRef,
}: {
  price: number;
  compareAtPrice?: number | null;
  productId: string;
  variantId: string | null | undefined;
  qty?: number;
  disabled?: boolean;
  /** Element that, when visible, hides the sticky bar (usually the main ATC). */
  observeRef: React.RefObject<HTMLElement | null>;
}) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observeRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [observeRef]);

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Price
          price={price}
          compareAtPrice={compareAtPrice}
          className="min-w-0 flex-1 text-base"
          showDiscountBadge
        />
        <AddToCartButton
          productId={productId}
          variantId={variantId}
          qty={qty}
          disabled={disabled}
          className="h-11 shrink-0 px-5"
        />
      </div>
    </div>
  );
}
