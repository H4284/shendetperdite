"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";

export function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-20">
      <h1 className="text-2xl font-semibold">{t("error.title")}</h1>
      <p className="text-muted-foreground">{t("error.body")}</p>
      <Button onClick={reset}>{t("error.retry")}</Button>
    </div>
  );
}
