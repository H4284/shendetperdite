import Image from "next/image";
import Link from "next/link";
import liveMedia from "@/content/live-media.json";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 text-foreground"
      aria-label={siteConfig.name}
    >
      <Image
        src={liveMedia.logo}
        alt={siteConfig.name}
        width={160}
        height={40}
        className="h-8 w-auto sm:h-9"
        unoptimized
        priority
      />
    </Link>
  );
}
