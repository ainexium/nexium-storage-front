"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AdminUser } from "@/types";
import { useMe } from "@/hooks/use-auth";
import { useState } from "react";
import { ShieldCheck, Crown, Plus, HardDrive, Trash2, BadgeCheck, AlertCircle } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";
import { useTranslations } from "next-intl";
import { useErrorMessage } from "@/hooks/use-error-message";
import { PasswordInput } from "@/components/ui";

const DEFAULT_QUOTA_GB = 10;

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function AdminUsersPage() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const errMsg = useErrorMessage();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const isSuperAdmin = me?.is_super_admin ?? false;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<AdminUser[]>("/api/v1/admin/users"),
  });

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [newVerified, setNewVerified] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);

  const [confirmRole, setConfirmRole] = useState<{ user: AdminUser; promote: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [editingQuota, setEditingQuota] = useState<{ userId: string; current: number | null } | null>(null);
  const [quotaInput, setQuotaInput] = useState("");

  const createUser = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; is_admin: boolean; verified: boolean }) =>
      api.post("/api/v1/admin/users", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setCreating(false); setNewName(""); setNewEmail(""); setNewPassword("");
      setNewIsAdmin(false); setNewVerified(true); setCreateError(null);
    },
    onError: (e) => setCreateError(errMsg(e) || t("createFailed")),
  });

  const verifyUser = useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/admin/users/${id}/verify`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const updateRole = useMutation({
    mutationFn: ({ id, isAdmin }: { id: string; isAdmin: boolean }) =>
      api.patch(`/api/v1/admin/users/${id}/role`, { is_admin: isAdmin }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); setConfirmRole(null); },
  });

  const setQuota = useMutation({
    mutationFn: ({ id, quotaGb }: { id: string; quotaGb: number | null }) =>
      api.patch(`/api/v1/admin/users/${id}/quota`, { quota_gb: quotaGb }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); setEditingQuota(null); },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/admin/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); setConfirmDelete(null); },
  });

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">{t("usersTitle")}</h1>
          <p className="text-xs text-gray-500 mt-1">{t("usersCount", { count: users.length })}</p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setCreating(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#9b3dff] hover:bg-[#aa55ff] text-sm font-medium transition-colors">
            <Plus size={13} /> {t("newAdmin")}
          </button>
        )}
      </div>

      {/* Create user form */}
      {creating && isSuperAdmin && (
        <div className="mb-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-gray-300 mb-3">{t("createAdmin")}</p>
          {createError && <p className="text-xs text-red-400 mb-3">{createError}</p>}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input autoFocus placeholder={t("fullName")} value={newName} onChange={e => setNewName(e.target.value)}
              className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
            <input type="email" placeholder={t("email")} value={newEmail} onChange={e => setNewEmail(e.target.value)}
              className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
            <PasswordInput placeholder={t("passwordMin")} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={newVerified} onChange={e => setNewVerified(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#9b3dff]" />
              Vérifié directement
              <span className="text-gray-600">{newVerified ? "— pas d'email envoyé" : "— email de vérification envoyé"}</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={newIsAdmin} onChange={e => setNewIsAdmin(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#9b3dff]" />
              Admin
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => createUser.mutate({ name: newName, email: newEmail, password: newPassword, is_admin: newIsAdmin, verified: newVerified })}
              disabled={!newName.trim() || !newEmail.trim() || newPassword.length < 8 || createUser.isPending}
              className="px-3 py-1.5 rounded bg-[#9b3dff] hover:bg-[#aa55ff] disabled:opacity-40 text-sm font-medium transition-colors">
              {createUser.isPending ? t("creating") : t("createAdminBtn")}
            </button>
            <button onClick={() => { setCreating(false); setCreateError(null); }}
              className="px-3 py-1.5 rounded border border-white/[0.08] text-sm text-gray-400 hover:text-white transition-colors">
              {tc("cancel")}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {[1,2,3].map(i => <div key={i} className="h-[52px] bg-white/[0.02] animate-pulse" />)}
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-4 px-5 py-2.5 text-xs text-gray-600 border-b border-white/[0.07] bg-white/[0.02]">
            <span>{t("user")}</span>
            <span>{t("lastActive")}</span>
            <span>{t("storageQuota")}</span>
            <span>{t("files")}</span>
            <span>{t("quota")}</span>
            <span>{t("role")}</span>
            <span />
          </div>
          <div className="divide-y divide-white/[0.07]">
            {users.map((u) => {
              const isMe = u.id === me?.id;
              const quotaGB = u.storage_quota_bytes != null
                ? u.storage_quota_bytes / 1024 ** 3
                : DEFAULT_QUOTA_GB;
              const usedPct = quotaGB > 0
                ? Math.min(100, (u.storage_bytes / (quotaGB * 1024 ** 3)) * 100)
                : 0;
              const daysSinceActive = Math.floor(
                (Date.now() - new Date(u.last_active_at).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={u.id} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{u.name}</span>
                      {u.is_super_admin && <Crown size={11} className="text-yellow-400 shrink-0" />}
                      {u.is_admin && !u.is_super_admin && <ShieldCheck size={11} className="text-[#9b3dff] shrink-0" />}
                      {!u.is_verified && <AlertCircle size={11} className="text-orange-400 shrink-0" />}
                      {isMe && <span className="text-[10px] text-gray-600">{t("you")}</span>}
                    </div>
                    <span className="text-xs text-gray-500 truncate block">{u.email}</span>
                  </div>

                  <span className={`text-xs tabular-nums ${daysSinceActive >= 90 ? "text-orange-400" : "text-gray-500"}`}>
                    {t("daysAgo", { days: daysSinceActive })}
                  </span>

                  <div className="text-right">
                    <span className="text-xs text-gray-300 tabular-nums">
                      {formatBytes(u.storage_bytes)} / {quotaGB === 0 ? "∞" : `${quotaGB}GB`}
                    </span>
                    <div className="w-20 h-0.5 bg-white/[0.06] rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${usedPct}%`,
                          background: usedPct > 90 ? "#ef4444" : usedPct > 70 ? "#f97316" : "#9b3dff",
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-sm tabular-nums text-gray-300">{u.file_count}</span>

                  <div className="flex items-center justify-end">
                    {isSuperAdmin && editingQuota?.userId === u.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          autoFocus
                          type="number"
                          min="0"
                          placeholder={`${DEFAULT_QUOTA_GB}`}
                          value={quotaInput}
                          onChange={e => setQuotaInput(e.target.value)}
                          className="w-14 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.15] text-xs outline-none text-center"
                          onKeyDown={e => {
                            if (e.key === "Enter") setQuota.mutate({ id: u.id, quotaGb: quotaInput === "" ? null : Number(quotaInput) });
                            if (e.key === "Escape") setEditingQuota(null);
                          }}
                        />
                        <span className="text-xs text-gray-600">GB</span>
                        <button onClick={() => setQuota.mutate({ id: u.id, quotaGb: quotaInput === "" ? null : Number(quotaInput) })}
                          className="text-[11px] text-green-400 hover:text-green-300">✓</button>
                        <button onClick={() => setEditingQuota(null)}
                          className="text-[11px] text-gray-600 hover:text-gray-400">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingQuota({ userId: u.id, current: u.storage_quota_bytes }); setQuotaInput(""); }}
                        disabled={!isSuperAdmin}
                        className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-300 transition-colors disabled:cursor-default"
                      >
                        <HardDrive size={10} />
                        {u.storage_quota_bytes == null ? `${DEFAULT_QUOTA_GB}GB` : quotaGB === 0 ? "∞" : `${quotaGB}GB`}
                        {u.storage_quota_bytes != null && <span className="text-[#9b3dff]">*</span>}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    {isSuperAdmin && !isMe && !u.is_super_admin ? (
                      u.is_admin ? (
                        <button onClick={() => setConfirmRole({ user: u, promote: false })}
                          className="flex items-center gap-1 text-[11px] text-[#9b3dff] border border-[#9b3dff]/30 bg-[#9b3dff]/10 px-1.5 py-0.5 rounded hover:bg-[#9b3dff]/20 transition-colors">
                          <ShieldCheck size={10} /> {tn("admin")}
                        </button>
                      ) : (
                        <button onClick={() => setConfirmRole({ user: u, promote: true })}
                          className="text-[11px] text-gray-600 border border-white/[0.08] px-1.5 py-0.5 rounded hover:border-white/20 hover:text-gray-400 transition-colors">
                          {t("user")}
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] text-gray-600">
                        {u.is_super_admin ? tn("superAdmin") : u.is_admin ? tn("admin") : t("user")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-0.5">
                    {isSuperAdmin && !u.is_verified && !u.is_super_admin && (
                      <button
                        onClick={() => verifyUser.mutate(u.id)}
                        disabled={verifyUser.isPending}
                        className="p-1 text-gray-700 hover:text-green-400 transition-colors disabled:opacity-40"
                      >
                        <BadgeCheck size={13} />
                      </button>
                    )}
                    {isSuperAdmin && !isMe && !u.is_super_admin && (
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="p-1 text-gray-700 hover:text-red-400 transition-colors"
                        title={t("deleteUser")}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {confirmRole && (
        <ConfirmModal
          title={confirmRole.promote
            ? t("promoteTitle", { name: confirmRole.user.name })
            : t("revokeTitle", { name: confirmRole.user.name })}
          description={confirmRole.promote
            ? t("promoteBody")
            : t("revokeBody")}
          confirmLabel={confirmRole.promote ? t("promote") : t("revoke")}
          onConfirm={() => updateRole.mutate({ id: confirmRole.user.id, isAdmin: confirmRole.promote })}
          onCancel={() => setConfirmRole(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title={t("deleteUserTitle", { name: confirmDelete.name })}
          description={t("deleteUserBody")}
          confirmLabel={t("deleteUser")}
          onConfirm={() => deleteUser.mutate(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
