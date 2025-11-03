import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Get the current locale from cookies (server-side)
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");

  if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
    return localeCookie.value as Locale;
  }

  return defaultLocale;
}

/**
 * Set locale cookie (server action)
 */
export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
