"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Check, ChevronDown, HardDrive, LayoutDashboard, Zap } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/* ── Static fallback data ───────────────────────────────── */

interface Country {
  code: string; name: string; flag_emoji: string;
  currency_code: string; local_per_xof: number; is_active: boolean;
}
interface Channel { name: string; slug: string; logo_url?: string; is_active: boolean; maintenance_note?: string; }

const STATIC_COUNTRIES: Country[] = [
  { code: "CI", name: "Côte d'Ivoire", flag_emoji: "🇨🇮", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "SN", name: "Sénégal",        flag_emoji: "🇸🇳", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "ML", name: "Mali",           flag_emoji: "🇲🇱", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "BF", name: "Burkina Faso",   flag_emoji: "🇧🇫", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "TG", name: "Togo",           flag_emoji: "🇹🇬", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "BJ", name: "Bénin",          flag_emoji: "🇧🇯", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "NE", name: "Niger",          flag_emoji: "🇳🇪", currency_code: "XOF", local_per_xof: 1,     is_active: true },
  { code: "GN", name: "Guinée",         flag_emoji: "🇬🇳", currency_code: "GNF", local_per_xof: 14.5,  is_active: true },
  { code: "CM", name: "Cameroun",       flag_emoji: "🇨🇲", currency_code: "XAF", local_per_xof: 1,     is_active: true },
  { code: "CG", name: "Congo",          flag_emoji: "🇨🇬", currency_code: "XAF", local_per_xof: 1,     is_active: true },
  { code: "GA", name: "Gabon",          flag_emoji: "🇬🇦", currency_code: "XAF", local_per_xof: 1,     is_active: true },
  { code: "GH", name: "Ghana",          flag_emoji: "🇬🇭", currency_code: "GHS", local_per_xof: 0.0065, is_active: true },
];

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Africa/Abidjan": "CI", "Africa/Dakar": "SN", "Africa/Bamako": "ML",
  "Africa/Ouagadougou": "BF", "Africa/Lome": "TG", "Africa/Porto-Novo": "BJ",
  "Africa/Niamey": "NE", "Africa/Conakry": "GN", "Africa/Douala": "CM",
  "Africa/Brazzaville": "CG", "Africa/Libreville": "GA", "Africa/Accra": "GH",
};

const PLAN_CONFIG = {
  free:     { accent: "text-gray-500",    border: "border-white/[0.08] hover:border-white/25", btnCls: "border border-white/[0.18] text-gray-400 hover:border-[#9b3dff]/60 hover:text-[#9b3dff]" },
  starter:  { accent: "text-[#9b3dff]",   border: "border-white/[0.08] hover:border-[#9b3dff]/50", btnCls: "border border-[#9b3dff]/40 text-[#9b3dff] hover:bg-[#9b3dff] hover:text-white hover:border-[#9b3dff]" },
  pro:      { accent: "text-[#9b3dff]",   border: "border-[#9b3dff]/35", btnCls: "bg-[#9b3dff] hover:bg-[#aa55ff] text-white border border-[#9b3dff]" },
  business: { accent: "text-[#9b3dff]",   border: "border-white/[0.08] hover:border-[#9b3dff]/50", btnCls: "border border-[#9b3dff]/40 text-[#9b3dff] hover:bg-[#9b3dff] hover:text-white hover:border-[#9b3dff]" },
} as const;

const PLANS = [
  { slug: "free"    as const, priceXOF: 0 },
  { slug: "starter" as const, priceXOF: 2500 },
  { slug: "pro"     as const, priceXOF: 6000,  recommended: true },
  { slug: "business"as const, priceXOF: 15000 },
];

