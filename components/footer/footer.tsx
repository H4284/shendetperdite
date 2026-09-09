import Link from "next/link";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n/sq";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Link href="/" className="text-sm font-semibold">
            {siteConfig.name}
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
              {siteConfig.email}
            </a>
            <a href={siteConfig.phoneHref} className="hover:text-foreground">
              {siteConfig.phone}
            </a>
            <p>{siteConfig.address}</p>
          </div>
        </div>
        <nav aria-label={t("footer.nav")} className="flex flex-col gap-2">
          {siteConfig.footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground">
          {t("footer.copyright", { year, name: siteConfig.name })}
        </p>
      </div>
    </footer>
  );
}
