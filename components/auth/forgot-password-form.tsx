"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLinks, AuthShell } from "@/components/auth/auth-shell";
import { forgotPasswordSchema } from "@/lib/auth/schema";
import { authErrorMessage, firebaseErrorCode } from "@/lib/auth/errors";
import { sendResetEmail } from "@/lib/auth/client";
import { t } from "@/lib/i18n/sq";

export function ForgotPasswordForm() {
  const form = useForm({ defaultValues: { email: "" } });

  async function onSubmit(values: { email: string }) {
    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      form.setError("email", { message: parsed.error.issues[0]?.message });
      return;
    }
    try {
      await sendResetEmail(parsed.data.email);
      toast.success(t("auth.resetSent"));
    } catch (error) {
      toast.error(authErrorMessage(firebaseErrorCode(error)));
    }
  }

  return (
    <AuthShell title={t("auth.forgotTitle")}>
      <p className="text-sm text-muted-foreground">{t("auth.forgotBody")}</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.email")}</span>
          <Input className="h-11" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <span className="text-sm text-destructive">{form.formState.errors.email.message}</span>
          ) : null}
        </label>
        <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("auth.submitting") : t("auth.sendReset")}
        </Button>
      </form>
      <AuthLinks login />
    </AuthShell>
  );
}
