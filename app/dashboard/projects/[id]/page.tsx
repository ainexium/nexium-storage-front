"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Bucket, Project } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ChevronRight, ArrowLeft, Pencil, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { useLocale, useTranslations } from "next-intl";

function InlineEdit({ bucket, projectId, onDone }: { bucket: Bucket; projectId: string; onDone: () => void }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(bucket.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const rename = useMutation({
    mutationFn: (name: string) => api.patch<Bucket>(`/api/v1/buckets/${bucket.id}`, { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["buckets", projectId] }); onDone(); },
  });

  useEffect(() => { inputRef.current?.select(); }, []);

  function submit() {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && trimmed !== bucket.name) rename.mutate(trimmed);
    else onDone();
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-center gap-2 flex-1 min-w-0">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value.toLowerCase())}
        onBlur={submit}
        onKeyDown={(e) => e.key === "Escape" && onDone()}
        className="text-sm font-mono bg-transparent border-b border-white/20 focus:border-white/40 outline-none py-0.5 min-w-0 w-48 transition-colors"
      />
    </form>
  );
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const locale = useLocale();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: project } = useQuery({
    queryKey: ["project", params.id],
    queryFn: () => api.get<Project>(`/api/v1/projects/${params.id}`),
  });

  const { data: buckets = [], isLoading } = useQuery({
    queryKey: ["buckets", params.id],
    queryFn: () => api.get<Bucket[]>(`/api/v1/projects/${params.id}/buckets`),
  });

  const create = useMutation({
    mutationFn: ({ name, is_public }: { name: string; is_public: boolean }) =>
      api.post<Bucket>(`/api/v1/projects/${params.id}/buckets`, { name, is_public }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["buckets", params.id] });
      setCreating(false); setNewName(""); setNewIsPublic(true);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/buckets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["buckets", params.id] }),
  });

  const confirmBucket = buckets.find((b) => b.id === confirmDeleteId);

  return (
    <div className="px-8 py-8 max-w-3xl">
      <Link href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-8 transition-colors">
        <ArrowLeft size={12} /> {t("back")}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">{project?.name ?? "…"}</h1>
          <code className="text-xs text-gray-600 mt-1 block">{params.id}</code>
        </div>
        <div className="flex items-center gap-2">
          <Link
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={`/dashboard/projects/${params.id}/webhooks` as any}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/[0.1] text-sm text-gray-400 hover:text-gray-200 hover:border-white/[0.2] transition-colors"
          >
            {t("webhooks")}
          </Link>
          <button
            onClick={() => setCreating(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#007BFF] hover:bg-blue-500 text-sm font-medium transition-colors"
          >
            <Plus size={13} />
            {t("newFolder")}
          </button>
        </div>
      </div>

      {creating && (
        <div className="mb-6 p-4 rounded-lg border border-white/[0.08] bg-white/[0.02] space-y-3">
          <form
            onSubmit={(e) => { e.preventDefault(); if (newName.trim()) create.mutate({ name: newName.trim(), is_public: newIsPublic }); }}
            className="flex gap-2"
          >
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value.toLowerCase())}
              placeholder={t("folderPlaceholder")}
              className="flex-1 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm font-mono transition-colors placeholder:text-gray-600"
            />
            <button type="submit" disabled={!newName.trim() || create.isPending}
              className="px-3 py-1.5 rounded-md bg-[#007BFF] hover:bg-blue-500 disabled:opacity-40 text-sm font-medium transition-colors">
              {tc("create")}
            </button>
            <button type="button" onClick={() => { setCreating(false); setNewName(""); setNewIsPublic(true); }}
              className="px-3 py-1.5 rounded-md border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
              {tc("cancel")}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setNewIsPublic(v => !v)}
            className={`flex items-center gap-2 text-xs px-2.5 py-1 rounded transition-colors ${newIsPublic ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"}`}
          >
            {newIsPublic ? <Globe size={11} /> : <Lock size={11} />}
            {newIsPublic ? t("publicHint") : t("privateHint")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {[1, 2].map(i => <div key={i} className="h-[52px] bg-white/[0.02] animate-pulse" />)}
        </div>
      ) : buckets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <p className="text-sm text-gray-600">{t("emptyFolders")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {buckets.map((b) => (
            <div key={b.id} className="flex items-center px-5 py-3.5 hover:bg-white/[0.03] group transition-colors">
              {editingId === b.id ? (
                <InlineEdit bucket={b} projectId={params.id} onDone={() => setEditingId(null)} />
              ) : (
                <Link href={`/dashboard/projects/${params.id}/buckets/${b.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-mono font-medium">{b.name}</span>
                  {b.is_public
                    ? <span className="flex items-center gap-0.5 text-[10px] text-green-500"><Globe size={9} />{tc("public")}</span>
                    : <span className="flex items-center gap-0.5 text-[10px] text-amber-500"><Lock size={9} />{tc("private")}</span>
                  }
                </Link>
              )}

              <div className="flex items-center gap-1.5 ml-4">
                {editingId !== b.id && (
                  <span className="text-xs text-gray-600 mr-1">
                    {new Date(b.created_at).toLocaleDateString(locale)}
                  </span>
                )}
                <button
                  onClick={() => setEditingId(b.id)}
                  className="p-1 rounded text-gray-600 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition"
                  title={tc("rename")}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => setConfirmDeleteId(b.id)}
                  className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition"
                  title={tc("delete")}
                >
                  <Trash2 size={12} />
                </button>
                {editingId !== b.id && (
                  <Link href={`/dashboard/projects/${params.id}/buckets/${b.id}`}
                    className="p-1 rounded text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition">
                    <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <ConfirmModal
          title={t("deleteFolderTitle", { name: confirmBucket?.name ?? "" })}
          description={t("deleteFolderBody")}
          onConfirm={() => { remove.mutate(confirmDeleteId); setConfirmDeleteId(null); }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
