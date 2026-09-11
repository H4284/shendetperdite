"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLinks, AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { registerSchema, type RegisterInput } from "@/lib/auth/schema";
import { authErrorMessage, firebaseErrorCode } from "@/lib/auth/errors";
import { loginWithGoogle, registerWithEmail } from "@/lib/auth/client";
import { track } from "@/lib/analytics";
import { t } from "@/lib/i18n/sq";

export function RegisterForm() {
  const router = useRouter();
  const [googleBusy, setGoogleBusy] = useState(false);
  const form = useForm<RegisterInput>({
    defaultValues: { displayName: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterInput) {
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path.join(".") as keyof RegisterInput, {
          message: issue.message,
        });
      }
      return;
    }
    try {
      await registerWithEmail(parsed.data);
      track("sign_up");
      toast.success(t("auth.verifySent"));
      router.replace("/account");
      router.refresh();
    } catch (error) {
      toast.error(authErrorMessage(firebaseErrorCode(error)));
    }
  }

  async function onGoogle() {
    setGoogleBusy(true);
    try {
      await loginWithGoogle();
      router.replace("/account");
      router.refresh();
    } catch (error) {
      const message = authErrorMessage(firebaseErrorCode(error));
      if (message) toast.error(message);
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <AuthShell title={t("auth.register")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.name")}</span>
          <Input className="h-11" autoComplete="name" {...form.register("displayName")} />
          {form.formState.errors.displayName ? (
            <span className="text-sm text-destructive">
              {form.formState.errors.displayName.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.email")}</span>
          <Input className="h-11" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <span className="text-sm text-destructive">{form.formState.errors.email.message}</span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.password")}</span>
          <Input
            className="h-11"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <span className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.confirmPassword")}</span>
          <Input
            className="h-11"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <span className="text-sm text-destructive">
              {form.formState.errors.confirmPassword.message}
            </span>
          ) : null}
        </label>
        <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("auth.submitting") : t("auth.register")}
        </Button>
      </form>
      <GoogleButton busy={googleBusy} onClick={onGoogle} />
      <AuthLinks login />
    </AuthShell>
  );
}
