"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Mail, Menu, X } from "lucide-react";

const CONTACT_EMAIL = "ai.nexium@gmail.com";

export function NavAuth() {
  const t        = useTranslations("landing");
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen]         = useState(false);

  const isPricing = pathname === "/pricing" || pathname.startsWith("/pricing/");
  const isDocs    = pathname === "/docs"    || pathname.startsWith("/docs/");

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("access_token"));
  }, []);

  return (
    <>
      {/* Desktop */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="hidden min-[490px]:flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-300 transition"
        title={t("contactTitle")}
      >
        <Mail size={12} />
        {t("contact")}
      </a>

      {loggedIn ? (
        <Link
          href="/dashboard"
          className="hidden min-[490px]:flex items-center gap-1.5 px-3.5 py-1.5 text-[14px] bg-[#9b3dff] hover:bg-[#aa55ff] rounded-md font-semibold transition"
        >
          <LayoutDashboard size={14} />
          Dashboard
        </Link>
      ) : (
        <>
          <Link href="/login" className="hidden min-[490px]:block text-[14px] text-gray-400 hover:text-white transition">
            {t("logIn")}
          </Link>
          <Link
            href="/register"
            className="hidden min-[490px]:block px-3.5 py-1.5 text-[14px] bg-[#9b3dff] hover:bg-[#aa55ff] rounded-md font-semibold transition"
          >
            {t("getStarted")}
          </Link>
        </>
      )}

      {/* Mobile burger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="flex min-[490px]:hidden items-center justify-center w-8 h-8 text-gray-400 hover:text-white transition"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`nav-mobile-dropdown fixed inset-x-0 top-14 z-40 backdrop-blur-md border-b px-6 py-4 flex flex-col gap-3 transition-all duration-200 ease-out ${
        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        <Link
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="nav-mobile-link text-[15px] py-2 border-b transition"
        >
          Documentation
        </Link>
        <Link
          href="/pricing"
          onClick={() => setOpen(false)}
          className="nav-mobile-link text-[15px] py-2 border-b transition"
        >
          Pricing
        </Link>
        {loggedIn ? (
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 py-2.5 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold text-white transition"
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="nav-mobile-link text-[15px] py-2 border-b transition"
            >
              {t("logIn")}
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-2.5 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold text-white transition"
            >
              {t("getStarted")}
            </Link>
          </>
        )}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() => setOpen(false)}
          className="nav-mobile-contact flex items-center gap-2 text-[13px] py-1 transition"
        >
          <Mail size={13} />
          {t("contact")}
        </a>
      </div>
    </>
  );
}
