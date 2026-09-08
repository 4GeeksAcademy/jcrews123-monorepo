"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getDictionary,
  t,
  type Locale,
  type TranslationDict,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  dict: TranslationDict;
  setLocale: (locale: Locale) => void;
  translate: (path: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("brasaland-lang");
    if (saved === "en" || saved === "es") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem("brasaland-lang", next);
    document.documentElement.lang = next === "es" ? "es" : "en";
  }, []);

  const dict = useMemo(() => getDictionary(locale), [locale]);

  const translate = useCallback((path: string) => t(dict, path), [dict]);

  const value = useMemo(
    () => ({ locale, dict, setLocale, translate }),
    [locale, dict, setLocale, translate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
