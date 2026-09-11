"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";

export function GoogleButton({
  busy,
  onClick,
}: {
  busy?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full"
      disabled={busy}
      onClick={onClick}
    >
      {t("auth.google")}
    </Button>
  );
}
