import Link from "next/link";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n/sq";

export function MegaMenu() {
  return (
    <ul className="mx-auto flex max-w-7xl items-stretch justify-center gap-1 px-4">
      {siteConfig.nav.map((item) => (
        <li key={item.slug} className="group relative">
          <button
            type="button"
            className="flex h-11 items-center px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            aria-haspopup="true"
          >
            {item.name}
          </button>
          <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="rounded-xl border bg-popover p-3 shadow-lg">
              {item.hasLanding ? (
                <Link
                  href={`/categories/${item.slug}`}
                  className="mb-2 block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {t("nav.viewAll", { name: item.name })}
                </Link>
              ) : null}
              <ul className="flex flex-col">
                {item.children.map((child) => (
                  <li key={child.slug}>
                    <Link
                      href={`/categories/${child.slug}`}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
