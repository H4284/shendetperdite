"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cartItemCount } from "@/lib/cart/selectors";
import { useCartStore } from "@/lib/cart/store";
import { t } from "@/lib/i18n/sq";

export function CartButton() {
  const items = useCartStore((state) => state.items);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const count = cartItemCount(items);
  const [mounted, setMounted] = useState(false);
  const [bump, setBump] = useState(false);
  const prev = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (count > prev.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 400);
      prev.current = count;
      return () => window.clearTimeout(timer);
    }
    prev.current = count;
  }, [count, mounted]);

  const shown = mounted ? count : 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("header.cart")}
      className="relative"
      onClick={() => setDrawerOpen(true)}
    >
      <ShoppingBag />
      {shown > 0 ? (
        <Badge
          variant="default"
          className={`absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] ${bump ? "animate-[cart-pop_400ms_ease]" : ""}`}
        >
          {shown}
        </Badge>
      ) : null}
    </Button>
  );
}
