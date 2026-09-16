import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "cn";
import { t } from "@/lib/i18n/sq";

type HeaderContactProps = {
  variant?: "bar" | "sheet";
  className?: string;
  onNavigate?: () => void;
};

const contactLinks = [
  {
    id: "phone" as const,
    href: siteConfig.phoneHref,
    external: false,
  },
  {
    id: "whatsapp" as const,
    href: siteConfig.whatsappHref,
    external: true,
  },
  {
    id: "viber" as const,
    href: siteConfig.viberHref,
    external: true,
  },
];

function linkLabel(id: (typeof contactLinks)[number]["id"]) {
  if (id === "phone") return t("header.phone");
  if (id === "whatsapp") return t("header.whatsapp");
  return t("header.viber");
}

export function HeaderContact({
  variant = "bar",
  className,
  onNavigate,
}: HeaderContactProps) {
  if (variant === "sheet") {
    return (
      <div className={cn("mb-4 border-b px-3 pb-4", className)}>
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Phone className="size-4 text-primary" aria-hidden />
          {t("header.contact")}
        </p>
        <ul className="space-y-1">
          {contactLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={onNavigate}
                className="block rounded-md py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                {...(link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span className="font-medium text-foreground">
                  {linkLabel(link.id)}:{" "}
                </span>
                {siteConfig.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hidden border-b bg-muted/40 md:block",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1.5 text-xs text-muted-foreground">
        <span className="sr-only">{t("header.contact")}</span>
        {contactLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {link.id === "phone" ? (
              <>
                <Phone className="size-3.5" aria-hidden />
                <span>{siteConfig.phone}</span>
              </>
            ) : (
              <span>{linkLabel(link.id)}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
