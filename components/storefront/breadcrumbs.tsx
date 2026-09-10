import Link from "next/link";
import { t } from "@/lib/i18n/sq";

export type Crumb = {
  name: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs = [{ name: t("catalog.home"), href: "/" }, ...items];

  return (
    <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={`${crumb.name}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {last || !crumb.href ? (
                <span className="text-foreground">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
