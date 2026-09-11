import { z } from "zod";
import { isKosovoPhone } from "@/lib/checkout/schema";

export const emailSchema = z.string().trim().email("Shkruani një email të vlefshëm");
export const passwordSchema = z.string().min(8, "Fjalëkalimi duhet të ketë të paktën 8 karaktere");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Shkruani fjalëkalimin"),
});

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, "Shkruani emrin"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Fjalëkalimet nuk përputhen",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Fjalëkalimet nuk përputhen",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Shkruani emrin"),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || value === "+383" || isKosovoPhone(value), {
      message: "Telefoni duhet të jetë +383 dhe 8 shifra",
    }),
  newsletterOptIn: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Shkruani fjalëkalimin aktual"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Fjalëkalimet nuk përputhen",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
