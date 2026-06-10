import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "ar", "fr", "en"],
  defaultLocale: "de",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  ar: "العربية",
  fr: "Français",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  de: "🇩🇪",
  ar: "🇲🇦",
  fr: "🇫🇷",
  en: "🇬🇧",
};

export const rtlLocales: Locale[] = ["ar"];
