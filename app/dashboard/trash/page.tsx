"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useTranslations } from "next-intl";
import { Trash2, RotateCcw, FileIcon, AlertTriangle } from "lucide-react";

interface TrashedFile {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  deleted_at: string;
  expires_at: string;
  project_name: string;
  bucket_name: string;
}

interface TrashPage {
  files: TrashedFile[];
  retention_days: number;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function ExpiryBadge({ expiresAt, t }: { expiresAt: string; t: ReturnType<typeof useTranslations> }) {
  const days = daysUntil(expiresAt);
  if (days <= 0) return (
    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
      {t("expired")}
    </span>
  );
  if (days === 0) return (
    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
      {t("expiresToday")}
    </span>
  );
  const cls = days <= 3
    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
    : "bg-white/[0.04] text-gray-500 border-white/[0.07]";
  return (
    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md border ${cls}`}>
      {t("expiresIn", { days })}
    </span>
  );
}

export default function TrashPage() {
  const t = useTranslations("trash");
  const qc = useQueryClient();
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const [locale] = useState(() => typeof navigator !== "undefined" ? (navigator.language.startsWith("fr") ? "fr" : "en") : "en");

  const { data, isLoading } = useQuery<TrashPage>({
    queryKey: ["trash"],
    queryFn: () => api.get("/api/v1/trash"),
  });

  const restore = useMutation({
    mutationFn: (id: string) => api.post(`/api/v1/trash/${id}/restore`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trash"] }),
  });

  const deletePerm = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/trash/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trash"] }),
  });

  const emptyTrash = useMutation({
    mutationFn: () => api.delete("/api/v1/trash"),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["trash"] }); setConfirmEmpty(false); },
  });

  const files = data?.files ?? [];
  const retentionDays = data?.retention_days ?? 7;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-white mb-1">{t("title")}</h1>
          <p className="text-[13px] text-gray-500">
            {t("retentionNote", { days: retentionDays })}
          </p>
        </div>
        {files.length > 0 && (
          <button
            onClick={() => setConfirmEmpty(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] text-red-400 hover:bg-red-500/10 transition text-[13px] font-medium"
          >
            <Trash2 size={13} />
            {t("emptyBtn")}
          </button>
        )}
      </div>

      {/* Empty state */}
      {!isLoading && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-4">
            <Trash2 size={22} className="text-gray-600" />
          </div>
          <p className="text-[15px] font-medium text-gray-300 mb-1">{t("empty")}</p>
          <p className="text-[13px] text-gray-600 max-w-xs">{t("emptyDesc")}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[72px] rounded-xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
          ))}
        </div>
      )}

      {/* File list */}
      {!isLoading && files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.03] transition"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                <FileIcon size={14} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{f.filename}</p>
                <p className="text-[11px] text-gray-600 truncate">
                  {t("from")} {f.project_name} / {f.bucket_name} · {formatBytes(f.size_bytes)} · {t("deletedOn")} {formatDate(f.deleted_at, locale)}
                </p>
              </div>
              <ExpiryBadge expiresAt={f.expires_at} t={t} />
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => restore.mutate(f.id)}
                  disabled={restore.isPending}
                  title={t("restoreBtn")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#9b3dff]/25 bg-[#9b3dff]/[0.06] text-[#9b3dff] hover:bg-[#9b3dff]/10 transition text-[12px] font-medium disabled:opacity-40"
                >
                  <RotateCcw size={11} />
                  {t("restoreBtn")}
                </button>
                <button
                  onClick={() => deletePerm.mutate(f.id)}
                  disabled={deletePerm.isPending}
                  title={t("deleteBtn")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.06] text-red-400 hover:bg-red-500/10 transition text-[12px] font-medium disabled:opacity-40"
                >
                  <Trash2 size={11} />
                  {t("deleteBtn")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm empty modal */}
      {confirmEmpty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#0c0c14] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <p className="text-[14px] font-semibold text-white">{t("emptyBtn")}</p>
            </div>
            <p className="text-[13px] text-gray-400 mb-6">{t("emptyConfirm")}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmEmpty(false)}
                className="px-4 py-2 rounded-lg text-[13px] text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => emptyTrash.mutate()}
                disabled={emptyTrash.isPending}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
              >
                {emptyTrash.isPending ? "…" : t("emptyBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
