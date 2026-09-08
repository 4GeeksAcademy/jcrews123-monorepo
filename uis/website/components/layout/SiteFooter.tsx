"use client";

import { useI18n } from "@/lib/i18n/LanguageProvider";

export function SiteFooter() {
  const { translate: tr } = useI18n();

  return (
    <footer className="bg-stone-900 py-8 text-stone-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>{tr("footer.copyright")}</p>
        <div className="flex gap-6">
          <a
            href="https://instagram.com/brasaland"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {tr("footer.instagram")}
          </a>
          <a
            href="https://facebook.com/brasaland"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            {tr("footer.facebook")}
          </a>
        </div>
      </div>
    </footer>
  );
}
