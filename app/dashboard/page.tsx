"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project, UsageSummary, SubscriptionResponse } from "@/types";
import Link from "next/link";
import { ChevronRight, HardDrive, ArrowRight, Sparkles, Check, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface OnboardingStatus {
  has_project: boolean;
  has_file: boolean;
  has_api_key: boolean;
  completed: boolean;
}

const ONBOARDING_DISMISSED_KEY = "nexium_onboarding_dismissed";

function OnboardingChecklist() {
  const t = useTranslations("dashboard");
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDismissed(localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "1");
  }, []);

  const { data } = useQuery<OnboardingStatus>({
    queryKey: ["onboarding"],
    queryFn: () => api.get("/api/v1/auth/onboarding"),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (data?.completed) {
      // Auto-dismiss after a short delay when all steps are done
      const timer = setTimeout(() => {
        localStorage.setItem(ONBOARDING_DISMISSED_KEY, "1");
        setDismissed(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data?.completed]);

  if (!mounted || dismissed) return null;

  const steps = [
    { key: "step1", done: data?.has_project ?? false, label: t("onboardingStep1"), desc: t("onboardingStep1Desc"), href: "/dashboard/projects" },
    { key: "step2", done: data?.has_file ?? false,    label: t("onboardingStep2"), desc: t("onboardingStep2Desc"), href: "/dashboard/projects" },
    { key: "step3", done: data?.has_api_key ?? false, label: t("onboardingStep3"), desc: t("onboardingStep3Desc"), href: "/dashboard/api-keys" },
  ];

  const completedCount = steps.filter(s => s.done).length;

  return (
    <div className="rounded-xl border border-[#9b3dff]/20 bg-[#9b3dff]/[0.04] p-5 mb-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[14px] font-semibold text-white">{t("onboardingTitle")}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{t("onboardingSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-gray-600">{completedCount}/3</span>
          <button
            onClick={() => { localStorage.setItem(ONBOARDING_DISMISSED_KEY, "1"); setDismissed(true); }}
            className="p-1 rounded-md text-gray-600 hover:text-gray-400 hover:bg-white/[0.06] transition"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-[#9b3dff] transition-all duration-500"
          style={{ width: `${(completedCount / 3) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.key}
            href={step.done ? "#" : step.href as Parameters<typeof Link>[0]["href"]}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              step.done ? "opacity-60 cursor-default" : "hover:bg-white/[0.04] cursor-pointer"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${
              step.done
                ? "bg-[#9b3dff] border-[#9b3dff]"
                : "border-white/20 bg-white/[0.03]"
            }`}>
              {step.done && <Check size={10} strokeWidth={3} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-medium leading-tight ${step.done ? "line-through text-gray-500" : "text-gray-200"}`}>
                {step.label}
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">{step.desc}</p>
            </div>
            {!step.done && <ArrowRight size={12} className="text-gray-600 shrink-0" />}
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-6 py-5">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

const PLAN_ACCENT: Record<string, string> = {
  free:     "text-gray-500",
  starter:  "text-[#9b3dff]",
  pro:      "text-[#9b3dff]",
  business: "text-[#9b3dff]",
};
const PLAN_BG: Record<string, string> = {
  free:     "bg-white/[0.02] border-white/[0.07]",
  starter:  "bg-white/[0.02] border-white/[0.07]",
  pro:      "bg-white/[0.03] border-[#9b3dff]/15",
  business: "bg-white/[0.02] border-white/[0.07]",
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tp = useTranslations("pricing");
  const locale = useLocale();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/api/v1/projects"),
  });
  const { data: sub } = useQuery<SubscriptionResponse>({
    queryKey: ["billing-subscription"],
    queryFn: () => api.get("/api/v1/billing/subscription"),
    staleTime: 5 * 60 * 1000,
  });

  const usageResults = useQueries({
    queries: projects.map((p) => ({
      queryKey: ["usage", p.id],
      queryFn: () => api.get<UsageSummary>(`/api/v1/projects/${p.id}/usage`),
    })),
  });

  const totalBuckets = usageResults.reduce((s, r) => s + (r.data?.bucket_count ?? 0), 0);
  const totalFiles   = usageResults.reduce((s, r) => s + (r.data?.file_count ?? 0), 0);
  const totalStorage = usageResults.reduce((s, r) => s + (r.data?.storage_bytes ?? 0), 0);

  const planSlug    = sub?.plan?.slug ?? "free";
  const planName    = sub?.plan?.name ?? "Free";
  const quotaBytes  = sub?.plan?.storage_bytes ?? 0;
  const usedPct     = quotaBytes > 0 ? Math.min(100, (totalStorage / quotaBytes) * 100) : 0;
  const accentCls   = PLAN_ACCENT[planSlug] ?? PLAN_ACCENT.free;
  const cardCls     = PLAN_BG[planSlug] ?? PLAN_BG.free;
  const isPro       = planSlug === "pro";

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-4xl">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-base font-semibold">{t("overview")}</h1>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-white/[0.07] grid grid-cols-2 sm:grid-cols-4 mb-8 overflow-hidden">
        <div className="border-r border-b sm:border-b-0 border-white/[0.07]"><Stat value={projects.length.toString()} label={t("projects")} /></div>
        <div className="border-b sm:border-b-0 sm:border-r border-white/[0.07]"><Stat value={totalBuckets.toString()} label={t("buckets")} /></div>
        <div className="border-r sm:border-r border-white/[0.07]"><Stat value={totalFiles.toString()} label={t("files")} /></div>
        <div><Stat value={formatBytes(totalStorage)} label={t("storageUsed")} /></div>
      </div>

      {/* Plan card */}
      <div className={`rounded-xl border px-6 py-5 mb-8 ${cardCls}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
              <HardDrive size={15} className={accentCls} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-widest ${accentCls}`}>{planName}</span>
                {isPro && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    <Sparkles size={8} /> Pro
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatBytes(totalStorage)} / {formatBytes(quotaBytes)}{" "}
                {locale === "en" ? "used" : "utilisé"}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 rounded-lg transition"
          >
            {tp("planDashLink")} <ArrowRight size={12} />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usedPct > 85 ? "bg-red-400" : usedPct > 60 ? "bg-amber-400" : "bg-[#9b3dff]"
              }`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-600 mt-1.5">{usedPct.toFixed(1)}% {locale === "en" ? "of quota used" : "du quota utilisé"}</p>
        </div>
      </div>

      {/* Onboarding checklist */}
      <OnboardingChecklist />

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-300">{t("recentProjects")}</h2>
          <Link href="/dashboard/projects" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            {t("viewAll")}
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.07] py-14 text-center">
            <p className="text-sm text-gray-600">{t("noProjects")}</p>
            <Link href="/dashboard/projects" className="text-xs text-[#9b3dff] hover:underline mt-2 inline-block">
              {t("createFirstProject")}
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{p.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {new Date(p.created_at).toLocaleDateString(locale)}
                  </span>
                  <ChevronRight size={13} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
