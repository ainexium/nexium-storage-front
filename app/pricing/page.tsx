import Link from "next/link";
import {
  ArrowRight, Check, RefreshCw, ShieldCheck, HardDrive,
  UserX, Zap, CreditCard, Globe,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AnimInView } from "@/components/anim-in-view";
import { NavAuth } from "@/components/nav-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — NEXIUM Storage",
  description: "Simple, transparent pricing for NEXIUM Storage. Start free, scale at your pace. Pay via mobile money from West Africa.",
};

/* ── Static plan data ───────────────────────────────────── */
const PLANS = [
  { slug: "free",     priceXOF: 0,     recommended: false },
  { slug: "starter",  priceXOF: 2500,  recommended: false },
  { slug: "pro",      priceXOF: 6000,  recommended: true  },
  { slug: "business", priceXOF: 15000, recommended: false },
] as const;

const ADDONS = [
  { gb: 50,  priceXOF: 1500  },
  { gb: 100, priceXOF: 2800  },
  { gb: 250, priceXOF: 6500  },
  { gb: 500, priceXOF: 12000 },
];

const COUNTRIES = [
  { flag: "🇨🇮", name: "Côte d'Ivoire", currency: "XOF" },
  { flag: "🇸🇳", name: "Sénégal",        currency: "XOF" },
  { flag: "🇲🇱", name: "Mali",           currency: "XOF" },
  { flag: "🇧🇫", name: "Burkina Faso",   currency: "XOF" },
  { flag: "🇹🇬", name: "Togo",           currency: "XOF" },
  { flag: "🇧🇯", name: "Bénin",          currency: "XOF" },
  { flag: "🇳🇪", name: "Niger",          currency: "XOF" },
  { flag: "🇬🇳", name: "Guinée",         currency: "GNF" },
  { flag: "🇨🇲", name: "Cameroun",       currency: "XAF" },
  { flag: "🇨🇬", name: "Congo",          currency: "XAF" },
  { flag: "🇬🇦", name: "Gabon",          currency: "XAF" },
  { flag: "🇬🇭", name: "Ghana",          currency: "GHS" },
];

const PAYMENT_METHODS = ["Wave", "Orange Money", "MTN Mobile Money", "Free Money", "Moov Money", "Airtel Money"];

