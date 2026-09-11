import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getStoreSettings } from "@/lib/settings/store";
import { t } from "@/lib/i18n/sq";

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getStoreSettings();
  const company = settings.company;
  const phoneHref = `tel:${company.phone.replace(/\s+/g, "")}`;

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-sm font-semibold">
            {company.name}
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
            <a href={`mailto:${company.email}`} className="hover:text-foreground">
              {company.email}
            </a>
            <a href={phoneHref} className="hover:text-foreground">
              {company.phone}
            </a>
            <p>{company.address}</p>
          </div>
        </div>
        <nav aria-label={t("footer.nav")} className="flex flex-col gap-2">
          {siteConfig.footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-sm">
          <a
            href={siteConfig.social.instagram}
            className="text-muted-foreground hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            href={siteConfig.social.facebook}
            className="text-muted-foreground hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground">
          {t("footer.copyright", { year, name: company.name })}
        </p>
      </div>
    </footer>
  );
}
