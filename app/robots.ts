import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/account/", "/checkout", "/api/", "/login", "/register"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
