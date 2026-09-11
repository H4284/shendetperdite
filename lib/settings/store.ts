import { unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { siteConfig } from "@/config/site";
import { storeSettingsSchema, type StoreSettings } from "@/types/content";

export const SETTINGS_TAG = "settings";

const fallbackSettings = (): StoreSettings => ({
  freeShippingFrom: siteConfig.freeShippingFrom,
  company: {
    name: siteConfig.name,
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.address,
  },
});

async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const snap = await getAdminDb().collection("settings").doc("store").get();
    if (!snap.exists) return fallbackSettings();
    return storeSettingsSchema.parse({
      ...fallbackSettings(),
      ...snap.data(),
      company: {
        ...fallbackSettings().company,
        ...(snap.data()?.company ?? {}),
      },
    });
  } catch (error) {
    console.error("Failed to load store settings", error);
    return fallbackSettings();
  }
}

export async function getStoreSettings() {
  return unstable_cache(fetchStoreSettings, ["store-settings"], {
    tags: [SETTINGS_TAG],
  })();
}
