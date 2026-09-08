import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/LanguageProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brasaland | Grilled Food in Colombia & Florida",
  description:
    "Brasaland grilled food restaurant chain since 2008. 14 locations in Colombia and Florida. Join Brasa Points loyalty program.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-700 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
