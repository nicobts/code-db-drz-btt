export const locales = ["en", "es", "de", "it"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
};
