import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { SentryInit } from "@/components/analytics/sentry-init";
import { CookieConsent } from "@/components/cookie-consent/cookie-consent";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Providers } from "@/components/providers";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { SkipLink } from "@/components/skip-link";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/site-url";
import { getStoreSettings } from "@/lib/settings/store";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: "sq_AL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  return (
    <html
      lang="sq"
      suppressHydrationWarning
      className={instrumentSans.variable}
    >
      <body className="font-sans antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Providers settings={settings}>
          <div className="flex min-h-dvh flex-col">
            <SkipLink />
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </div>
          <AnalyticsScripts />
          <SentryInit />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
