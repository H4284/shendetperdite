import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { t } from "@/lib/i18n/sq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fjalëkalimi i ri",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="px-4 py-12 text-sm text-muted-foreground">{t("auth.submitting")}</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
