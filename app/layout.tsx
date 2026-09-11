import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent/cookie-consent";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Providers } from "@/components/providers";
import { SkipLink } from "@/components/skip-link";
import { siteConfig } from "@/config/site";
import { getStoreSettings } from "@/lib/settings/store";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
        </Providers>
      </body>
    </html>
  );
}
