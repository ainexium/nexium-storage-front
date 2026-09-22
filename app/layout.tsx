import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NEXIUM Storage — Object storage for developers",
    template: "%s — NEXIUM Storage",
  },
  description:
    "S3-compatible object storage for developers. Upload, manage and serve files via a clean REST API. Projects, buckets, API keys, webhooks.",
  metadataBase: new URL("https://console.nexiumai.io"),
  openGraph: {
    siteName: "NEXIUM Storage",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="bg-[#0a0a0f] text-gray-100 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
