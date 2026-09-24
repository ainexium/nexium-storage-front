import Link from "next/link";
import {
  Mail, ArrowRight, ExternalLink,
  Package, Key, Link2, Zap, LayoutDashboard, Cloud,
  Shield, Lock, Server, Globe, Upload,
  FolderOpen, BarChart2, Plus, ChevronRight, Copy,
  Users, Code2, Check,
} from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthRedirect } from "@/components/auth-redirect";
import { AnimInView } from "@/components/anim-in-view";
import { CtaFloatingLogos } from "@/components/cta-floating-logos";
import { NavMobile } from "@/components/nav-mobile";
import { techStyle } from "@/lib/tech-colors";
import { TECH_PATHS } from "@/lib/tech-icons";
import type { Metadata } from "next";

const CONTACT_EMAIL = "ai.nexium@gmail.com";
const CONTACT_WHATSAPP = "+2250503020385";

/* ── Marquee rows ─────────────────────────────────────────── */
const LANG_ROW = ["Node.js", "Python", "Go", "PHP", "Ruby", "Java", "Rust", "Swift", "Kotlin", "Dart", ".NET", "Elixir"];
const FW_ROW   = ["Next.js", "React", "Vue", "Django", "Laravel", "Express", "FastAPI", "Flutter", "Spring", "Nuxt", "NestJS", "Rails"];

