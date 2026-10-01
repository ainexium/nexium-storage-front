"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Activity, LogOut, ArrowLeft,
  ShieldCheck, Crown, CreditCard, Menu, X,
} from "lucide-react";
import { useMe, useLogout } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const nav = [
  { href: "/admin",         key: "overview", superAdminOnly: false, icon: LayoutDashboard },
  { href: "/admin/users",   key: "users",    superAdminOnly: false, icon: Users },
  { href: "/admin/logs",    key: "logs",     superAdminOnly: false, icon: Activity },
  { href: "/admin/billing", key: "billing",  superAdminOnly: true,  icon: CreditCard },
] as const;

function SidebarContent({
  t, pathname, user, mounted, logoutFn, onNav, rightAction,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any; pathname: string; user: any; mounted: boolean;
  logoutFn: () => void; onNav?: () => void; rightAction?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-2 mb-8">
        <Link href="/" className="flex items-center gap-1.5" onClick={onNav}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9b3dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <span className="text-[#9b3dff] font-bold text-sm tracking-tight">NEXIUM</span>
          <span className="text-gray-600 text-xs font-medium">/ admin</span>
        </Link>
        {rightAction}
      </div>

      <nav className="flex-1 space-y-0.5">
        {nav.map(({ href, key, icon: Icon, superAdminOnly }) => {
          if (mounted && superAdminOnly && !user?.is_super_admin) return null;
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={href as any}
              onClick={onNav}
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
          onClick={onNav}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft size={15} />
          {t("backToApp")}
        </Link>
        <div className="px-2.5 py-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[13px] font-medium text-gray-200 truncate" suppressHydrationWarning>{user?.name}</p>
            {mounted && (user?.is_super_admin
              ? <Crown size={11} className="text-yellow-400 shrink-0" />
              : user?.is_admin
              ? <ShieldCheck size={11} className="text-[#9b3dff] shrink-0" />
              : null)}
          </div>
          <p className="text-xs text-gray-600 truncate" suppressHydrationWarning>{user?.email}</p>
          <p className="text-[10px] text-gray-700 mt-0.5" suppressHydrationWarning>
            {mounted ? (user?.is_super_admin ? t("superAdmin") : t("admin")) : ""}
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
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: user, isError, isSuccess } = useMe();
  const { mutate: logoutFn } = useLogout();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isError) router.push("/login");
    if (isSuccess && !user?.is_admin && !user?.is_super_admin) router.push("/dashboard");
  }, [isError, isSuccess, user, router]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const sidebarProps = { t, pathname, user, mounted, logoutFn };

  return (
    <div className="flex min-h-screen">

      {/* ── Desktop sidebar (lg+) ─────────────────────── */}
      <aside className="hidden lg:flex w-[220px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#08080f] px-3 py-6">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── Mobile top bar (< lg) ─────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-[#08080f] border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9b3dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <span className="text-[#9b3dff] font-bold text-sm tracking-tight">NEXIUM</span>
          <span className="text-gray-600 text-xs font-medium">/ admin</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ── Mobile drawer backdrop ────────────────────── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ─────────────────────────────── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[260px] flex flex-col bg-[#08080f] border-r border-white/[0.06] px-3 py-6 transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          {...sidebarProps}
          onNav={() => setDrawerOpen(false)}
          rightAction={
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <X size={16} />
            </button>
          }
        />
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main className="flex-1 overflow-auto bg-[#0a0a0f] lg:pt-0 pt-14">
        {children}
      </main>

    </div>
  );
}
