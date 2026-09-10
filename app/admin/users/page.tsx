"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AdminUser } from "@/types";
import { useMe } from "@/hooks/use-auth";
import { useState } from "react";
import { ShieldCheck, Crown, Plus, HardDrive } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";

const DEFAULT_QUOTA_GB = 10;

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function AdminUsersPage() {
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
  const [createError, setCreateError] = useState<string | null>(null);

  const [confirmRole, setConfirmRole] = useState<{ user: AdminUser; promote: boolean } | null>(null);
  const [editingQuota, setEditingQuota] = useState<{ userId: string; current: number | null } | null>(null);
  const [quotaInput, setQuotaInput] = useState("");

  const createAdmin = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      api.post("/api/v1/admin/users", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setCreating(false); setNewName(""); setNewEmail(""); setNewPassword(""); setCreateError(null);
    },
    onError: (e) => setCreateError(e instanceof Error ? e.message : "Failed to create admin"),
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

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">Users</h1>
          <p className="text-xs text-gray-500 mt-1">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setCreating(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#007BFF] hover:bg-blue-500 text-sm font-medium transition-colors">
            <Plus size={13} /> New admin
          </button>
        )}
      </div>

      {/* Create admin form */}
      {creating && isSuperAdmin && (
        <div className="mb-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-gray-300 mb-3">Create admin account</p>
          {createError && <p className="text-xs text-red-400 mb-3">{createError}</p>}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input autoFocus placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)}
              className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
            <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
            <input type="password" placeholder="Password (min 8)" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => createAdmin.mutate({ name: newName, email: newEmail, password: newPassword })}
              disabled={!newName.trim() || !newEmail.trim() || newPassword.length < 8 || createAdmin.isPending}
              className="px-3 py-1.5 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-sm font-medium transition-colors">
              {createAdmin.isPending ? "Creating…" : "Create admin"}
            </button>
            <button onClick={() => { setCreating(false); setCreateError(null); }}
              className="px-3 py-1.5 rounded border border-white/[0.08] text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
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
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-2.5 text-xs text-gray-600 border-b border-white/[0.07] bg-white/[0.02]">
            <span>User</span>
            <span>Last active</span>
            <span>Storage / Quota</span>
            <span>Files</span>
            <span>Quota</span>
            <span>Role</span>
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
                <div key={u.id} className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{u.name}</span>
                      {u.is_super_admin && <Crown size={11} className="text-yellow-400 shrink-0" />}
                      {u.is_admin && !u.is_super_admin && <ShieldCheck size={11} className="text-[#007BFF] shrink-0" />}
                      {isMe && <span className="text-[10px] text-gray-600">(you)</span>}
                    </div>
                    <span className="text-xs text-gray-500 truncate block">{u.email}</span>
                  </div>

                  <span className={`text-xs tabular-nums ${daysSinceActive >= 90 ? "text-orange-400" : "text-gray-500"}`}>
                    {daysSinceActive}d ago
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
                          background: usedPct > 90 ? "#ef4444" : usedPct > 70 ? "#f97316" : "#007BFF",
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
                        {u.storage_quota_bytes != null && <span className="text-[#007BFF]">*</span>}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    {isSuperAdmin && !isMe && !u.is_super_admin ? (
                      u.is_admin ? (
                        <button onClick={() => setConfirmRole({ user: u, promote: false })}
                          className="flex items-center gap-1 text-[11px] text-[#007BFF] border border-[#007BFF]/30 bg-[#007BFF]/10 px-1.5 py-0.5 rounded hover:bg-[#007BFF]/20 transition-colors">
                          <ShieldCheck size={10} /> Admin
                        </button>
                      ) : (
                        <button onClick={() => setConfirmRole({ user: u, promote: true })}
                          className="text-[11px] text-gray-600 border border-white/[0.08] px-1.5 py-0.5 rounded hover:border-white/20 hover:text-gray-400 transition-colors">
                          User
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] text-gray-600">
                        {u.is_super_admin ? "Super admin" : u.is_admin ? "Admin" : "User"}
                      </span>
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
            ? `Promote ${confirmRole.user.name} to admin?`
            : `Revoke admin from ${confirmRole.user.name}?`}
          description={confirmRole.promote
            ? "This user will gain access to the admin dashboard."
            : "This user will lose admin access immediately."}
          confirmLabel={confirmRole.promote ? "Promote" : "Revoke"}
          onConfirm={() => updateRole.mutate({ id: confirmRole.user.id, isAdmin: confirmRole.promote })}
          onCancel={() => setConfirmRole(null)}
        />
      )}
    </div>
  );
}
