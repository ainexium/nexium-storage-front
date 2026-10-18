import Link from "next/link";
import { RefreshCw, ShieldCheck, HardDrive, UserX, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AnimInView } from "@/components/anim-in-view";
import { NavAuth } from "@/components/nav-auth";
import { LandingNavLinks } from "@/components/landing-nav-links";
import { LandingFooter } from "@/components/landing-footer";
import { PricingPlans, PricingCTA } from "@/components/pricing-plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — NEXIUM Storage",
  description: "Simple, transparent pricing for NEXIUM Storage. Start free, scale at your pace. Pay via mobile money from West Africa.",
};

/* ── Add-ons ────────────────────────────────────────────── */
const ADDONS = [
  { gb: 50,  priceXOF: 1500  },
  { gb: 100, priceXOF: 2800  },
  { gb: 250, priceXOF: 6500  },
  { gb: 500, priceXOF: 12000 },
];

/* ── Country rows for marquee (3 rows) ──────────────────── */
const COUNTRIES_R1 = [
  { flag: "🇨🇮", name: "Côte d'Ivoire", cur: "XOF" },
  { flag: "🇸🇳", name: "Sénégal",        cur: "XOF" },
  { flag: "🇲🇱", name: "Mali",           cur: "XOF" },
  { flag: "🇧🇫", name: "Burkina Faso",   cur: "XOF" },
];
const COUNTRIES_R2 = [
  { flag: "🇹🇬", name: "Togo",           cur: "XOF" },
  { flag: "🇧🇯", name: "Bénin",          cur: "XOF" },
  { flag: "🇳🇪", name: "Niger",          cur: "XOF" },
  { flag: "🇬🇳", name: "Guinée",         cur: "GNF" },
];
const COUNTRIES_R3 = [
  { flag: "🇨🇲", name: "Cameroun",       cur: "XAF" },
  { flag: "🇨🇬", name: "Congo",          cur: "XAF" },
  { flag: "🇬🇦", name: "Gabon",          cur: "XAF" },
  { flag: "🇬🇭", name: "Ghana",          cur: "GHS" },
];

function CountryBadge({ flag, name, cur }: { flag: string; name: string; cur: string }) {
  return (
    <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <span className="text-2xl leading-none">{flag}</span>
      <div>
        <p className="text-[12px] font-medium text-gray-200 leading-tight whitespace-nowrap">{name}</p>
        <p className="text-[10px] text-gray-600 font-mono">{cur}</p>
      </div>
    </div>
  );
}

function fmt(xof: number) {
  return new Intl.NumberFormat("fr-FR").format(xof);
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  const howItems = [
    { Icon: RefreshCw,   title: t("how1Title"), body: t("how1Body") },
    { Icon: ShieldCheck, title: t("how2Title"), body: t("how2Body") },
    { Icon: HardDrive,   title: t("how3Title"), body: t("how3Body") },
    { Icon: UserX,       title: t("how4Title"), body: t("how4Body") },
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
            <LandingNavLinks />
            <LanguageSwitcher />
            <NavAuth />
          </div>
        </nav>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
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
            <h1 className="font-medium leading-[1.08] tracking-[-0.03em] mb-5" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
              {t("title")}
            </h1>
          </AnimInView>
          <AnimInView delay={120}>
            <p className="text-[17px] text-gray-400 leading-[1.65]">{t("subtitle")}</p>
          </AnimInView>
        </div>
      </section>

      {/* ── PLAN CARDS (client — country-aware) ─────────────── */}
      <PricingPlans />

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
            <h2 className="font-medium leading-[1.12] tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
              {t("countriesTitle")}
            </h2>
            <p className="text-[16px] text-gray-400 leading-[1.65]">{t("countriesBody")}</p>
          </AnimInView>

          {/* 3-row marquee */}
          <div className="overflow-hidden space-y-3">
            {/* Row 1 → */}
            <div className="flex gap-3 w-max animate-marquee">
              {[...COUNTRIES_R1, ...COUNTRIES_R1, ...COUNTRIES_R1, ...COUNTRIES_R1].map((c, i) => (
                <CountryBadge key={i} {...c} />
              ))}
            </div>
            {/* Row 2 ← (reverse) */}
            <div className="flex gap-3 w-max animate-marquee-reverse">
              {[...COUNTRIES_R2, ...COUNTRIES_R2, ...COUNTRIES_R2, ...COUNTRIES_R2].map((c, i) => (
                <CountryBadge key={i} {...c} />
              ))}
            </div>
            {/* Row 3 → (same as row 1) */}
            <div className="flex gap-3 w-max animate-marquee">
              {[...COUNTRIES_R3, ...COUNTRIES_R3, ...COUNTRIES_R3, ...COUNTRIES_R3].map((c, i) => (
                <CountryBadge key={i} {...c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW BILLING WORKS ───────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="grid-dark" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <AnimInView className="mb-14">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">{t("howEyebrow")}</p>
            <h2 className="font-medium leading-[1.12] tracking-[-0.03em]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
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
              <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">{t("addonsEyebrow")}</p>
              <h2 className="font-medium leading-[1.12] tracking-[-0.03em] mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
                {t("addonsTitle")}
              </h2>
              <p className="text-[16px] text-gray-400 leading-[1.65] max-w-md">{t("addonsBody")}</p>
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
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">{t("faqEyebrow")}</p>
            <h2 className="font-medium leading-[1.12] tracking-[-0.03em]" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
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

      {/* ── CTA (client — auth-aware) ────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="glow-blue-center" />
        <div className="grid-dark" />
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          <AnimInView>
            <PricingCTA
              title={t("ctaTitle")}
              body={t("ctaBody")}
              btnFree={t("ctaBtn")}
              btnDash={t("ctaDashBtn")}
            />
          </AnimInView>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <LandingFooter />
    </main>
  );
}
