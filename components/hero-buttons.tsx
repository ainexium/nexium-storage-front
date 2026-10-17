"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function HeroButtons() {
  const t = useTranslations("landing");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("access_token"));
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-16">
      {loggedIn ? (
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
        >
          <LayoutDashboard size={16} />
          {t("goToDashboard")}
        </Link>
      ) : (
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
        >
          {t("createAccount")} <ArrowRight size={16} />
        </Link>
      )}
      <Link
        href="/docs"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-6 py-3 border border-white/[0.1] hover:border-white/20 rounded-lg text-[14px] font-semibold text-gray-300 hover:text-white transition"
      >
        {t("readDocs")}
      </Link>
    </div>
  );
}
