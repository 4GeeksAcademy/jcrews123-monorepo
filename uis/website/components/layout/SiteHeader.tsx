"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export function SiteHeader() {
  const pathname = usePathname();
  const current = pathname.startsWith("/application") ? "application" : "home";
  const { locale, setLocale, translate: tr } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navClass = (active: boolean) =>
    active
      ? "text-amber-800 font-semibold"
      : "text-stone-700 hover:text-amber-800";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-amber-800"
          >
            Brasaland
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            <Link href="/#home" className={navClass(current === "home")}>
              {tr("nav.home")}
            </Link>
            <Link href="/#locations" className={navClass(false)}>
              {tr("nav.locations")}
            </Link>
            <Link href="/#menu" className={navClass(false)}>
              {tr("nav.menu")}
            </Link>
            <Link
              href="/application"
              className={navClass(current === "application")}
            >
              {tr("nav.brasaPoints")}
            </Link>
            <Link href="/#contact" className={navClass(false)}>
              {tr("nav.contact")}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-md border border-stone-300">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-3 py-1.5 text-sm font-medium ${locale === "en" ? "bg-amber-700 text-white" : "text-stone-700"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("es")}
                className={`px-3 py-1.5 text-sm font-medium ${locale === "es" ? "bg-amber-700 text-white" : "text-stone-700"}`}
              >
                ES
              </button>
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-stone-700 hover:bg-stone-100 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
            >
              Menu
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-stone-100 pb-4 lg:hidden">
            <ul className="flex flex-col gap-2 pt-4">
              <li>
                <Link href="/#home" className="block rounded px-2 py-2">
                  {tr("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/application" className="block rounded px-2 py-2">
                  {tr("nav.brasaPoints")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
