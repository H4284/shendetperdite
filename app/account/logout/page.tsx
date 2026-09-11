"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/client";
import { t } from "@/lib/i18n/sq";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    void logout().finally(() => {
      router.replace("/");
      router.refresh();
    });
  }, [router]);

  return <p className="text-sm text-muted-foreground">{t("account.loggingOut")}</p>;
}
