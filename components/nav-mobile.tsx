"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

const CONTACT_EMAIL = "ai.nexium@gmail.com";

export function NavMobile() {
  const t = useTranslations("landing");
  const [open, setOpen] = useState(false);

  return (
    <>
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
