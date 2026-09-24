"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { APIKey, Project } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Check } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";
import { useLocale, useTranslations } from "next-intl";

interface CreateKeyResponse { api_key: APIKey; key: string; }

export default function APIKeysPage() {
  const t = useTranslations("apiKeys");
  const tc = useTranslations("common");
  const locale = useLocale();
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/api/v1/projects"),
  });

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const { data: allKeys = [] } = useQuery({
    queryKey: ["api-keys", selectedProject],
    queryFn: () => api.get<APIKey[]>(`/api/v1/projects/${selectedProject}/api-keys`),
    enabled: !!selectedProject,
  });

  const keys = allKeys.filter((k) => !k.revoked_at);

  const create = useMutation({
    mutationFn: (name: string) =>
      api.post<CreateKeyResponse>(`/api/v1/projects/${selectedProject}/api-keys`, { name }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["api-keys", selectedProject] });
      setRevealed(data.key);
      setCreating(false);
      setNewKeyName("");
    },
  });

  const revoke = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/api-keys/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys", selectedProject] }),
  });

  const copyKey = async () => {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">{t("title")}</h1>
          <p className="text-xs text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        {selectedProject && (
          <button onClick={() => setCreating(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#06B6D4] hover:bg-cyan-400 text-sm font-medium transition-colors">
            <Plus size={13} /> {t("newKey")}
          </button>
        )}
      </div>

      {projects.length > 1 && (
        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-1.5">{t("project")}</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-sm outline-none text-gray-200"
          >
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      {revealed && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-xs text-gray-400 mb-3">{t("copyOnce")}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono text-gray-200 bg-black/30 px-3 py-2 rounded-md truncate border border-white/[0.06]">
              {revealed}
            </code>
            <button onClick={copyKey}
              className="p-2 rounded-md border border-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white transition-colors">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
          <button onClick={() => setRevealed(null)} className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors">
            {t("savedDismiss")}
          </button>
        </div>
      )}

      {creating && (
        <form
          onSubmit={(e) => { e.preventDefault(); create.mutate(newKeyName); }}
          className="flex gap-2 mb-6"
        >
          <input autoFocus value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="flex-1 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600"
          />
          <button type="submit" disabled={!newKeyName.trim() || create.isPending}
            className="px-3 py-1.5 rounded-md bg-[#06B6D4] hover:bg-cyan-400 disabled:opacity-40 text-sm font-medium transition-colors">
            {t("generate")}
          </button>
          <button type="button" onClick={() => setCreating(false)}
            className="px-3 py-1.5 rounded-md border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
            {tc("cancel")}
          </button>
        </form>
      )}

      {keys.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <p className="text-sm text-gray-600">{t("empty")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {keys.map((k) => (
            <div key={k.id}
              className={`flex items-center justify-between px-5 py-3.5 group transition-colors ${k.revoked_at ? "opacity-40" : "hover:bg-white/[0.03]"}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{k.name}</span>
                  {k.revoked_at && (
                    <span className="text-[10px] text-red-400 border border-red-400/30 px-1.5 py-0.5 rounded">{t("revoked")}</span>
                  )}
                </div>
                <code className="text-xs text-gray-600 font-mono mt-0.5 block">{k.prefix}••••••••</code>
              </div>
              <div className="flex items-center gap-3">
                {k.last_used_at && (
                  <span className="text-xs text-gray-600">{t("lastUsed", { date: new Date(k.last_used_at).toLocaleDateString(locale) })}</span>
                )}
                {!k.revoked_at && (
                  <button onClick={() => setConfirmRevokeId(k.id)}
                    className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {confirmRevokeId && (
        <ConfirmModal
          title={t("revokeTitle")}
          description={t("revokeBody")}
          confirmLabel={t("revoke")}
          onConfirm={() => { revoke.mutate(confirmRevokeId); setConfirmRevokeId(null); }}
          onCancel={() => setConfirmRevokeId(null)}
        />
      )}
    </div>
  );
}
