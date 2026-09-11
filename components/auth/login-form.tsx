"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLinks, AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { loginSchema, type LoginInput } from "@/lib/auth/schema";
import { authErrorMessage, firebaseErrorCode } from "@/lib/auth/errors";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth/client";
import { safeNextPath } from "@/lib/auth/paths";
import { t } from "@/lib/i18n/sq";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const [googleBusy, setGoogleBusy] = useState(false);
  const form = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path.join(".") as keyof LoginInput, {
          message: issue.message,
        });
      }
      return;
    }
    try {
      await loginWithEmail(parsed.data.email, parsed.data.password);
      router.replace(next);
      router.refresh();
    } catch (error) {
      toast.error(authErrorMessage(firebaseErrorCode(error)));
    }
  }

  async function onGoogle() {
    setGoogleBusy(true);
    try {
      await loginWithGoogle();
      router.replace(next);
      router.refresh();
    } catch (error) {
      const message = authErrorMessage(firebaseErrorCode(error));
      if (message) toast.error(message);
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <AuthShell title={t("auth.login")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <span className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </span>
          ) : null}
        </label>
        <p className="text-sm">
          <Link
            href="/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            {t("auth.forgot")}
          </Link>
        </p>
        <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("auth.submitting") : t("auth.login")}
        </Button>
      </form>
      <GoogleButton busy={googleBusy} onClick={onGoogle} />
      <AuthLinks register />
    </AuthShell>
  );
}
