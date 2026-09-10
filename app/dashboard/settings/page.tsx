"use client";

import { useMe } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import type { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";

export default function SettingsPage() {
  const { data: user } = useMe();
  const qc = useQueryClient();
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = useMutation({
    mutationFn: (body: object) => api.patch<User>("/api/v1/auth/me", body),
    onSuccess: (u) => {
      qc.setQueryData(["me"], u);
      setSaved("Saved");
      setEditName(false); setEditEmail(false); setEditPassword(false);
      setCurrentPw(""); setNewPw("");
      setTimeout(() => setSaved(null), 2000);
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Update failed"),
  });

  function startEdit(field: "name" | "email" | "password") {
    setError(null);
    if (field === "name") { setName(user?.name ?? ""); setEditName(true); setEditEmail(false); setEditPassword(false); }
    if (field === "email") { setEmail(user?.email ?? ""); setEditEmail(true); setEditName(false); setEditPassword(false); }
    if (field === "password") { setEditPassword(true); setEditName(false); setEditEmail(false); }
  }

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-base font-semibold">Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your account</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2 mb-6">
          <Check size={12} /> {saved}
        </div>
      )}
      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Account</h2>
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">

          {/* Name */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 w-28">Name</span>
              {editName ? (
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                    className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm text-gray-200 transition-colors" />
                  <button onClick={() => update.mutate({ name })} disabled={update.isPending}
                    className="px-2.5 py-1 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-xs font-medium transition-colors">Save</button>
                  <button onClick={() => setEditName(false)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-200">{user?.name ?? "—"}</span>
                  <button onClick={() => startEdit("name")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Edit</button>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 w-28">Email</span>
              {editEmail ? (
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm text-gray-200 transition-colors" />
                  <button onClick={() => update.mutate({ email })} disabled={update.isPending}
                    className="px-2.5 py-1 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-xs font-medium transition-colors">Save</button>
                  <button onClick={() => setEditEmail(false)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-200">{user?.email ?? "—"}</span>
                  <button onClick={() => startEdit("email")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Edit</button>
                </div>
              )}
            </div>
          </div>

          {/* Member since */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-xs text-gray-500 w-28">Member since</span>
            <span className="text-sm text-gray-200">{user ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Password</h2>
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="px-5 py-3.5">
            {editPassword ? (
              <div className="space-y-3">
                <input type="password" placeholder="Current password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
                <input type="password" placeholder="New password (min. 8 chars)" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
                <div className="flex gap-2">
                  <button onClick={() => update.mutate({ current_password: currentPw, new_password: newPw })} disabled={update.isPending || !currentPw || !newPw}
                    className="px-3 py-1.5 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-sm font-medium transition-colors">Update password</button>
                  <button onClick={() => { setEditPassword(false); setCurrentPw(""); setNewPw(""); }} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">••••••••</span>
                <button onClick={() => startEdit("password")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Change</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
