import { KOSOVO_CITIES } from "@/data/kosovo-cities";
import { isKosovoPhone } from "@/lib/checkout/schema";
import { z } from "zod";

export const savedAddressSchema = z.object({
  label: z.string().trim().min(1, "Shkruani një etiketë"),
  recipient: z.string().trim().min(2, "Shkruani emrin e marrësit"),
  line1: z.string().trim().min(3, "Shkruani adresën"),
  city: z.string().refine((city) => (KOSOVO_CITIES as readonly string[]).includes(city), {
    message: "Zgjidhni një qytet",
  }),
  postalCode: z.string().trim().optional(),
  phone: z.string().trim().refine(isKosovoPhone, "Telefoni duhet të jetë +383 dhe 8 shifra"),
  country: z.literal("Kosovë"),
  isDefault: z.boolean(),
});

export type SavedAddress = z.infer<typeof savedAddressSchema> & { id: string };

export type UserProfile = {
  email: string;
  displayName: string;
  phone: string;
  newsletterOptIn: boolean;
};
