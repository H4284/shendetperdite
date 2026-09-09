import dynamic from "next/dynamic";
import { t } from "@/lib/i18n/sq";
import { CartButton } from "@/components/header/cart-button";
import { Logo } from "@/components/header/logo";
import { MegaMenu } from "@/components/header/mega-menu";
import { SearchCommand } from "@/components/header/search-command";
import { ThemeToggle } from "@/components/header/theme-toggle";

const MobileNav = dynamic(() =>
  import("./mobile-nav").then((mod) => mod.MobileNav),
);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 md:gap-4">
        <MobileNav />
        <Logo />
        <SearchCommand />
        <div className="flex items-center gap-1">
          <CartButton />
          <ThemeToggle />
        </div>
      </div>
      <nav
        aria-label={t("header.primaryNav")}
        className="hidden border-t md:block"
      >
        <MegaMenu />
      </nav>
    </header>
  );
}
