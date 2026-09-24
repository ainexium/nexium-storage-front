"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="themed-page min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--lp-bg)] relative">
      <div className="absolute top-5 left-6">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9b3dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <span className="text-[#9b3dff]">NEXIUM</span>{" "}
          <span className="text-gray-400 font-normal">/ storage</span>
        </Link>
      </div>
      <div className="absolute top-5 right-6">
        <LanguageSwitcher />
      </div>
      {children}
    </div>
  );
}
