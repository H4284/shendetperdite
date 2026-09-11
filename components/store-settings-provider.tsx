"use client";

import { createContext, useContext } from "react";
import { siteConfig } from "@/config/site";
import type { StoreSettings } from "@/types/content";

const SettingsContext = createContext<StoreSettings>({
  freeShippingFrom: siteConfig.freeShippingFrom,
  company: {
    name: siteConfig.name,
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.address,
  },
});

export function StoreSettingsProvider({
  value,
  children,
}: {
  value: StoreSettings;
  children: React.ReactNode;
}) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useStoreSettings() {
  return useContext(SettingsContext);
}
