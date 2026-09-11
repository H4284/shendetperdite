"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth/client";
import { t } from "@/lib/i18n/sq";
import { cn } from "cn";

const links = [
  { href: "/account", key: "account.overview" as const },
  { href: "/account/orders", key: "account.orders" as const },
  { href: "/account/addresses", key: "account.addresses" as const },
  { href: "/account/profile", key: "account.profile" as const },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.replace("/");
    router.refresh();
  }

  return (
    <nav className="flex flex-wrap gap-2 lg:flex-col" aria-label={t("account.nav")}>
      {links.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm hover:bg-muted",
              active ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            {t(link.key)}
          </Link>
        );
      })}
      <button
        type="button"
        className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
        onClick={() => void onLogout()}
      >
        {t("account.logout")}
      </button>
    </nav>
  );
}
