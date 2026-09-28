"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { APIKey, Bucket, Project } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Check, FolderOpen } from "lucide-react";
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
  const [scopeMode, setScopeMode] = useState<"all" | "specific">("all");
  const [selectedBucketIds, setSelectedBucketIds] = useState<string[]>([]);

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

  const { data: buckets = [] } = useQuery({
    queryKey: ["buckets", selectedProject],
    queryFn: () => api.get<Bucket[]>(`/api/v1/projects/${selectedProject}/buckets`),
    enabled: !!selectedProject && creating,
  });

  const keys = allKeys.filter((k) => !k.revoked_at);

  const create = useMutation({
    mutationFn: (payload: { name: string; allowed_bucket_ids: string[] | null }) =>
      api.post<CreateKeyResponse>(`/api/v1/projects/${selectedProject}/api-keys`, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["api-keys", selectedProject] });
      setRevealed(data.key);
      setCreating(false);
      setNewKeyName("");
      setScopeMode("all");
      setSelectedBucketIds([]);
    },
  });

  const revoke = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/api-keys/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys", selectedProject] }),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const allowed_bucket_ids = scopeMode === "specific" && selectedBucketIds.length > 0
      ? selectedBucketIds
      : null;
    create.mutate({ name: newKeyName.trim(), allowed_bucket_ids });
  }

  function toggleBucket(id: string) {
    setSelectedBucketIds(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }

  const copyKey = async () => {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function cancelCreate() {
    setCreating(false);
    setNewKeyName("");
    setScopeMode("all");
    setSelectedBucketIds([]);
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">{t("title")}</h1>
          <p className="text-xs text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        {selectedProject && (
          <button onClick={() => setCreating(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#9b3dff] hover:bg-[#aa55ff] text-sm font-medium transition-colors">
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
        <form onSubmit={handleCreate} className="mb-6 p-4 rounded-lg border border-white/[0.08] bg-white/[0.02] space-y-4">
          <input
            autoFocus
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600"
          />

          {/* Bucket scope */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">{t("bucketScope")}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setScopeMode("all")}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${scopeMode === "all" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {t("allBuckets")}
              </button>
              <button type="button" onClick={() => setScopeMode("specific")}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${scopeMode === "specific" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {t("specificBuckets")}
              </button>
            </div>

            {scopeMode === "specific" && (
              <div className="space-y-1 pt-1">
                {buckets.length === 0 ? (
                  <p className="text-xs text-gray-600">{t("noBuckets")}</p>
                ) : (
                  buckets.map(b => (
                    <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBucketIds.includes(b.id)}
                        onChange={() => toggleBucket(b.id)}
                        className="accent-[#9b3dff] w-3.5 h-3.5"
                      />
                      <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">{b.name}</span>
                    </label>
                  ))
                )}
                {scopeMode === "specific" && selectedBucketIds.length > 0 && (
                  <p className="text-[10px] text-gray-600 pt-1">{t("scopeHint")}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit"
              disabled={!newKeyName.trim() || create.isPending || (scopeMode === "specific" && selectedBucketIds.length === 0)}
              className="px-3 py-1.5 rounded-md bg-[#9b3dff] hover:bg-[#aa55ff] disabled:opacity-40 text-sm font-medium transition-colors">
              {t("generate")}
            </button>
            <button type="button" onClick={cancelCreate}
              className="px-3 py-1.5 rounded-md border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
              {tc("cancel")}
            </button>
          </div>
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
                {k.allowed_bucket_ids && k.allowed_bucket_ids.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <FolderOpen size={10} className="text-violet-400" />
                    <span className="text-[10px] text-violet-400">
                      {k.allowed_bucket_ids.length} dossier{k.allowed_bucket_ids.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
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
