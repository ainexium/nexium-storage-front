"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { useLocale, useTranslations } from "next-intl";

function InlineEdit({ project, onDone }: { project: Project; onDone: () => void }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const rename = useMutation({
    mutationFn: (name: string) => api.patch<Project>(`/api/v1/projects/${project.id}`, { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); onDone(); },
  });

  useEffect(() => { inputRef.current?.select(); }, []);

  function submit() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== project.name) rename.mutate(trimmed);
    else onDone();
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-center gap-2 flex-1 min-w-0">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        onKeyDown={(e) => e.key === "Escape" && onDone()}
        className="text-sm font-medium bg-transparent border-b border-white/20 focus:border-white/40 outline-none py-0.5 min-w-0 w-48 transition-colors"
      />
    </form>
  );
}

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const tc = useTranslations("common");
  const locale = useLocale();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/api/v1/projects"),
  });

  const create = useMutation({
    mutationFn: (name: string) => api.post<Project>("/api/v1/projects", { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); setCreating(false); setNewName(""); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">{t("title")}</h1>
          <p className="text-xs text-gray-500 mt-1">{t("count", { count: projects.length })}</p>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#06B6D4] hover:bg-cyan-400 text-sm font-medium transition-colors"
        >
          <Plus size={13} />
          {t("newWorkspace")}
        </button>
      </div>

      {creating && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (newName.trim()) create.mutate(newName.trim()); }}
          className="flex gap-2 mb-6"
        >
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="flex-1 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.1] focus:border-white/20 outline-none text-sm transition-colors placeholder:text-gray-600"
          />
          <button type="submit" disabled={!newName.trim() || create.isPending}
            className="px-3 py-1.5 rounded-md bg-[#06B6D4] hover:bg-cyan-400 disabled:opacity-40 text-sm font-medium transition-colors">
            {tc("create")}
          </button>
          <button type="button" onClick={() => { setCreating(false); setNewName(""); }}
            className="px-3 py-1.5 rounded-md border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
            {tc("cancel")}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {[1, 2, 3].map(i => <div key={i} className="h-[52px] bg-white/[0.02] animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <p className="text-sm text-gray-600">{t("empty")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center px-5 py-3.5 hover:bg-white/[0.03] group transition-colors">
              {editingId === p.id ? (
                <InlineEdit project={p} onDone={() => setEditingId(null)} />
              ) : (
                <Link href={`/dashboard/projects/${p.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{p.slug}</span>
                </Link>
              )}

              <div className="flex items-center gap-1.5 ml-4">
                {editingId !== p.id && (
                  <span className="text-xs text-gray-600 mr-1">
                    {new Date(p.created_at).toLocaleDateString(locale)}
                  </span>
                )}
                <button
                  onClick={() => setEditingId(p.id)}
                  className="p-1 rounded text-gray-600 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition"
                  title={tc("rename")}
                >
                  <Pencil size={12} />
                </button>
                <button onClick={() => setConfirmDeleteId(p.id)}
                  className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition"
                  title={tc("delete")}
                >
                  <Trash2 size={12} />
                </button>
                {editingId !== p.id && (
                  <Link href={`/dashboard/projects/${p.id}`}
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
          title={t("deleteTitle")}
          description={t("deleteBody")}
          onConfirm={() => { remove.mutate(confirmDeleteId); setConfirmDeleteId(null); }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
