"use client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const CONTACT_EMAIL = "ai.nexium@gmail.com";
const CONTACT_WHATSAPP = "+2250503020385";

export function LandingFooter() {
  const t = useTranslations("landing");

  return (
    <footer className="border-t border-white/[0.09]">
      <div className="max-w-6xl mx-auto border-x border-white/[0.09]">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/[0.09]">

          {/* Brand */}
          <div className="px-10 py-10 border-b md:border-b-0 md:border-r border-white/[0.09]">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9b3dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
              </svg>
              <span className="font-bold text-[18px] tracking-tight">
                <span className="text-[#9b3dff]">NEXIUM</span>
                <span className="text-white/25 font-normal ml-1.5">/ storage</span>
              </span>
            </div>
            <p className="text-[13px] text-white/30 leading-[1.6] max-w-[240px]">
              {t("footerTagline")}
            </p>
          </div>

          {/* Products */}
          <div className="px-8 py-10 border-b md:border-b-0 md:border-r border-white/[0.09]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
              {t("footerProductsTitle")}
            </p>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/pricing" className="text-[13px] text-white/35 hover:text-white transition">{t("footerPricing")}</Link></li>
              <li><a href="/docs" className="text-[13px] text-white/35 hover:text-white transition">{t("footerDoc")}</a></li>
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

          {/* Company */}
          <div className="px-8 py-10 border-b md:border-b-0 md:border-r border-white/[0.09]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
              {t("footerCompanyTitle")}
            </p>
            <ul className="flex flex-col gap-2.5">
              <li><a href="/" className="text-[13px] text-white/35 hover:text-white transition">{t("footerHome")}</a></li>
            </ul>
          </div>

          {/* Contact */}
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

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-10 py-4">
          <p className="text-[12px] text-white/25">
            {t("rights", { year: new Date().getFullYear() })}{" "}
            <a href="https://nexiumai.io" target="_blank" rel="noopener noreferrer" className="text-[#9b3dff] hover:text-[#aa55ff] transition">
              NEXIUM.AI
            </a>
            {" · "}{t("rightsReserved")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
