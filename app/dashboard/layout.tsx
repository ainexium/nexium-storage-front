"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, Key, BarChart2, BookOpen, Settings, LogOut, CreditCard,
} from "lucide-react";
import { useLogout, useMe } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  free:     { label: "Free",     cls: "text-gray-500 bg-white/[0.04] border-white/[0.08]" },
  starter:  { label: "Starter",  cls: "text-blue-400 bg-blue-500/[0.08] border-blue-500/20" },
  pro:      { label: "Pro",      cls: "text-purple-400 bg-purple-500/[0.08] border-purple-500/20" },
  business: { label: "Business", cls: "text-amber-400 bg-amber-500/[0.08] border-amber-500/20" },
};

const nav = [
  { href: "/dashboard",          key: "overview",    icon: LayoutDashboard },
  { href: "/dashboard/projects", key: "workspaces",  icon: FolderOpen },
  { href: "/dashboard/api-keys", key: "apiKeys",     icon: Key },
  { href: "/dashboard/usage",    key: "usage",       icon: BarChart2 },
  { href: "/dashboard/billing",  key: "billing",     icon: CreditCard },
  { href: "/docs",               key: "docs",        icon: BookOpen, external: true },
  { href: "/dashboard/settings", key: "settings",    icon: Settings },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: user, isError, isLoading } = useMe();
  const { mutate: logoutFn } = useLogout();
  const router = useRouter();
  const { data: subData } = useQuery<{ plan: { slug: string } | null }>({
    queryKey: ["billing-subscription"],
    queryFn: () => api.get("/api/v1/billing/subscription"),
    staleTime: 5 * 60 * 1000,
  });
  const planSlug = subData?.plan?.slug ?? "free";
  const badge = PLAN_BADGE[planSlug] ?? PLAN_BADGE.free;

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError, router]);

  if (isLoading || isError) {
    return <div className="min-h-screen bg-[#0a0a0f]" />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#08080f] px-3 py-6">
        <Link href="/" className="flex items-center gap-1.5 px-2 mb-8">
          <span className="text-[#007BFF] font-bold text-sm tracking-tight">NEXIUM</span>
          <span className="text-gray-600 text-xs font-medium">/ storage</span>
        </Link>

        <nav className="flex-1 space-y-0.5">
          {nav.map((item) => {
            const { href, key, icon: Icon } = item;
            const external = "external" in item && item.external;
            const active = !external && (
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
            );
            return (
              <Link
                key={href}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={href as any}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all ${
                  active
                    ? "bg-white/[0.07] text-white font-medium"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={15} className={active ? "text-white" : "text-gray-500"} />
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="mb-1">
            <LanguageSwitcher variant="sidebar" />
          </div>
          {(user?.is_admin || user?.is_super_admin) && (
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={"/admin" as any}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-gray-500 hover:text-[#007BFF] hover:bg-[#007BFF]/[0.06] transition-all mb-1"
            >
              <ShieldCheck size={15} />
              {t("adminPanel")}
            </Link>
          )}
          <div className="px-2.5 py-2 mb-1">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-[13px] font-medium text-gray-200 truncate">{user?.name}</p>
              <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logoutFn()}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] text-gray-500 hover:text-red-400 hover:bg-red-400/[0.06] transition-all"
          >
            <LogOut size={15} />
            {t("signOut")}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#0a0a0f]">
        {children}
      </main>
    </div>
  );
}
