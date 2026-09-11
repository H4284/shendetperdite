import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/site-url";

export function pageMetadata(input: {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const description = input.description ?? siteConfig.description;
  const url = absoluteUrl(input.path);
  const image = input.image ?? absoluteUrl("/opengraph-image");

  return {
    title: input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "sq_AL",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [image],
    },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
  };
}
