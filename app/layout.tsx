import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/contexts/theme-context";
import { AppThemeToggle } from "@/components/app-theme-toggle";

const roobert = localFont({
  src: [
    { path: "../public/fonts/RoobertTRIAL-Regular.otf",  weight: "400", style: "normal" },
    { path: "../public/fonts/RoobertTRIAL-Medium.otf",   weight: "500", style: "normal" },
    { path: "../public/fonts/RoobertTRIAL-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/RoobertTRIAL-Bold.otf",     weight: "700", style: "normal" },
  ],
  variable: "--font-roobert",
  display: "swap",
});

const pangram = localFont({
  src: [
    { path: "../public/fonts/Pangram-Light.otf",   weight: "300", style: "normal" },
    { path: "../public/fonts/Pangram-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Pangram-Medium.otf",  weight: "500", style: "normal" },
    { path: "../public/fonts/Pangram-Bold.otf",    weight: "700", style: "normal" },
  ],
  variable: "--font-pangram",
  display: "swap",
});

const roobertMono = localFont({
  src: [
    { path: "../public/fonts/RoobertMonoTRIAL-Regular.otf",  weight: "400", style: "normal" },
    { path: "../public/fonts/RoobertMonoTRIAL-Medium.otf",   weight: "500", style: "normal" },
    { path: "../public/fonts/RoobertMonoTRIAL-SemiBold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-roobert-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXIUM Storage — Cloud storage for your projects & teams",
    template: "%s — NEXIUM Storage",
  },
  description:
    "S3-compatible cloud object storage. An intuitive dashboard to manage your files, a REST API to integrate them. Projects, buckets, API keys, webhooks.",
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
    <html lang={locale} className={`dark ${roobert.variable} ${pangram.variable} ${roobertMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("nx-storage-theme");var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(dark){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark");}else{document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-theme","light");}}catch(e){}` }} />
      </head>
      <body className="bg-[#0a0a0f] text-gray-100 antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
          <AppThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