function fmtPrice(xof: number, country: Country | null, locale: string) {
  if (xof === 0) return null;
  const local = country ? Math.round(xof * country.local_per_xof) : xof;
  const cur   = country?.currency_code ?? "XOF";
  return { amount: new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR").format(local), cur };
}

/* ── Country selector dropdown ──────────────────────────── */
function CountryPicker({ countries, selected, onSelect }: {
  countries: Country[]; selected: Country | null; onSelect: (c: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:border-white/20 transition text-[13px]"
      >
        {selected ? (
          <><span className="text-lg leading-none">{selected.flag_emoji}</span>
            <span className="text-gray-300">{selected.name}</span>
            <span className="text-[11px] text-gray-600 font-mono">{selected.currency_code}</span></>
        ) : (
          <span className="text-gray-500">XOF (default)</span>
        )}
        <ChevronDown size={13} className={`text-gray-600 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-xl border border-white/[0.1] bg-[#0c0c14] shadow-2xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => { onSelect(c); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.05] transition text-[13px] ${
                  selected?.code === c.code ? "bg-[#9b3dff]/[0.08] text-[#9b3dff]" : "text-gray-300"
                }`}
              >
                <span className="text-lg leading-none">{c.flag_emoji}</span>
                <span className="flex-1">{c.name}</span>
                <span className="text-[11px] text-gray-600 font-mono">{c.currency_code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export function PricingPlans() {
  const t      = useTranslations("pricing");
  const locale = useLocale();

  const [countries, setCountries] = useState<Country[]>(STATIC_COUNTRIES);
  const [country,   setCountry]   = useState<Country | null>(null);
  const [channels,  setChannels]  = useState<Channel[]>([]);
  const [loggedIn,  setLoggedIn]  = useState(false);

  /* Auth check */
  useEffect(() => { setLoggedIn(!!localStorage.getItem("access_token")); }, []);

  /* Fetch countries from API, fallback to static */
  useEffect(() => {
    fetch(`${API_URL}/api/v1/billing/countries`, { headers: { "Content-Type": "application/json" } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Country[]) => { if (Array.isArray(data) && data.length) setCountries(data); })
      .catch(() => { /* use static fallback */ });
  }, []);

  /* Auto-detect country from timezone */
  useEffect(() => {
    if (country || countries.length === 0) return;
    try {
      const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const code = TIMEZONE_TO_COUNTRY[tz];
      const found = code ? countries.find(c => c.code === code) : undefined;
      setCountry(found ?? null);
    } catch { /* not critical */ }
  }, [countries, country]);

  /* Fetch payment channels for selected country */
  useEffect(() => {
    if (!country) return;
    fetch(`${API_URL}/api/v1/billing/channels?country=${country.code}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Channel[]) => { if (Array.isArray(data)) setChannels(data); })
      .catch(() => { setChannels([]); });
  }, [country]);

  return (
    <section className="relative pb-28 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Country selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <p className="text-[13px] text-gray-500">{locale === "fr" ? "Afficher les prix en :" : "Show prices in:"}</p>
          <CountryPicker countries={countries} selected={country} onSelect={setCountry} />
          {country && country.currency_code !== "XOF" && (
            <p className="text-[11px] text-gray-600">
              {locale === "fr" ? "Taux indicatif. Prix définitif confirmé au paiement." : "Indicative rate. Final price confirmed at checkout."}
            </p>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {PLANS.map(({ slug, priceXOF, recommended }) => {
            const cfg       = PLAN_CONFIG[slug];
            const planData  = t.raw(`plans.${slug}`) as { tagline: string; storage: string; maxFile: string; support: string; features: string[] };
            const isFree    = priceXOF === 0;
            const price     = fmtPrice(priceXOF, country, locale);

            return (
              <div
                key={slug}
                className={`relative flex flex-col h-full rounded-2xl border p-6 transition-colors ${cfg.border}`}
              >
                {recommended && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#9b3dff] text-white shadow-lg">
                      <Zap size={9} /> {t("recommended")}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${cfg.accent}`}>
                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </span>
                  <p className="text-[12px] text-gray-600 mt-0.5">{planData.tagline}</p>
                </div>

                <div className="mb-6">
                  {isFree ? (
                    <div className="text-4xl font-black text-white tracking-tight">{t("freeLabel")}</div>
                  ) : (
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-black text-white tracking-tight leading-none">
                        {price?.amount}
                      </span>
                      <span className="text-xs text-gray-600 mb-1.5">
                        {price?.cur} {t("monthLabel")}
                      </span>
                    </div>
                  )}
                  <p className={`text-[13px] font-semibold mt-1.5 ${cfg.accent}`}>{planData.storage}</p>
                </div>

                <div className="space-y-2.5 mb-6">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">{t("planMaxFile")}</span>
                    <span className="font-medium text-gray-300">{planData.maxFile}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">{t("planProjects")}</span>
                    <span className="font-medium text-gray-300">{t("unlimited")}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">{t("planSupport")}</span>
                    <span className="font-medium text-gray-300">{planData.support}</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-5 mb-7 space-y-2.5 flex-1">
                  {planData.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                      <Check size={13} strokeWidth={2.5} className="text-[#9b3dff] mt-0.5 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <Link
                  href={loggedIn ? "/dashboard/billing" : "/register"}
                  className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${cfg.btnCls}`}
                >
                  {loggedIn
                    ? <><LayoutDashboard size={13} /> {locale === "fr" ? "Gérer mon plan" : "Manage my plan"}</>
                    : isFree
                      ? <>{t("ctaFree")} <ArrowRight size={13} /></>
                      : <>{t("ctaPaid")} <ArrowRight size={13} /></>
                  }
                </Link>
              </div>
            );
          })}
        </div>

        {/* Already have account — only when not logged in */}
        {!loggedIn && (
          <p className="text-center text-[13px] text-gray-600">
            {t("loginNote")}{" "}
            <Link href="/login" className="text-[#9b3dff] hover:text-[#aa55ff] transition">
              {t("loginLink")}
            </Link>
          </p>
        )}

        {/* Payment methods for selected country */}
        {channels.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/[0.06]">
            <p className="text-[12px] text-gray-600 uppercase tracking-widest font-semibold mb-4">
              {t("countriesPayWith")} {country ? `— ${country.name}` : ""}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {channels.map((ch) => (
                <span
                  key={ch.slug}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-[13px] transition ${
                    ch.is_active
                      ? "border-white/[0.08] bg-white/[0.03] text-gray-400"
                      : "border-white/[0.04] bg-white/[0.01] text-gray-600 opacity-50"
                  }`}
                >
                  {ch.logo_url && (
                    <img src={ch.logo_url} alt={ch.name} className="w-4 h-4 rounded object-contain" />
                  )}
                  {ch.name}
                  {!ch.is_active && ch.maintenance_note && (
                    <span className="text-[10px] text-orange-400">({ch.maintenance_note})</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Auth-aware CTA ─────────────────────────────────────── */
export function PricingCTA({ title, body, btnFree, btnDash }: {
  title: string; body: string; btnFree: string; btnDash: string;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { setLoggedIn(!!localStorage.getItem("access_token")); }, []);

  return (
    <div className="rounded-2xl border border-white/[0.12] bg-[var(--lp-bg-deep)] px-10 md:px-20 py-10 md:py-12 text-center">
      <h2
        className="font-medium leading-[1.12] tracking-[-0.03em] mb-5"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
      >
        {title}
      </h2>
      <p className="text-[16px] text-gray-400 mb-8 leading-[1.65]">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {loggedIn ? (
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
          >
            <LayoutDashboard size={15} /> {btnDash}
          </Link>
        ) : (
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
          >
            {btnFree} <ArrowRight size={15} />
          </Link>
        )}
        <Link
          href="/docs"
          className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/[0.1] hover:border-white/20 rounded-lg text-[14px] font-semibold text-gray-300 hover:text-white transition"
        >
          Documentation
        </Link>
      </div>
    </div>
  );
}
