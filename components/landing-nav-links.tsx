"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LandingNavLinks() {
  const pathname = usePathname();
  const isPricing = pathname === "/pricing" || pathname.startsWith("/pricing/");
  const isDocs    = pathname === "/docs"    || pathname.startsWith("/docs/");

  return (
    <>
      {!isDocs && (
        <Link
          href="/docs"
          className="hidden min-[490px]:block text-[13px] text-gray-400 hover:text-white transition"
        >
          Documentation
        </Link>
      )}
      {!isPricing && (
        <Link
          href="/pricing"
          className="hidden min-[490px]:block text-[13px] text-gray-400 hover:text-white transition"
        >
          Pricing
        </Link>
      )}
    </>
  );
}
