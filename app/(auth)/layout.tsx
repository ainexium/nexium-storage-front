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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0a0a0f] relative">
      <div className="absolute top-5 right-6">
        <LanguageSwitcher />
      </div>
      <Link href="/" className="mb-10 text-2xl font-bold tracking-tight">
        <span className="text-[#007BFF]">NEXIUM</span>{" "}
        <span className="text-gray-300">Storage</span>
      </Link>
      {children}
    </div>
  );
}
