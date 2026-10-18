"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LandingNavLinks() {
  const pathname   = usePathname();
  const isPricing  = pathname === "/pricing" || pathname.startsWith("/pricing/");
  const isDocs     = pathname === "/docs"    || pathname.startsWith("/docs/");

  return (
    <>
      <Link
        href="/docs"
        target="_blank"
        rel="noopener noreferrer"
        className={`hidden min-[490px]:block text-[13px] transition ${
          isDocs ? "text-white font-medium" : "text-gray-400 hover:text-white"
        }`}
      >
        Documentation
      </Link>
      <Link
        href="/pricing"
        className={`hidden min-[490px]:block text-[13px] transition ${
          isPricing ? "text-white font-medium" : "text-gray-400 hover:text-white"
        }`}
      >
        Pricing
      </Link>
    </>
  );
}
