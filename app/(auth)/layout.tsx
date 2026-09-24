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
      <div className="absolute top-5 right-6">
        <LanguageSwitcher />
      </div>
      <Link href="/" className="mb-10 text-2xl font-bold tracking-tight">
        <span className="text-[#06B6D4]">NEXIUM</span>{" "}
        <span className="text-gray-300">Storage</span>
      </Link>
      {children}
    </div>
  );
}
