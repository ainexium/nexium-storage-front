"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ActivityLog } from "@/types";
import { useState } from "react";
import { ShieldCheck, Crown, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const ACTION_GROUPS = [
  { key: "filterAll",      value: "" },
  { key: "filterAuth",     value: "auth" },
  { key: "filterAdmin",    value: "admin" },
  { key: "filterFiles",    value: "file" },
  { key: "filterProjects", value: "project" },
  { key: "filterBuckets",  value: "bucket" },
] as const;

const ACTION_KEY: Record<string, "auth_login" | "auth_logout" | "auth_register" | "auth_profile_update" | "admin_user_create" | "admin_role_grant" | "admin_role_revoke" | "file_upload" | "file_delete" | "project_create" | "project_delete" | "bucket_create" | "bucket_delete"> = {
  "auth.login": "auth_login",
  "auth.logout": "auth_logout",
  "auth.register": "auth_register",
  "auth.profile.update": "auth_profile_update",
  "admin.user.create": "admin_user_create",
  "admin.role.grant": "admin_role_grant",
  "admin.role.revoke": "admin_role_revoke",
  "file.upload": "file_upload",
  "file.delete": "file_delete",
  "project.create": "project_create",
  "project.delete": "project_delete",
  "bucket.create": "bucket_create",
  "bucket.delete": "bucket_delete",
};

function actionColor(action: string): string {
  if (action.startsWith("auth")) return "text-blue-400";
  if (action.startsWith("admin")) return "text-yellow-400";
  if (action.includes("delete") || action.includes("revoke")) return "text-red-400";
  return "text-green-400";
}

export default function AdminLogsPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [actionFilter, setActionFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-logs", actionFilter],
    queryFn: () => {
      const params = new URLSearchParams({ limit: "200" });
      if (actionFilter) params.set("action", actionFilter);
      return api.get<ActivityLog[]>(`/api/v1/admin/logs?${params}`);
    },
    refetchInterval: autoRefresh ? 10000 : false,
  });

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-semibold">{t("logsTitle")}</h1>
          <p className="text-xs text-gray-500 mt-1">{t("logsSubtitle", { count: logs.length })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoRefresh(v => !v)}
            className={`text-xs px-2.5 py-1.5 rounded border transition-colors ${
              autoRefresh
                ? "border-[#007BFF]/40 bg-[#007BFF]/10 text-[#007BFF]"
                : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
            }`}
          >
            {autoRefresh ? `${t("live")} ●` : t("live")}
          </button>
          <button onClick={() => refetch()}
            className="p-1.5 rounded border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 transition-colors">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {ACTION_GROUPS.map(({ key, value }) => (
          <button key={value} onClick={() => setActionFilter(value)}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              actionFilter === value
                ? "bg-white/[0.08] text-white font-medium"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {[1,2,3,4,5].map(i => <div key={i} className="h-11 bg-white/[0.02] animate-pulse" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <p className="text-sm text-gray-600">{t("noLogs")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-2.5 text-xs text-gray-600 border-b border-white/[0.07] bg-white/[0.02]">
            <span>{t("time")}</span>
            <span>{t("user")}</span>
            <span>{t("action")}</span>
            <span>{t("resource")}</span>
          </div>
          <div className="divide-y divide-white/[0.06] max-h-[calc(100vh-280px)] overflow-auto">
            {logs.map((l) => (
              <div key={l.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-2.5 hover:bg-white/[0.02] transition-colors">
                <span className="text-[11px] text-gray-600 tabular-nums whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString(locale)}
                </span>
                <div className="flex items-center gap-1.5 min-w-0">
                  {l.is_super_admin
                    ? <Crown size={10} className="text-yellow-400 shrink-0" />
                    : l.is_admin
                    ? <ShieldCheck size={10} className="text-[#007BFF] shrink-0" />
                    : <span className="w-2.5 h-2.5 rounded-full bg-gray-700 shrink-0" />
                  }
                  <span className="text-xs text-gray-300 truncate">{l.user_name}</span>
                  <span className="text-[11px] text-gray-600 truncate hidden sm:block">{l.user_email}</span>
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${actionColor(l.action)}`}>
                  {ACTION_KEY[l.action]
                    ? t(`actions.${ACTION_KEY[l.action]}`)
                    : l.action}
                </span>
                <span className="text-[11px] text-gray-700 font-mono truncate max-w-[120px]" title={l.resource_id}>
                  {l.resource_type ? `${l.resource_type}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
