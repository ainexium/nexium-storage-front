import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthRedirect } from "@/components/auth-redirect";
import type { Metadata } from "next";

const CONTACT_EMAIL = "ai.nexium@gmail.com";
const CONTACT_WHATSAPP = "+2250503020385";

export const metadata: Metadata = {
  title: "NEXIUM Storage — Object storage for developers",
  description:
    "Upload, manage and serve files via a clean REST API. S3-compatible object storage with projects, buckets, API keys and webhooks. Built for developers.",
  keywords: ["nexium storage", "object storage", "s3 compatible", "file upload api", "cloud storage", "nexium"],
  openGraph: {
    title: "NEXIUM Storage — Object storage for developers",
    description:
      "Upload, manage and serve files via a clean REST API. S3-compatible object storage built for developers.",
    url: "https://console.nexiumai.io",
    siteName: "NEXIUM Storage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXIUM Storage — Object storage for developers",
    description:
      "Upload, manage and serve files via a clean REST API. S3-compatible object storage built for developers.",
  },
  alternates: {
    canonical: "https://console.nexiumai.io",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <main className="min-h-screen flex flex-col bg-[#08080f] text-white">
      <AuthRedirect />

      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06]">
        <span className="font-bold tracking-tight whitespace-nowrap shrink-0">
          <span className="text-[#007BFF]">NEXIUM</span>
          <span className="text-gray-400 font-normal text-sm ml-1.5">/ storage</span>
        </span>
        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition"
            title={t("contactTitle")}
          >
            <Mail size={13} />
            {t("contact")}
          </a>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">
            {t("logIn")}
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 text-sm bg-[#007BFF] hover:bg-blue-500 rounded-md font-medium transition"
          >
            {t("getStarted")}
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#007BFF]/30 bg-[#007BFF]/10 text-[#007BFF] text-xs font-medium">
          {t("badge")}
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          {t("heroTitle")}{" "}
          <span className="text-[#007BFF]">{t("heroAccent")}</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
          {t("heroBody")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="px-6 py-3 bg-[#007BFF] hover:bg-blue-500 rounded-lg font-semibold transition"
          >
            {t("createAccount")}
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 border border-white/[0.1] hover:border-white/20 rounded-lg font-semibold text-gray-300 hover:text-white transition"
          >
            {t("readDocs")}
          </Link>
        </div>

        <div className="mt-8 w-full max-w-2xl rounded-xl border border-white/[0.07] bg-white/[0.03] p-6 text-left font-mono text-sm">
          <div className="flex gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <p className="text-gray-600">{t("uploadComment")}</p>
          <p className="text-gray-300 mt-2">
            <span className="text-[#007BFF]">curl</span>{" "}
            <span className="text-green-400">-X POST</span> \
          </p>
          <p className="text-gray-300 pl-4">
            <span className="text-yellow-400">-H</span>{" "}
            <span className="text-orange-300">&quot;Authorization: Bearer nx_live_...&quot;</span> \
          </p>
          <p className="text-gray-300 pl-4">
            <span className="text-yellow-400">-F</span>{" "}
            <span className="text-orange-300">&quot;file=@photo.jpg&quot;</span> \
          </p>
          <p className="text-gray-300 pl-4">
            <span className="text-gray-500">https://api.nexiumai.io/v1/ext/buckets/&lt;id&gt;/files</span>
          </p>
        </div>
      </section>

      <div className="border-t border-white/[0.06] py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { label: t("statEndpoints"), value: "15+" },
            { label: t("statUptime"), value: "99.9%" },
            { label: t("statBackend"), value: "R2" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[#007BFF]">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/[0.06] py-10 px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-bold text-sm tracking-tight">
              <span className="text-[#007BFF]">NEXIUM</span>
              <span className="text-gray-500 font-normal ml-1.5">/ storage</span>
            </span>
            <p className="text-xs text-gray-600 mt-1">
              {t("rights", { year: new Date().getFullYear() })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-500">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-1.5 hover:text-gray-300 transition"
            >
              <Mail size={12} />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gray-300 transition"
            >
              <MessageCircle size={12} />
              {CONTACT_WHATSAPP}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
