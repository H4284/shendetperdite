"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/sq";

const SearchDialog = dynamic(
  () => import("./search-dialog").then((mod) => mod.SearchDialog),
  { ssr: false },
);

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.userAgent);
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(isMac());
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shortcut = mac
    ? t("header.searchShortcutMac")
    : t("header.searchShortcutWin");

  return (
    <div className="flex flex-1 items-center justify-end md:justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 w-full max-w-xl items-center gap-2 rounded-full border border-input bg-muted/40 px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
        aria-label={t("header.searchAria")}
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1">{t("header.searchPlaceholder")}</span>
        <kbd className="rounded-md border bg-background px-1.5 py-0.5 text-[11px] font-medium text-foreground">
          {shortcut}
        </kbd>
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label={t("header.searchAria")}
        onClick={() => setOpen(true)}
      >
        <Search />
      </Button>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
