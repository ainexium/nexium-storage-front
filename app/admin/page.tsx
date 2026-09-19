"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AdminStats } from "@/types";
import { useMe } from "@/hooks/use-auth";
import { Database, FolderOpen, Users, File, HardDrive, Lock, LockOpen } from "lucide-react";
import { useTranslations } from "next-intl";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function AdminPage() {
  const t = useTranslations("admin");
  const qc = useQueryClient();
  const { data: user } = useMe();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get<AdminStats>("/api/v1/admin/stats"),
  });

  const lockPlatform = useMutation({
    mutationFn: () => api.post("/api/v1/admin/platform/lock", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-stats"] }),
  });
  const unlockPlatform = useMutation({
    mutationFn: () => api.delete("/api/v1/admin/platform/lock"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-stats"] }),
  });

  const usedPct = stats && stats.quota_bytes > 0
    ? Math.min(100, (stats.storage_bytes / stats.quota_bytes) * 100)
    : 0;

  const statCards = [
    { key: "users",    value: stats?.user_count,    icon: Users,      color: "text-blue-400" },
    { key: "projects", value: stats?.project_count, icon: FolderOpen, color: "text-purple-400" },
    { key: "buckets",  value: stats?.bucket_count,  icon: Database,   color: "text-cyan-400" },
    { key: "files",    value: stats?.file_count,    icon: File,       color: "text-green-400" },
  ] as const;

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">
            {t("overview")}
            {user?.is_super_admin && (
              <span className="ml-2 text-[10px] font-medium text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                {t("superAdmin")}
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{t("globalStats")}</p>
        </div>

        {user?.is_super_admin && (
          <div className="flex items-center gap-2">
            {stats?.storage_locked && (
              <span className="text-[11px] text-red-400 border border-red-400/30 bg-red-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock size={10} /> {t("uploadsLocked")}
              </span>
            )}
            {stats?.storage_locked ? (
              <button
                onClick={() => unlockPlatform.mutate()}
                disabled={unlockPlatform.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/[0.08] text-sm text-gray-300 hover:text-white hover:border-white/20 transition-colors disabled:opacity-40"
              >
                <LockOpen size={13} /> {t("unlockUploads")}
              </button>
            ) : (
              <button
                onClick={() => lockPlatform.mutate()}
                disabled={lockPlatform.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-500/40 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
              >
                <Lock size={13} /> {t("lockUploads")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Storage total */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-orange-400" />
            <span className="text-xs font-medium text-gray-300">{t("totalStorage")}</span>
          </div>
          <span className="text-[11px] text-gray-600">
            {t("defaultQuota", { value: isLoading ? "—" : formatBytes(stats?.quota_bytes ?? 0) })}
          </span>
        </div>
        <span className="text-2xl font-semibold tabular-nums">
          {isLoading ? "—" : formatBytes(stats?.storage_bytes ?? 0)}
        </span>
        <p className="text-[11px] text-gray-500 mt-2">
          {t("storageNote")}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {statCards.map(({ key, value, icon: Icon, color }) => (
          <div key={key} className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-4">
            <Icon size={15} className={`${color} mb-2`} />
            {isLoading ? (
              <div className="h-6 w-12 bg-white/[0.05] rounded animate-pulse mb-1" />
            ) : (
              <p className="text-xl font-semibold tabular-nums">{value ?? "—"}</p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">{t(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
