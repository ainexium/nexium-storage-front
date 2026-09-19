"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  type AppLocale,
  localeLabels,
  locales,
  persistLocale,
} from "@/lib/locale";

type Variant = "header" | "sidebar" | "settings";

export function LanguageSwitcher({ variant = "header" }: { variant?: Variant }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function select(next: AppLocale) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    persistLocale(next);
    setOpen(false);
    window.location.reload();
  }

  if (variant === "settings") {
    return (
      <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
        {locales.map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => select(code)}
              className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-white/[0.03] transition-colors disabled:opacity-50"
            >
              <span className={`text-sm ${active ? "text-white" : "text-gray-300"}`}>
                {localeLabels[code]}
              </span>
              {active && <Check size={14} className="text-[#007BFF]" />}
            </button>
          );
        })}
      </div>
    );
  }

  const triggerClass =
    variant === "sidebar"
      ? "flex items-center justify-between w-full px-2.5 py-2 rounded-md text-[13px] text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-all"
      : "inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("switch")}
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Globe size={variant === "sidebar" ? 15 : 13} />
          <span className={variant === "sidebar" ? "truncate" : "hidden sm:inline"}>
            {localeLabels[locale]}
          </span>
        </span>
        <ChevronDown
          size={12}
          className={`shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""} ${variant === "header" ? "ml-0.5" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute z-50 min-w-[160px] rounded-lg border border-white/[0.1] bg-[#0f0f18] py-1 ${
            variant === "sidebar" ? "left-0 bottom-full mb-1" : "right-0 top-full mt-1.5"
          }`}
        >
          {locales.map((code) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(code)}
                className={`flex items-center justify-between w-full px-3 py-2 text-[13px] text-left transition-colors ${
                  active ? "text-white bg-white/[0.06]" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {localeLabels[code]}
                {active && <Check size={12} className="text-[#007BFF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
