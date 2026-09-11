"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/lib/auth/use-user";
import { logout } from "@/lib/auth/client";
import { t } from "@/lib/i18n/sq";

export function AccountMenu() {
  const { user, ready, isAdmin } = useAuthUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!ready) {
    return <div className="size-8" />;
  }

  if (!user) {
    return (
      <Button variant="ghost" nativeButton={false} render={<Link href="/login?next=/account" />}>
        {t("auth.login")}
      </Button>
    );
  }

  const initial = (user.displayName || user.email || "?").slice(0, 1).toUpperCase();

  return (
    <div ref={root} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("account.menu")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="size-6 rounded-full" />
        ) : (
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {initial}
          </span>
        )}
        <UserRound className="sr-only" />
      </Button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border bg-popover p-1 shadow-md">
          <Link
            href="/account"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            {t("account.mine")}
          </Link>
          <Link
            href="/account/orders"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            {t("account.orders")}
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {t("admin.title")}
            </Link>
          ) : null}
          <button
            type="button"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
            onClick={async () => {
              setOpen(false);
              await logout();
              router.replace("/");
              router.refresh();
            }}
          >
            {t("account.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
