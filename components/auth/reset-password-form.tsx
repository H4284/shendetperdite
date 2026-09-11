"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLinks, AuthShell } from "@/components/auth/auth-shell";
import { resetPasswordSchema } from "@/lib/auth/schema";
import { authErrorMessage, firebaseErrorCode } from "@/lib/auth/errors";
import { completeEmailVerification, completePasswordReset } from "@/lib/auth/client";
import { t } from "@/lib/i18n/sq";
import { useEffect, useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const oobCode = params.get("oobCode") ?? "";
  const mode = params.get("mode") ?? "resetPassword";
  const [verifyState, setVerifyState] = useState<"idle" | "ok" | "error">("idle");
  const form = useForm({ defaultValues: { password: "", confirmPassword: "" } });

  useEffect(() => {
    if (mode !== "verifyEmail" || !oobCode) return;
    completeEmailVerification(oobCode)
      .then(() => setVerifyState("ok"))
      .catch(() => setVerifyState("error"));
  }, [mode, oobCode]);

  async function onSubmit(values: { password: string; confirmPassword: string }) {
    const parsed = resetPasswordSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path.join(".") as "password" | "confirmPassword", {
          message: issue.message,
        });
      }
      return;
    }
    if (!oobCode) {
      toast.error(t("auth.resetInvalid"));
      return;
    }
    try {
      await completePasswordReset(oobCode, parsed.data.password);
      toast.success(t("auth.resetDone"));
      router.replace("/login");
    } catch (error) {
      toast.error(authErrorMessage(firebaseErrorCode(error)));
    }
  }

  if (mode === "verifyEmail") {
    return (
      <AuthShell title={t("auth.verifyTitle")}>
        <p className="text-sm text-muted-foreground">
          {verifyState === "ok"
            ? t("auth.verifyOk")
            : verifyState === "error"
              ? t("auth.verifyFail")
              : t("auth.submitting")}
        </p>
        <AuthLinks login />
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t("auth.resetTitle")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          {form.formState.isSubmitting ? t("auth.submitting") : t("auth.savePassword")}
        </Button>
      </form>
      <AuthLinks login />
    </AuthShell>
  );
}
