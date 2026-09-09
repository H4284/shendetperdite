import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 text-foreground"
      aria-label={siteConfig.name}
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
        SP
      </span>
      <span className="hidden text-sm font-semibold tracking-tight sm:inline">
        {siteConfig.name}
      </span>
    </Link>
  );
}
