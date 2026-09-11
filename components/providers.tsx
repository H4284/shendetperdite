"use client";

import { ThemeProvider } from "next-themes";
import { AuthSync } from "@/components/auth/auth-sync";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartSync } from "@/components/cart/cart-sync";
import { StoreSettingsProvider } from "@/components/store-settings-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import type { StoreSettings } from "@/types/content";

export function Providers({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: StoreSettings;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <StoreSettingsProvider value={settings}>
        <TooltipProvider>
          {children}
          <CartDrawer />
          <CartSync />
          <AuthSync />
          <Toaster />
        </TooltipProvider>
      </StoreSettingsProvider>
    </ThemeProvider>
  );
}
