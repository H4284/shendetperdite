"use client";

import { ThemeProvider } from "next-themes";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartSync } from "@/components/cart/cart-sync";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
        <CartDrawer />
        <CartSync />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
