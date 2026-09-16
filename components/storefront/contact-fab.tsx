"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { t } from "@/lib/i18n/sq";

const links = [
  {
    id: "whatsapp",
    href: siteConfig.whatsappHref,
    labelKey: "header.whatsapp" as const,
    external: true,
  },
  {
    id: "viber",
    href: siteConfig.viberHref,
    labelKey: "header.viber" as const,
    external: true,
  },
  {
    id: "phone",
    href: siteConfig.phoneHref,
    labelKey: "header.phone" as const,
    external: false,
  },
];

export function ContactFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const hidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const liftForPdp = pathname.startsWith("/products/");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-2",
        liftForPdp
          ? "bottom-24 md:bottom-6"
          : "bottom-6",
      )}
    >
      {open ? (
        <div className="mb-1 flex w-48 flex-col gap-1 rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur-md">
          <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
            {t("header.contact")}
          </p>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
              {...(link.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {link.id === "phone" ? (
                <span className="inline-flex items-center gap-2">
                  <Phone className="size-4" aria-hidden />
                  {siteConfig.phone}
                </span>
              ) : (
                t(link.labelKey)
              )}
            </a>
          ))}
        </div>
      ) : null}
      <Button
        type="button"
        size="icon"
        className="size-12 rounded-full shadow-lg"
        aria-expanded={open}
        aria-label={open ? t("header.closeHelp") : t("header.openHelp")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}