function fmt(xof: number) {
  return new Intl.NumberFormat("fr-FR").format(xof);
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  const howItems = [
    { Icon: RefreshCw,  title: t("how1Title"), body: t("how1Body") },
    { Icon: ShieldCheck, title: t("how2Title"), body: t("how2Body") },
    { Icon: HardDrive,  title: t("how3Title"), body: t("how3Body") },
    { Icon: UserX,      title: t("how4Title"), body: t("how4Body") },
  ];

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
  ];

  return (
    <main className="themed-page min-h-screen bg-[var(--lp-bg)] text-white overflow-x-hidden">

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <header className="lp-header fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/[0.06]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-[14px] sm:text-[17px] whitespace-nowrap shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9b3dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
            <span className="text-[#9b3dff]">NEXIUM</span>
            <span className="text-gray-500 font-normal">/ storage</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher />
            <NavAuth />
          </div>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="glow-blue-hero" />
        <div className="grid-dark" />
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <AnimInView>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9b3dff]/30 bg-[#9b3dff]/10 text-[#9b3dff] text-[12px] font-medium mb-6">
              {t("eyebrow")}
            </div>
          </AnimInView>
          <AnimInView delay={60}>
            <h1
              className="font-medium leading-[1.08] tracking-[-0.03em] mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
            >
              {t("title")}
            </h1>
          </AnimInView>
          <AnimInView delay={120}>
            <p className="text-[17px] text-gray-400 leading-[1.65]">
              {t("subtitle")}
            </p>
          </AnimInView>
        </div>
      </section>

      {/* ── PLAN CARDS ──────────────────────────────────────── */}
      <section className="relative pb-28 px-6 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(({ slug, priceXOF, recommended }, i) => {
              const planT = t.raw(`plans.${slug}`) as {
                tagline: string; storage: string; maxFile: string; support: string; features: string[];
              };
              const isFree = priceXOF === 0;
              return (
                <AnimInView key={slug} delay={i * 70}>
                  <div className={`relative flex flex-col h-full rounded-2xl border p-7 transition-all ${
                    recommended
                      ? "border-[#9b3dff]/50 bg-[#9b3dff]/[0.04]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                  }`}>
                    {recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#9b3dff] text-white text-[11px] font-semibold">
                          <Zap size={10} /> {t("recommended")}
                        </span>
                      </div>
                    )}

                    {/* Name + tagline */}
                    <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${recommended ? "text-[#9b3dff]" : "text-gray-500"}`}>
                      {slug.charAt(0).toUpperCase() + slug.slice(1)}
                    </p>
                    <p className="text-[13px] text-gray-500 mb-6">{planT.tagline}</p>

                    {/* Price */}
                    <div className="mb-8">
                      {isFree ? (
                        <span className="text-[2.4rem] font-bold tracking-tight leading-none">{t("freeLabel")}</span>
                      ) : (
                        <div className="flex items-end gap-1.5">
                          <span className="text-[2.4rem] font-bold tracking-tight leading-none">
                            {fmt(priceXOF)}
                          </span>
                          <span className="text-[13px] text-gray-500 mb-1.5">XOF {t("monthLabel")}</span>
                        </div>
                      )}
                    </div>

                    {/* Specs */}
                    <div className="space-y-2.5 mb-7">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">{t("planStorage")}</span>
                        <span className="font-medium">{planT.storage}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">{t("planMaxFile")}</span>
                        <span className="font-medium">{planT.maxFile}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">{t("planProjects")}</span>
                        <span className="font-medium">{t("unlimited")}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">{t("planSupport")}</span>
                        <span className="font-medium">{planT.support}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.06] pt-5 mb-7 space-y-2.5">
                      {planT.features.map((f) => (
                        <div key={f} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                          <Check size={13} className="text-[#9b3dff] mt-0.5 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <Link
                        href={isFree ? "/register" : "/register"}
                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-semibold transition ${
                          recommended
                            ? "bg-[#9b3dff] hover:bg-[#aa55ff] text-white"
                            : "border border-white/[0.12] hover:border-[#9b3dff]/50 hover:text-[#9b3dff] text-gray-300"
                        }`}
                      >
                        {isFree ? t("ctaFree") : t("ctaPaid")} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </AnimInView>
              );
            })}
          </div>

          {/* Already have account */}
          <AnimInView>
            <p className="text-center text-[13px] text-gray-600 mt-6">
              {t("loginNote")}{" "}
              <Link href="/login" className="text-[#9b3dff] hover:text-[#aa55ff] transition">
                {t("loginLink")}
              </Link>
            </p>
          </AnimInView>
        </div>
      </section>

      {/* ── PAY FROM YOUR COUNTRY ───────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="glow-blue-right" />
        <div className="grid-dark" />
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <AnimInView className="max-w-xl mb-12">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("countriesEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em] mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              {t("countriesTitle")}
            </h2>
            <p className="text-[16px] text-gray-400 leading-[1.65]">
              {t("countriesBody")}
            </p>
          </AnimInView>

          {/* Countries marquee */}
          <div className="overflow-hidden mb-10">
            <div className="flex gap-3 w-max animate-marquee">
              {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                <div
                  key={i}
                  className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] transition"
                >
                  <span className="text-2xl leading-none">{c.flag}</span>
                  <div>
                    <p className="text-[12px] font-medium text-gray-200 leading-tight">{c.name}</p>
                    <p className="text-[10px] text-gray-600 font-mono">{c.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment methods */}
          <AnimInView>
            <p className="text-[12px] text-gray-600 uppercase tracking-widest font-semibold mb-4">
              {t("countriesPayWith")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {PAYMENT_METHODS.map((m) => (
                <span
                  key={m}
                  className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[13px] text-gray-400"
                >
                  {m}
                </span>
              ))}
            </div>
          </AnimInView>
        </div>
      </section>

      {/* ── HOW BILLING WORKS ───────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="grid-dark" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <AnimInView className="mb-14">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("howEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              {t("howTitle")}
            </h2>
          </AnimInView>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItems.map(({ Icon, title, body }, i) => (
              <AnimInView key={title} delay={i * 70}>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 h-full">
                  <div className="w-9 h-9 rounded-lg bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center mb-5">
                    <Icon size={16} className="text-[#9b3dff]" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-2">{title}</h3>
                  <p className="text-[13px] text-gray-500 leading-[1.65]">{body}</p>
                </div>
              </AnimInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORAGE ADD-ONS ─────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="glow-blue-bottom" />
        <div className="grid-dark" />
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <div className="lg:flex lg:items-end lg:justify-between mb-12">
            <AnimInView>
              <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
                {t("addonsEyebrow")}
              </p>
              <h2
                className="font-medium leading-[1.12] tracking-[-0.03em] mb-3"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
              >
                {t("addonsTitle")}
              </h2>
              <p className="text-[16px] text-gray-400 leading-[1.65] max-w-md">
                {t("addonsBody")}
              </p>
            </AnimInView>
            <AnimInView delay={80}>
              <span className="inline-flex items-center gap-1.5 mt-6 lg:mt-0 px-3 py-1.5 rounded-lg border border-[#9b3dff]/25 bg-[#9b3dff]/[0.06] text-[#9b3dff] text-[12px] font-medium">
                <HardDrive size={12} /> {t("addonsNote")}
              </span>
            </AnimInView>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ADDONS.map(({ gb, priceXOF }, i) => (
              <AnimInView key={gb} delay={i * 60}>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-[#9b3dff]/30 transition p-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-[2rem] font-bold tracking-tight">+{gb}</span>
                    <span className="text-[14px] text-gray-400 mt-1">GB</span>
                  </div>
                  <p className="text-[13px] text-[#9b3dff] font-semibold">
                    {fmt(priceXOF)} XOF <span className="text-gray-600 font-normal">{t("addonsPerMonth")}</span>
                  </p>
                </div>
              </AnimInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="grid-dark" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">

          <AnimInView className="mb-12 text-center">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("faqEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              {t("faqTitle")}
            </h2>
          </AnimInView>

          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <AnimInView key={i} delay={i * 50}>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <p className="text-[14px] font-semibold text-white mb-2">{q}</p>
                  <p className="text-[14px] text-gray-500 leading-[1.65]">{a}</p>
                </div>
              </AnimInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="glow-blue-center" />
        <div className="grid-dark" />
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          <AnimInView>
            <div className="rounded-2xl border border-white/[0.12] bg-[var(--lp-bg-deep)] px-10 md:px-20 py-10 md:py-12 text-center">
              <h2
                className="font-medium leading-[1.12] tracking-[-0.03em] mb-5"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
              >
                {t("ctaTitle")}
              </h2>
              <p className="text-[16px] text-gray-400 mb-8 leading-[1.65]">
                {t("ctaBody")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
                >
                  {t("ctaBtn")} <ArrowRight size={15} />
                </Link>
                <Link
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/[0.1] hover:border-white/20 rounded-lg text-[14px] font-semibold text-gray-300 hover:text-white transition"
                >
                  Documentation
                </Link>
              </div>
            </div>
          </AnimInView>
        </div>
      </section>

      {/* ── FOOTER MINI ─────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[12px] text-white/25">
            © {new Date().getFullYear()}{" "}
            <a href="https://nexiumai.io" target="_blank" rel="noopener noreferrer" className="text-[#9b3dff] hover:text-[#aa55ff] transition">
              NEXIUM.AI
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12px] text-white/30 hover:text-white transition">Home</Link>
            <Link href="/docs" target="_blank" className="text-[12px] text-white/30 hover:text-white transition">Docs</Link>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </main>
  );
}
