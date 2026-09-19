"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Activity, LogOut, ArrowLeft, ShieldCheck, Crown, CreditCard } from "lucide-react";
import { useMe, useLogout } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const nav = [
  { href: "/admin",         key: "overview", superAdminOnly: false, icon: LayoutDashboard },
  { href: "/admin/users",   key: "users",    superAdminOnly: false, icon: Users },
  { href: "/admin/logs",    key: "logs",     superAdminOnly: false, icon: Activity },
  { href: "/admin/billing", key: "billing",  superAdminOnly: true,  icon: CreditCard },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: user, isError, isSuccess, isLoading } = useMe();
  const { mutate: logoutFn } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (isError) router.push("/login");
    if (isSuccess && !user?.is_admin && !user?.is_super_admin) router.push("/dashboard");
  }, [isError, isSuccess, user, router]);

  if (isLoading || isError) {
    return <div className="min-h-screen bg-[#0a0a0f]" />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#08080f] px-3 py-6">
        <div className="flex items-center gap-1.5 px-2 mb-8">
          <span className="text-[#007BFF] font-bold text-sm tracking-tight">NEXIUM</span>
          <span className="text-gray-600 text-xs font-medium">/ admin</span>
        </div>

        <nav className="flex-1 space-y-0.5">
          {nav.map(({ href, key, icon: Icon, superAdminOnly }) => {
            if (superAdminOnly && !user?.is_super_admin) return null;
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={href as any}
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

        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-1">
          <LanguageSwitcher variant="sidebar" />
          <Link
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={"/dashboard" as any}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-all"
          >
            <ArrowLeft size={15} />
            {t("backToApp")}
          </Link>
          <div className="px-2.5 py-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[13px] font-medium text-gray-200 truncate">{user?.name}</p>
              {user?.is_super_admin
                ? <Crown size={11} className="text-yellow-400 shrink-0" />
                : user?.is_admin
                ? <ShieldCheck size={11} className="text-[#007BFF] shrink-0" />
                : null}
            </div>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            <p className="text-[10px] text-gray-700 mt-0.5">
              {user?.is_super_admin ? t("superAdmin") : t("admin")}
            </p>
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
