"use client";

import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCartStore } from "@/lib/cart/store";
import { t } from "@/lib/i18n/sq";

export function CartButton() {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("header.cart")}
            className="relative"
          />
        }
      >
        <ShoppingBag />
        {itemCount > 0 ? (
          <Badge
            variant="default"
            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]"
          >
            {itemCount}
          </Badge>
        ) : null}
      </TooltipTrigger>
      <TooltipContent>{t("header.cart")}</TooltipContent>
    </Tooltip>
  );
}