export const metadata: Metadata = {
  title: "NEXIUM Storage — Cloud storage for your projects & teams",
  description:
    "S3-compatible cloud object storage. An intuitive dashboard to manage your files, a REST API to integrate them. Projects, buckets, API keys and webhooks.",
  keywords: ["nexium storage", "object storage", "s3 compatible", "file upload api", "cloud storage"],
  openGraph: {
    title: "NEXIUM Storage — Cloud storage for your projects & teams",
    description: "S3-compatible cloud object storage. Intuitive dashboard, REST API, projects, buckets, API keys.",
    url: "https://console.nexiumai.io",
    siteName: "NEXIUM Storage",
    type: "website",
    images: [
      {
        url: "https://console.nexiumai.io/icon.svg",
        width: 512,
        height: 512,
        alt: "NEXIUM Storage",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "NEXIUM Storage — Cloud storage for your projects & teams",
    description: "S3-compatible cloud object storage. Intuitive dashboard, REST API, projects, buckets, API keys.",
    images: ["https://console.nexiumai.io/icon.svg"],
  },
  alternates: { canonical: "https://console.nexiumai.io" },
  robots: { index: true, follow: true },
};

export default async function LandingPage() {
  const t = await getTranslations("landing");

  const manageFeatures = [
    { label: t("manageF1Label"), desc: t("manageF1Desc") },
    { label: t("manageF2Label"), desc: t("manageF2Desc") },
    { label: t("manageF3Label"), desc: t("manageF3Desc") },
    { label: t("manageF4Label"), desc: t("manageF4Desc") },
    { label: t("manageF5Label"), desc: t("manageF5Desc") },
    { label: t("manageF6Label"), desc: t("manageF6Desc") },
  ];

  const steps = [
    { n: "01", title: t("howStep1Title"), body: t("howStep1Body") },
    { n: "02", title: t("howStep2Title"), body: t("howStep2Body") },
    { n: "03", title: t("howStep3Title"), body: t("howStep3Body") },
  ];

  const builders = [
    { Icon: Package,         title: t("feat1Title"), body: t("feat1Body") },
    { Icon: Key,             title: t("feat2Title"), body: t("feat2Body") },
    { Icon: Link2,           title: t("feat3Title"), body: t("feat3Body") },
    { Icon: Zap,             title: t("feat4Title"), body: t("feat4Body") },
    { Icon: LayoutDashboard, title: t("feat5Title"), body: t("feat5Body") },
    { Icon: Cloud,           title: t("feat6Title"), body: t("feat6Body") },
    { Icon: Upload,          title: t("feat7Title"), body: t("feat7Body") },
    { Icon: Globe,           title: t("feat8Title"), body: t("feat8Body") },
  ];

  const security = [
    { Icon: Key,    title: t("secure1Title"), body: t("secure1Body") },
    { Icon: Shield, title: t("secure2Title"), body: t("secure2Body") },
    { Icon: Lock,   title: t("secure3Title"), body: t("secure3Body") },
    { Icon: Server, title: t("secure4Title"), body: t("secure4Body") },
    { Icon: Zap,    title: t("secure5Title"), body: t("secure5Body") },
    { Icon: Globe,  title: t("secure6Title"), body: t("secure6Body") },
  ];

  return (
    <main className="themed-page min-h-screen bg-[var(--lp-bg)] text-white overflow-x-hidden">
      <AuthRedirect />

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <header className="lp-header fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/[0.06]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-bold tracking-tight text-[14px] sm:text-[17px] whitespace-nowrap shrink-0">
            <span className="text-[#9b3dff]">NEXIUM</span>
            <span className="text-gray-500 font-normal ml-1">/ storage</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher />
            {/* Desktop nav links — masqués sous 403px */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden min-[490px]:flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-300 transition"
              title={t("contactTitle")}
            >
              <Mail size={12} />
              {t("contact")}
            </a>
            <Link href="/login" className="hidden min-[490px]:block text-[14px] text-gray-400 hover:text-white transition">
              {t("logIn")}
            </Link>
            <Link
              href="/register"
              className="hidden min-[490px]:block px-3.5 py-1.5 text-[14px] bg-[#9b3dff] hover:bg-[#aa55ff] rounded-md font-semibold transition"
            >
              {t("getStarted")}
            </Link>
            {/* Burger — visible uniquement sous 403px */}
            <NavMobile />
          </div>
        </nav>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-28 overflow-hidden">
        <div className="glow-blue-hero" />
        <div className="grid-dark" />
        <div className="noise-overlay" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">

          <AnimInView>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9b3dff]/30 bg-[#9b3dff]/10 text-[#9b3dff] text-[12px] font-medium mb-8">
              {t("badge")}
            </div>
          </AnimInView>

          <AnimInView delay={70}>
            <h1
              className="font-medium leading-[1.08] tracking-[-0.03em] mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
            >
              {t("heroTitle")}{" "}
              <span className="text-[#9b3dff]">{t("heroAccent")}</span>
            </h1>
          </AnimInView>

          <AnimInView delay={140}>
            <p className="text-[17px] text-gray-400 max-w-xl leading-[1.65] mb-10">
              {t("heroBody")}
            </p>
          </AnimInView>

          <AnimInView delay={200}>
            <div className="flex flex-col sm:flex-row gap-3 mb-16">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
              >
                {t("createAccount")} <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/[0.1] hover:border-white/20 rounded-lg text-[14px] font-semibold text-gray-300 hover:text-white transition"
              >
                {t("readDocs")}
              </Link>
            </div>
          </AnimInView>

          <AnimInView delay={280} className="w-full max-w-2xl">
            <HeroVisual
              tabDashboard={t("heroTabDashboard")}
              tabApi={t("heroTabApi")}
              dragText={t("heroDragText")}
              dragSubPre={t("heroDragSubPre")}
              dragSubPost={t("heroDragSubPost")}
              browseLabel={t("heroBrowse")}
              uploadComment={t("uploadComment")}
            />
          </AnimInView>

        </div>
      </section>

      {/* ── PERSONAS ──────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-24 overflow-hidden">
        <div className="grid-dark" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <AnimInView className="mb-14 text-center">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("personasEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {t("personasTitle")}
            </h2>
          </AnimInView>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Persona 1 — Teams & Creatives */}
            <AnimInView delay={0}>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-7 h-full">
                <div className="w-10 h-10 rounded-lg bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center mb-5">
                  <Users size={18} className="text-[#9b3dff]" />
                </div>
                <h3 className="text-[17px] font-semibold mb-2">{t("persona1Title")}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{t("persona1Desc")}</p>
                <ul className="space-y-2.5">
                  {[t("persona1F1"), t("persona1F2"), t("persona1F3")].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                      <Check size={14} className="text-[#9b3dff] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimInView>

            {/* Persona 2 — Developers */}
            <AnimInView delay={100}>
              <div className="rounded-xl border border-[#9b3dff]/20 bg-[#9b3dff]/[0.03] p-7 h-full">
                <div className="w-10 h-10 rounded-lg bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center mb-5">
                  <Code2 size={18} className="text-[#9b3dff]" />
                </div>
                <h3 className="text-[17px] font-semibold mb-2">{t("persona2Title")}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{t("persona2Desc")}</p>
                <ul className="space-y-2.5">
                  {[t("persona2F1"), t("persona2F2"), t("persona2F3")].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                      <Check size={14} className="text-[#9b3dff] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimInView>

            {/* Persona 3 — Startups & SMBs */}
            <AnimInView delay={200}>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-7 h-full">
                <div className="w-10 h-10 rounded-lg bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center mb-5">
                  <Zap size={18} className="text-[#9b3dff]" />
                </div>
                <h3 className="text-[17px] font-semibold mb-2">{t("persona3Title")}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{t("persona3Desc")}</p>
                <ul className="space-y-2.5">
                  {[t("persona3F1"), t("persona3F2"), t("persona3F3")].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                      <Check size={14} className="text-[#9b3dff] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimInView>

          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] overflow-hidden py-14">
        <div className="glow-blue-right" />
        <div className="noise-overlay" />

        {/* Mobile: colonne (texte puis marquee). Desktop: ligne avec padding aligné sur max-w-6xl */}
        <div
          className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-10"
          style={{ paddingLeft: "max(1.5rem, calc(50vw - 36rem + 1.5rem))" }}
        >
          <AnimInView animation="fade-right" className="shrink-0 md:w-[260px]">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-3">
              {t("stackEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.15] tracking-[-0.025em] mb-5"
              style={{ fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)" }}
            >
              {t("stackTitle")}
            </h2>
            <Link
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] text-gray-400 hover:text-white border border-white/[0.1] hover:border-white/20 px-4 py-2 rounded-lg transition"
            >
              {t("stackLink")} <ArrowRight size={13} />
            </Link>
          </AnimInView>

          {/* Marquee rows — passe sous le texte sur mobile */}
          <div className="flex-1 min-w-0 overflow-hidden marquee-track space-y-2.5 py-1">
            <div className="flex gap-2 md:gap-3 w-max animate-marquee">
              {[...LANG_ROW, ...LANG_ROW, ...LANG_ROW, ...LANG_ROW].map((name, i) => (
                <span
                  key={i}
                  className="shrink-0 w-10 h-10 md:w-[72px] md:h-[72px] border flex items-center justify-center select-none"
                  style={techStyle(name)}
                  title={name}
                >
                  <svg className="w-5 h-5 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={TECH_PATHS[name] ?? ""} />
                  </svg>
                </span>
              ))}
            </div>
            <div className="flex gap-2 md:gap-3 w-max animate-marquee-reverse">
              {[...FW_ROW, ...FW_ROW, ...FW_ROW, ...FW_ROW].map((name, i) => (
                <span
                  key={i}
                  className="shrink-0 w-10 h-10 md:w-[72px] md:h-[72px] border flex items-center justify-center select-none"
                  style={techStyle(name)}
                  title={name}
                >
                  <svg className="w-5 h-5 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={TECH_PATHS[name] ?? ""} />
                  </svg>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MANAGE — 2 COLONNES ───────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-28 overflow-hidden">
        <div className="grid-dark" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">

          {/* Left */}
          <AnimInView animation="fade-right">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("manageEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {t("manageTitle")}
            </h2>
            <p className="text-[17px] text-gray-400 leading-[1.65] mb-8">
              {t("manageDesc")}
            </p>
            <div className="space-y-4">
              {manageFeatures.map(({ label, desc }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-[#9b3dff] font-semibold text-[14px]">
                    {label}
                  </p>
                  <p className="text-[14px] text-gray-500 leading-[1.65]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimInView>

          {/* Right — fake dashboard */}
          <AnimInView animation="fade-left" delay={100} className="min-w-0 w-full">
            <div className="rounded-xl border border-white/[0.07] bg-[var(--lp-bg-deep)] overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
                </div>
                <div className="flex-1 mx-2 h-5 rounded bg-white/[0.04] flex items-center px-2.5 overflow-hidden">
                  <span className="text-[10px] text-gray-600 font-mono truncate">console.nexiumai.io/dashboard/projects</span>
                </div>
              </div>
              {/* Layout */}
              <div className="flex min-h-0">
                {/* Sidebar — cachée sur mobile */}
                <div className="hidden min-[490px]:flex flex-col w-[140px] shrink-0 border-r border-white/[0.06] bg-[var(--lp-bg)] px-2 py-3">
                  <div className="flex items-center gap-1.5 px-1.5 mb-4">
                    <span className="text-[#9b3dff] font-bold text-[10px] tracking-tight">NEXIUM</span>
                    <span className="text-gray-600 text-[9px]">/ storage</span>
                  </div>
                  {[
                    { Icon: LayoutDashboard, name: "Overview",  active: false },
                    { Icon: FolderOpen,      name: "Projects",  active: true  },
                    { Icon: Key,             name: "API Keys",  active: false },
                    { Icon: BarChart2,       name: "Usage",     active: false },
                  ].map(({ Icon, name, active }) => (
                    <div
                      key={name}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 text-[11px] ${
                        active ? "bg-white/[0.07] text-white font-medium" : "text-gray-500"
                      }`}
                    >
                      <Icon size={11} className={active ? "text-white" : "text-gray-600"} />
                      {name}
                    </div>
                  ))}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[12px] font-semibold text-white">Projects</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">3 projects</p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[#9b3dff] text-white font-medium shrink-0">
                      <Plus size={9} /> New
                    </span>
                  </div>
                  {[
                    { name: "my-app",      info: "4 buckets · 45.2 MB" },
                    { name: "api-backend", info: "2 buckets · 12.1 MB" },
                    { name: "ml-assets",   info: "1 bucket  · 2.1 GB"  },
                  ].map(({ name, info }, i) => (
                    <div
                      key={name}
                      className={`flex items-center gap-2.5 py-2.5 ${i < 2 ? "border-b border-white/[0.04]" : ""}`}
                    >
                      <div className="w-6 h-6 rounded bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                        <FolderOpen size={11} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-200 font-mono truncate">{name}</p>
                        <p className="text-[9px] text-gray-600">{info}</p>
                      </div>
                      <ChevronRight size={11} className="text-gray-700 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimInView>

        </div>
      </section>

      {/* ── 3 STEPS ───────────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-28 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <AnimInView>
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("howEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.1] tracking-[-0.03em] mb-16"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {t("howTitle")}
            </h2>
          </AnimInView>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Step 1 — Create project */}
            <AnimInView delay={0}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded bg-[#9b3dff] flex items-center justify-center text-[10px] font-bold text-white font-mono">
                  1
                </span>
                <span className="text-[12px] text-gray-600 font-mono">Step 01</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{steps[0].title}</h3>
              <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{steps[0].body}</p>
              <div className="rounded-xl border border-white/[0.07] bg-[var(--lp-bg-deep)] overflow-hidden">
                <div className="flex items-center px-4 py-2.5 border-b border-white/[0.05]">
                  <span className="text-[11px] text-gray-300 font-medium">New workspace</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1.5">Workspace name</p>
                    <div className="px-3 py-2 rounded-md border border-white/[0.08] bg-white/[0.03] text-[12px] text-gray-300 font-mono">
                      my-workspace
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-md bg-[#9b3dff] text-[12px] text-white text-center font-medium">
                    Create workspace
                  </div>
                  <div className="pt-1 border-t border-white/[0.05]">
                    {["design-assets", "api-backend"].map((name, i) => (
                      <div key={name} className={`flex items-center gap-2.5 py-2 ${i === 0 ? "border-b border-white/[0.04]" : ""}`}>
                        <FolderOpen size={11} className="text-gray-600 flex-shrink-0" />
                        <span className="text-[11px] text-gray-500 font-mono flex-1">{name}</span>
                        <ChevronRight size={10} className="text-gray-700" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimInView>

            {/* Step 2 — API Key */}
            <AnimInView delay={110}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded bg-[#9b3dff] flex items-center justify-center text-[10px] font-bold text-white font-mono">
                  2
                </span>
                <span className="text-[12px] text-gray-600 font-mono">Step 02</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{steps[1].title}</h3>
              <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{steps[1].body}</p>
              <div className="rounded-xl border border-white/[0.07] bg-[var(--lp-bg-deep)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.05]">
                  <span className="text-[10px] text-gray-500 font-mono">my-workspace</span>
                  <span className="text-[10px] text-gray-700">/</span>
                  <span className="text-[11px] text-gray-300 font-medium">New folder</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1.5">Folder name</p>
                    <div className="px-3 py-2 rounded-md border border-white/[0.08] bg-white/[0.03] text-[12px] text-gray-300 font-mono">
                      prod-images
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1.5">Visibility</p>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#9b3dff]/40 bg-[#9b3dff]/10">
                        <Globe size={10} className="text-[#9b3dff]" />
                        <span className="text-[11px] text-[#9b3dff]">Public</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-md border border-white/[0.07] bg-white/[0.02]">
                        <Lock size={10} className="text-gray-600" />
                        <span className="text-[11px] text-gray-500">Private</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-md bg-[#9b3dff] text-[12px] text-white text-center font-medium">
                    Create folder
                  </div>
                </div>
              </div>
            </AnimInView>

            {/* Step 3 — Upload */}
            <AnimInView delay={220}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-5 rounded bg-[#9b3dff] flex items-center justify-center text-[10px] font-bold text-white font-mono">
                  3
                </span>
                <span className="text-[12px] text-gray-600 font-mono">Step 03</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{steps[2].title}</h3>
              <p className="text-[14px] text-gray-500 leading-[1.65] mb-6">{steps[2].body}</p>
              <div className="rounded-xl border border-white/[0.07] bg-[var(--lp-bg-deep)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.05] bg-black/20">
                  <span className="w-2 h-2 rounded-full bg-red-500/50" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <span className="w-2 h-2 rounded-full bg-green-500/50" />
                  <span className="ml-1.5 text-[11px] text-gray-600 font-mono">terminal</span>
                </div>
                <div className="p-5 font-mono text-[12px] space-y-1.5">
                  <p>
                    <span className="text-[#9b3dff]">curl</span>{" "}
                    <span className="text-green-400">-X POST</span> \
                  </p>
                  <p className="pl-3 text-[11px] text-orange-300">
                    &quot;Authorization: Bearer nx_live_...&quot; \
                  </p>
                  <p className="pl-3 text-[11px] text-orange-300">
                    &quot;file=@photo.jpg&quot;
                  </p>
                  <p className="text-gray-600 pt-1 text-[11px]">// → 201 Created</p>
                  <p className="text-purple-400 text-[11px]">
                    {`{ "url": "cdn.nexiumai.io/…" }`}
                  </p>
                </div>
              </div>
            </AnimInView>

          </div>
        </div>
      </section>

      {/* ── BUILDER FEATURES — 8 en grille ───────────────────── */}
      <section className="relative border-t border-white/[0.06] py-28 overflow-hidden">
        <div className="grid-dark" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <AnimInView className="mb-14">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("featEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em] mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {t("featTitle")}
            </h2>
            <p className="text-[17px] text-gray-500 leading-[1.65] max-w-xl">
              {t("featSubtitle")}
            </p>
          </AnimInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-y-12">
            {builders.map(({ Icon, title, body }, i) => (
              <AnimInView key={title} delay={i * 45}>
                <div className="w-8 h-8 rounded-md bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-[#9b3dff]" />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.65]">{body}</p>
              </AnimInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY — 6 en grille ────────────────────────────── */}
      <section className="relative border-t border-white/[0.06] py-28 overflow-hidden">
        <div className="glow-blue-bottom" />
        <div className="grid-dark" />
        <div className="noise-overlay" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <AnimInView className="mb-14">
            <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9b3dff] mb-4">
              {t("secureEyebrow")}
            </p>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em] mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {t("secureTitle")}
            </h2>
            <p className="text-[17px] text-gray-500 leading-[1.65] max-w-xl">
              {t("secureSubtitle")}
            </p>
          </AnimInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10 md:gap-y-12">
            {security.map(({ Icon, title, body }, i) => (
              <AnimInView key={title} delay={i * 60}>
                <div className="w-8 h-8 rounded-md bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-[#9b3dff]" />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.65]">{body}</p>
              </AnimInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — LOGOS FLOTTANTS (scroll-driven) ────────────── */}
      <CtaFloatingLogos
        title={t("ctaTitle")}
        body={t("ctaBody")}
        primary={t("ctaPrimary")}
        secondary={t("ctaSecondary")}
      />

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.09]">
        <div className="max-w-6xl mx-auto border-x border-white/[0.09]">

          {/* 4-column links grid */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/[0.09]">

            {/* Brand column */}
            <div className="px-10 py-10 border-b md:border-b-0 md:border-r border-white/[0.09]">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-[18px] tracking-tight">
                  <span className="text-[#9b3dff]">NEXIUM</span>
                  <span className="text-white/25 font-normal ml-1.5">/ storage</span>
                </span>
              </div>
              <p className="text-[13px] text-white/30 leading-[1.6] max-w-[240px]">
                {t("footerTagline")}
              </p>
            </div>

            {/* Products column */}
            <div className="px-8 py-10 border-b md:border-b-0 md:border-r border-white/[0.09]">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                {t("footerProductsTitle")}
              </p>
              <ul className="flex flex-col gap-2.5">
                <li><a href="/docs" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/35 hover:text-white transition">{t("footerDoc")}</a></li>
                <li>
                  <a href="https://www.npmjs.com/package/@ainexium/storage" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/35 hover:text-white transition inline-flex items-center gap-1">
                    {t("footerSdkJs")} <ExternalLink size={10} className="opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="https://pypi.org/project/nexium-storage/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/35 hover:text-white transition inline-flex items-center gap-1">
                    {t("footerSdkPy")} <ExternalLink size={10} className="opacity-50" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Company column */}
            <div className="px-8 py-10 border-b md:border-b-0 md:border-r border-white/[0.09]">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                {t("footerCompanyTitle")}
              </p>
              <ul className="flex flex-col gap-2.5">
                <li><a href="/" className="text-[13px] text-white/35 hover:text-white transition">{t("footerHome")}</a></li>
              </ul>
            </div>

            {/* Contact column */}
            <div className="px-8 py-10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
                {t("footerContactTitle")}
              </p>
              <ul className="flex flex-col gap-2.5">
                <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-[13px] text-white/35 hover:text-white transition">{CONTACT_EMAIL}</a></li>
                <li>
                  <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/35 hover:text-white transition">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar — copyright + language switcher */}
          <div className="flex items-center justify-between px-10 py-4">
            <p className="text-[12px] text-white/25">
              {t("rights", { year: new Date().getFullYear() })}{" "}
              <a
                href="https://nexiumai.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9b3dff] hover:text-[#aa55ff] transition"
              >
                NEXIUM.AI
              </a>
              {" · "}{t("rightsReserved")}
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </main>
  );
}
