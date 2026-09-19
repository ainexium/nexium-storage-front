export const locales = ["en", "fr"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_HEADER = "x-nexium-locale";
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  fr: "Français",
};

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value === "en" || value === "fr";
}

export function negotiateLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) return defaultLocale;

  const parts = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    if (tag.startsWith("fr")) return "fr";
    if (tag.startsWith("en")) return "en";
  }

  return defaultLocale;
}

export function persistLocale(locale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.lang = locale;
}
