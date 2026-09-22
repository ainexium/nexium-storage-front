"use client";

import { useMe } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import type { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useErrorMessage } from "@/hooks/use-error-message";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const tl = useTranslations("language");
  const locale = useLocale();
  const errMsg = useErrorMessage();
  const { data: user } = useMe();
  const qc = useQueryClient();

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2500);
  }

  // Mise à jour nom / mot de passe
  const update = useMutation({
    mutationFn: (body: object) => api.patch<User>("/api/v1/auth/me", body),
    onSuccess: (u) => {
      qc.setQueryData(["me"], u);
      flash(t("saved"));
      setEditName(false); setEditPassword(false);
      setCurrentPw(""); setNewPw("");
    },
    onError: (e) => setError(errMsg(e)),
  });

  // Demande de changement d'email (envoie le code)
  const requestEmail = useMutation({
    mutationFn: () => api.post("/api/v1/auth/me/email/request", { email }),
    onSuccess: () => {
      qc.setQueryData(["me"], (prev: User | undefined) =>
        prev ? { ...prev, pending_email: email } : prev
      );
      setEditEmail(false);
      setEmailCode("");
    },
    onError: (e) => setError(errMsg(e)),
  });

  // Confirmation du code
  const confirmEmail = useMutation({
    mutationFn: () => api.post<User>("/api/v1/auth/me/email/confirm", { code: emailCode }),
    onSuccess: (u) => {
      qc.setQueryData(["me"], u);
      flash(t("saved"));
      setEmailCode("");
    },
    onError: (e) => setError(errMsg(e)),
  });

  // Annulation
  const cancelEmail = useMutation({
    mutationFn: () => api.delete("/api/v1/auth/me/email/pending"),
    onSuccess: () => {
      qc.setQueryData(["me"], (prev: User | undefined) =>
        prev ? { ...prev, pending_email: undefined } : prev
      );
      setEmailCode("");
      setEditEmail(false);
    },
    onError: (e) => setError(errMsg(e)),
  });

  function startEdit(field: "name" | "email" | "password") {
    setError(null);
    if (field === "name") { setName(user?.name ?? ""); setEditName(true); setEditEmail(false); setEditPassword(false); }
    if (field === "email") { setEmail(user?.email ?? ""); setEditEmail(true); setEditName(false); setEditPassword(false); }
    if (field === "password") { setEditPassword(true); setEditName(false); setEditEmail(false); }
  }

  const hasPending = !!user?.pending_email;

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-base font-semibold">{t("title")}</h1>
        <p className="text-xs text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2 mb-6">
          <Check size={12} /> {saved}
        </div>
      )}
      {error && (
        <div
          className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-6 cursor-pointer"
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">{t("account")}</h2>
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">

          {/* Nom */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 w-28">{t("name")}</span>
              {editName ? (
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                    className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm text-gray-200 transition-colors" />
                  <button onClick={() => update.mutate({ name })} disabled={update.isPending}
                    className="px-2.5 py-1 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-xs font-medium transition-colors">{tc("save")}</button>
                  <button onClick={() => setEditName(false)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{tc("cancel")}</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-200">{user?.name ?? "—"}</span>
                  <button onClick={() => startEdit("name")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">{tc("edit")}</button>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="px-5 py-3.5">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs text-gray-500 w-28 mt-0.5">{t("email")}</span>
              <div className="flex-1">
                {hasPending ? (
                  /* État : code envoyé, en attente de vérification */
                  <div className="space-y-2">
                    <p className="text-xs text-amber-400">
                      {t("emailPending", { email: user!.pending_email ?? "" })}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder={t("emailCode")}
                        maxLength={6}
                        className="w-36 px-2 py-1 rounded bg-white/[0.04] border border-white/[0.1] focus:border-[#007BFF] outline-none text-sm font-mono tracking-widest transition-colors"
                      />
                      <button
                        onClick={() => confirmEmail.mutate()}
                        disabled={emailCode.length !== 6 || confirmEmail.isPending}
                        className="px-2.5 py-1 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-xs font-medium transition-colors"
                      >
                        {t("confirmChange")}
                      </button>
                      <button
                        onClick={() => cancelEmail.mutate()}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {t("cancelChange")}
                      </button>
                    </div>
                    <button
                      onClick={() => { setEditEmail(true); setEmail(user!.pending_email ?? ""); }}
                      className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {t("resendCode")}
                    </button>
                  </div>
                ) : editEmail ? (
                  /* État : saisie d'un nouvel email */
                  <div className="flex items-center gap-2">
                    <input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm text-gray-200 transition-colors" />
                    <button
                      onClick={() => requestEmail.mutate()}
                      disabled={requestEmail.isPending || !email}
                      className="px-2.5 py-1 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-xs font-medium transition-colors"
                    >
                      {tc("save")}
                    </button>
                    <button onClick={() => setEditEmail(false)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{tc("cancel")}</button>
                  </div>
                ) : (
                  /* État normal */
                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm text-gray-200">{user?.email ?? "—"}</span>
                    <button onClick={() => startEdit("email")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">{tc("edit")}</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Membre depuis */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-xs text-gray-500 w-28">{t("memberSince")}</span>
            <span className="text-sm text-gray-200">{user ? new Date(user.created_at).toLocaleDateString(locale) : "—"}</span>
          </div>
        </div>
      </div>

      {/* Mot de passe */}
      <div className="mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">{t("password")}</h2>
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="px-5 py-3.5">
            {editPassword ? (
              <div className="space-y-3">
                <input type="password" placeholder={t("currentPassword")} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
                <input type="password" placeholder={t("newPasswordMin")} value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600" />
                <div className="flex gap-2">
                  <button onClick={() => update.mutate({ current_password: currentPw, new_password: newPw })} disabled={update.isPending || !currentPw || !newPw}
                    className="px-3 py-1.5 rounded bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-sm font-medium transition-colors">{t("updatePassword")}</button>
                  <button onClick={() => { setEditPassword(false); setCurrentPw(""); setNewPw(""); }} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{tc("cancel")}</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">••••••••</span>
                <button onClick={() => startEdit("password")} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">{t("change")}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Langue */}
      <div className="mb-8">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">{t("language")}</h2>
        <p className="text-xs text-gray-600 mb-3">{tl("description")}</p>
        <LanguageSwitcher variant="settings" />
      </div>
    </div>
  );
}
