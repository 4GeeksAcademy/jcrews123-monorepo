import en from "@/lib/i18n/en.json";
import es from "@/lib/i18n/es.json";

export type Locale = "en" | "es";

export type TranslationDict = typeof en;

const dictionaries: Record<Locale, TranslationDict> = { en, es };

export function getDictionary(locale: Locale): TranslationDict {
  return dictionaries[locale];
}

export function t(dict: TranslationDict, path: string): string {
  const parts = path.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}
