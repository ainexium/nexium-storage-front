import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  isAppLocale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
} from "@/lib/locale";

export default getRequestConfig(async () => {
  const headerLocale = (await headers()).get(LOCALE_HEADER);
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isAppLocale(headerLocale)
    ? headerLocale
    : isAppLocale(cookieLocale)
      ? cookieLocale
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
