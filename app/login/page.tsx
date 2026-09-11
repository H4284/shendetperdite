import Link from "next/link";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hyr",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{t("checkout.loginTitle")}</h1>
      <p className="text-muted-foreground">{t("checkout.loginSoon")}</p>
      <Button nativeButton={false} render={<Link href="/checkout" />}>
        {t("checkout.title")}
      </Button>
    </div>
  );
}
