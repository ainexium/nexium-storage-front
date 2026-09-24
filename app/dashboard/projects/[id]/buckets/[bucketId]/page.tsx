"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { StoredFile, Bucket, PagedFiles } from "@/types";
import { useCallback, useEffect, useRef, useState, use } from "react";
import {
  Upload, Trash2, Download, ArrowLeft, X, Copy, Check,
  Pencil, Eye, Search, CloudUpload, LayoutGrid, LayoutList,
  Play, FileText, FileCode, Table2, File, Archive,
  ChevronLeft, ChevronRight, Globe, Lock,
} from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";
import { useLocale, useTranslations } from "next-intl";
import { useErrorMessage } from "@/hooks/use-error-message";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime: string) { return mime.startsWith("image/"); }
function isVideo(mime: string) { return mime.startsWith("video/"); }
function isPDF(mime: string)   { return mime === "application/pdf"; }
function isText(mime: string)  {
  return ["text/plain", "text/csv", "application/json", "application/xml", "text/xml"].includes(mime);
}
function isPreviewable(mime: string) {
  return isImage(mime) || isVideo(mime) || isPDF(mime) || isText(mime);
}

function fileTypeInfo(mime: string): { bg: string; iconColor: string; Icon: React.ElementType; label: string } {
  if (mime === "application/pdf")  return { bg: "bg-red-950",    iconColor: "text-red-400",    Icon: FileText, label: "PDF" };
  if (mime === "application/json") return { bg: "bg-amber-950",  iconColor: "text-amber-400",  Icon: FileCode, label: "JSON" };
  if (mime === "text/csv")         return { bg: "bg-green-950",  iconColor: "text-green-400",  Icon: Table2,   label: "CSV" };
  if (mime === "text/plain")       return { bg: "bg-gray-900",   iconColor: "text-gray-400",   Icon: FileText, label: "TXT" };
  if (mime === "application/zip")  return { bg: "bg-orange-950", iconColor: "text-orange-400", Icon: Archive,  label: "ZIP" };
  if (mime === "application/xml" || mime === "text/xml") return { bg: "bg-blue-950", iconColor: "text-blue-400", Icon: FileCode, label: "XML" };
  if (isVideo(mime)) return { bg: "bg-slate-900", iconColor: "text-blue-400", Icon: Play, label: "Video" };
  return { bg: "bg-gray-900", iconColor: "text-gray-500", Icon: File, label: mime.split("/")[1]?.toUpperCase() ?? "FILE" };
}

// ─── Video thumbnail ──────────────────────────────────────────────────────────

function VideoThumbnail({ src, label, iconColor }: { src: string; label: string; iconColor: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  return (
    <div className="relative w-full h-full bg-slate-900">
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        muted
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-200 ${ready ? "opacity-100" : "opacity-0"}`}
        onLoadedMetadata={() => { if (videoRef.current) videoRef.current.currentTime = 0.5; }}
        onSeeked={() => setReady(true)}
      />
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Play size={22} className={iconColor} fill="currentColor" />
          </div>
          {label && <span className="text-xs font-mono text-gray-500 mt-2">{label}</span>}
        </div>
      )}
      {ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
            <Play size={16} className="text-white" fill="white" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BucketPage({ params }: { params: Promise<{ id: string; bucketId: string }> }) {
  const { id, bucketId } = use(params);
  const t = useTranslations("files");
  const tc = useTranslations("common");
  const errMsg = useErrorMessage();
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const uploadAbortRef = useRef<AbortController | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadPhase, setUploadPhase] = useState<"idle" | "uploading" | "saving">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nexium-file-view");
    if (saved === "list" || saved === "grid") setViewMode(saved);
  }, []);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  // Annule l'upload si l'utilisateur quitte la page, et avertit en cas de refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadAbortRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      uploadAbortRef.current?.abort();
    };
  }, []);

  function setView(mode: "grid" | "list") {
    setViewMode(mode);
    localStorage.setItem("nexium-file-view", mode);
  }

  const { data: buckets = [] } = useQuery({
    queryKey: ["buckets", id],
    queryFn: () => api.get<Bucket[]>(`/api/v1/projects/${id}/buckets`),
  });
  const bucket = buckets.find((b) => b.id === bucketId);

  const toggleVisibility = useMutation({
    mutationFn: (isPublic: boolean) =>
      api.patch<Bucket>(`/api/v1/buckets/${bucketId}`, { is_public: isPublic }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["buckets", id] });
      qc.invalidateQueries({ queryKey: ["files", bucketId] });
    },
  });

  const PER_PAGE = 24;

  const { data: pagedData, isLoading } = useQuery({
    queryKey: ["files", bucketId, debouncedSearch, page],
    queryFn: () => {
      const qs = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE) });
      if (debouncedSearch) qs.set("search", debouncedSearch);
      return api.get<PagedFiles>(`/api/v1/buckets/${bucketId}/files?${qs}`);
    },
    placeholderData: (prev) => prev,
  });

  const files = pagedData?.files ?? [];
  const total = pagedData?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  async function handleUpload(file: File) {
    setUploadError(null);
    setUploadPhase("uploading");
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    setUploadProgress(0);
    try {
      // 1. Demander une URL presignée R2
      const presign = await api.post<{
        file_id: string;
        object_key: string;
        upload_url: string;
      }>(`/api/v1/buckets/${bucketId}/files/presign`, {
        filename: file.name,
        mime_type: file.type || "application/octet-stream",
      });

      // 2. Uploader directement vers R2 (ne passe pas par Render)
      await api.putToPresignedURL(presign.upload_url, file, (pct) => {
        setUploadProgress(pct);
        if (pct >= 100) setUploadPhase("saving");
      }, controller.signal);

      // 3. Confirmer en DB
      await api.post<StoredFile>(
        `/api/v1/buckets/${bucketId}/files/confirm`,
        {
          file_id: presign.file_id,
          object_key: presign.object_key,
          filename: file.name,
          mime_type: file.type || "application/octet-stream",
          size_bytes: file.size,
        }
      );

      qc.invalidateQueries({ queryKey: ["files", bucketId] });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setUploadError(errMsg(err));
    } finally {
      uploadAbortRef.current = null;
      setUploadProgress(0);
      setUploadPhase("idle");
    }
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items?.length > 0) setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (--dragCounter.current === 0) setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketId]);

  const download = useMutation({
    mutationFn: async (fileId: string) => {
      const { url } = await api.get<{ url: string }>(`/api/v1/files/${fileId}/download`);
      window.open(url, "_blank");
    },
  });

  const rename = useMutation({
    mutationFn: ({ id, filename }: { id: string; filename: string }) =>
      api.patch<StoredFile>(`/api/v1/files/${id}`, { filename }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["files", bucketId] }); setRenamingId(null); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/files/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["files", bucketId] }),
  });

  async function copyURL(f: StoredFile) {
    let url = f.url;
    if (!url) url = (await api.get<{ url: string }>(`/api/v1/files/${f.id}/download`)).url;
    await navigator.clipboard.writeText(url);
    setCopiedId(f.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function startRename(f: StoredFile) { setRenamingId(f.id); setRenameValue(f.filename); }
  function submitRename(id: string) {
    const v = renameValue.trim();
    if (v && v !== files.find((f) => f.id === id)?.filename) rename.mutate({ id, filename: v });
    else setRenamingId(null);
  }

  const isUploading = uploadPhase !== "idle";

  // Shared action props
  const actions = { copyURL, download, startRename, setPreviewFile, setConfirmDeleteId, copiedId };

  return (
    <div
      className="px-10 py-8 max-w-6xl min-h-screen"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/90 border-2 border-dashed border-[#06B6D4]/60 pointer-events-none">
          <CloudUpload size={48} className="text-[#06B6D4] mb-3 animate-bounce" />
          <p className="text-lg font-semibold text-[#06B6D4]">{t("dropToUpload")}</p>
        </div>
      )}

      <Link href={`/dashboard/projects/${id}`} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-8 transition-colors">
        <ArrowLeft size={12} /> {t("workspace")}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-lg font-semibold font-mono">{bucket?.name ?? "…"}</h1>
            {bucket && (
              <button
                onClick={() => toggleVisibility.mutate(!bucket.is_public)}
                disabled={toggleVisibility.isPending}
                className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded transition-colors disabled:opacity-50 ${
                  bucket.is_public
                    ? "text-green-500 bg-green-500/10 hover:bg-green-500/20"
                    : "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                }`}
                title={bucket.is_public ? t("makePrivate") : t("makePublic")}
              >
                {bucket.is_public ? <Globe size={9} /> : <Lock size={9} />}
                {bucket.is_public ? tc("public") : tc("private")}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-600">{t("fileCount", { count: total })}{debouncedSearch ? ` · "${debouncedSearch}"` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="pl-8 pr-3 py-1.5 bg-[#111118] border border-gray-800 rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-600 w-44"
            />
          </div>
          {/* View toggle */}
          <div className="flex items-center border border-gray-800 rounded overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 transition ${viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-300"}`}
              title={t("gridView")}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 transition ${viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-300"}`}
              title={t("listView")}
            >
              <LayoutList size={15} />
            </button>
          </div>
          {/* Upload */}
          <input ref={fileInput} type="file" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
          <button
            onClick={() => fileInput.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06B6D4] hover:bg-cyan-400 disabled:opacity-40 rounded text-sm font-medium transition-colors"
          >
            <Upload size={13} />
            {uploadPhase === "saving" ? t("saving") : uploadPhase === "uploading" ? t("uploading") : t("upload")}
          </button>
        </div>
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-gray-500">
              {uploadPhase === "saving" ? t("savingToStorage") : t("uploading")}
            </p>
            {uploadPhase === "uploading" && (
              <span className="text-xs tabular-nums text-gray-500">{uploadProgress}%</span>
            )}
          </div>
          <div className="relative h-1 bg-gray-800 overflow-hidden rounded-full">
            {uploadPhase === "saving" ? (
              <div className="animate-slide-bar" />
            ) : (
              <div
                className="h-full bg-[#06B6D4] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            )}
          </div>
        </div>
      )}
      {uploadError && (
        <div className="mb-5 flex items-center gap-3 rounded border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <span className="flex-1">{uploadError}</span>
          <button onClick={() => setUploadError(null)}><X size={12} /></button>
        </div>
      )}

      {/* Content */}
      {isLoading && !pagedData ? (
        <div className={viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          : "divide-y divide-gray-800/60 border border-gray-800/60 rounded-lg overflow-hidden"}>
          {Array.from({ length: 8 }).map((_, i) =>
            viewMode === "grid"
              ? <div key={i} className="aspect-square rounded-xl bg-gray-900/50 animate-pulse" />
              : <div key={i} className="h-11 bg-gray-900/30 animate-pulse" />
          )}
        </div>
      ) : files.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-gray-800 rounded-xl">
          <CloudUpload size={36} className="mx-auto text-gray-700 mb-3" />
          <p className="text-sm text-gray-600">
            {debouncedSearch ? t("emptySearch", { query: debouncedSearch }) : t("emptyDrop")}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <GridView
          files={files}
          actions={actions}
          renamingId={renamingId}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          submitRename={submitRename}
          cancelRename={() => setRenamingId(null)}
        />
      ) : (
        <ListView
          files={files}
          actions={actions}
          renamingId={renamingId}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          submitRename={submitRename}
          cancelRename={() => setRenamingId(null)}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Delete confirm */}
      {confirmDeleteId && (
        <ConfirmModal
          title={t("deleteTitle")}
          description={t("deleteBody")}
          onConfirm={() => { remove.mutate(confirmDeleteId); setConfirmDeleteId(null); }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      {/* Preview modal — images, vidéos, PDFs, texte */}
      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}

// ─── Action buttons (shared) ──────────────────────────────────────────────────

type ActionProps = {
  copyURL: (f: StoredFile) => void;
  download: { mutate: (id: string) => void };
  startRename: (f: StoredFile) => void;
  setPreviewFile: (f: StoredFile) => void;
  setConfirmDeleteId: (id: string) => void;
  copiedId: string | null;
};

function ActionButtons({ f, actions, size = 12, className = "" }: { f: StoredFile; actions: ActionProps; size?: number; className?: string }) {
  const t = useTranslations("files");
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {f.url && (
        <button onClick={(e) => { e.stopPropagation(); actions.copyURL(f); }}
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition" title={t("copyUrl")}>
          {actions.copiedId === f.id ? <Check size={size} className="text-green-400" /> : <Copy size={size} />}
        </button>
      )}
      {isPreviewable(f.mime_type) && (
        <button onClick={(e) => { e.stopPropagation(); actions.setPreviewFile(f); }}
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition" title={t("preview")}>
          <Eye size={size} />
        </button>
      )}
      <button onClick={(e) => { e.stopPropagation(); actions.download.mutate(f.id); }}
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition" title={t("download")}>
        <Download size={size} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); actions.startRename(f); }}
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition" title={t("rename")}>
        <Pencil size={size} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); actions.setConfirmDeleteId(f.id); }}
        className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition" title={t("delete")}>
        <Trash2 size={size} />
      </button>
    </div>
  );
}

// ─── Grid view ────────────────────────────────────────────────────────────────

function GridView({ files, actions, renamingId, renameValue, setRenameValue, submitRename, cancelRename }: {
  files: StoredFile[];
  actions: ActionProps;
  renamingId: string | null;
  renameValue: string;
  setRenameValue: (v: string) => void;
  submitRename: (id: string) => void;
  cancelRename: () => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {files.map((f) => (
        <GridCard
          key={f.id}
          f={f}
          actions={actions}
          renamingId={renamingId}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          submitRename={submitRename}
          cancelRename={cancelRename}
        />
      ))}
    </div>
  );
}

function GridCard({ f, actions, renamingId, renameValue, setRenameValue, submitRename, cancelRename }: {
  f: StoredFile;
  actions: ActionProps;
  renamingId: string | null;
  renameValue: string;
  setRenameValue: (v: string) => void;
  submitRename: (id: string) => void;
  cancelRename: () => void;
}) {
  const isRenaming = renamingId === f.id;
  const info = fileTypeInfo(f.mime_type);

  return (
    <div className="group relative rounded-xl border border-gray-800/60 bg-[#111118] overflow-hidden flex flex-col hover:border-gray-700 transition-colors">
      {/* Preview area */}
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center ${isImage(f.mime_type) && f.url ? "" : info.bg} ${isPreviewable(f.mime_type) ? "cursor-pointer" : ""}`}
        onDoubleClick={() => isPreviewable(f.mime_type) && actions.setPreviewFile(f)}
      >
        {isImage(f.mime_type) && f.url ? (
          <img
            src={f.url}
            alt={f.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : isVideo(f.mime_type) ? (
          f.url
            ? <VideoThumbnail src={f.url} label={info.label} iconColor={info.iconColor} />
            : <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Play size={22} className={info.iconColor} fill="currentColor" />
                </div>
                <span className="text-xs font-mono text-gray-500">{info.label}</span>
              </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <info.Icon size={32} className={info.iconColor} />
            <span className={`text-xs font-mono font-bold ${info.iconColor}`}>{info.label}</span>
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ActionButtons f={f} actions={actions} size={14} className="flex-wrap justify-center" />
        </div>
      </div>

      {/* Info bar */}
      <div className="px-2.5 py-2 flex-1 min-w-0">
        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRename(f.id);
              if (e.key === "Escape") cancelRename();
            }}
            onBlur={() => submitRename(f.id)}
            className="w-full text-xs bg-[#0a0a0f] border border-[#06B6D4] rounded px-1.5 py-0.5 focus:outline-none text-white"
          />
        ) : (
          <p
            className="text-xs text-gray-300 truncate cursor-default"
            title={f.filename}
            onDoubleClick={() => actions.startRename(f)}
          >
            {f.filename}
          </p>
        )}
        <p className="text-[10px] text-gray-600 mt-0.5">{formatBytes(f.size_bytes)}</p>
      </div>
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListView({ files, actions, renamingId, renameValue, setRenameValue, submitRename, cancelRename }: {
  files: StoredFile[];
  actions: ActionProps;
  renamingId: string | null;
  renameValue: string;
  setRenameValue: (v: string) => void;
  submitRename: (id: string) => void;
  cancelRename: () => void;
}) {
  const t = useTranslations("files");
  const locale = useLocale();
  return (
    <div className="divide-y divide-gray-800/60 border border-gray-800/60 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs text-gray-600 border-b border-gray-800/60">
        <span />
        <span>{t("name")}</span>
        <span>{t("type")}</span>
        <span>{t("size")}</span>
        <span>{t("added")}</span>
        <span />
      </div>
      {files.map((f) => {
        const info = fileTypeInfo(f.mime_type);
        const isRenaming = renamingId === f.id;
        return (
          <div key={f.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-2 hover:bg-white/[0.02] group transition-colors">
            {/* Thumbnail / icon */}
            <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ background: isImage(f.mime_type) ? undefined : undefined }}
            >
              {isImage(f.mime_type) && f.url
                ? <img src={f.url} alt="" className="w-8 h-8 object-cover rounded-md" loading="lazy" />
                : isVideo(f.mime_type) && f.url
                  ? <div className="w-8 h-8 rounded-md overflow-hidden relative">
                      <VideoThumbnail src={f.url} label="" iconColor={info.iconColor} />
                    </div>
                  : isVideo(f.mime_type)
                    ? <div className={`w-8 h-8 rounded-md ${info.bg} flex items-center justify-center`}><Play size={14} className={info.iconColor} fill="currentColor" /></div>
                    : <div className={`w-8 h-8 rounded-md ${info.bg} flex items-center justify-center`}><info.Icon size={14} className={info.iconColor} /></div>
              }
            </div>

            {/* Filename */}
            {isRenaming ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename(f.id);
                  if (e.key === "Escape") cancelRename();
                }}
                onBlur={() => submitRename(f.id)}
                className="text-sm bg-[#111118] border border-[#06B6D4] rounded px-2 py-0.5 focus:outline-none w-full"
              />
            ) : (
              <span className="text-sm truncate cursor-default" title={f.filename} onDoubleClick={() => actions.startRename(f)}>
                {f.filename}
              </span>
            )}

            <span className={`text-xs font-mono font-semibold ${info.iconColor}`}>{info.label}</span>
            <span className="text-xs text-gray-500">{formatBytes(f.size_bytes)}</span>
            <span className="text-xs text-gray-600">{new Date(f.created_at).toLocaleDateString(locale)}</span>

            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition">
              <ActionButtons f={f} actions={actions} size={12} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Preview modal ────────────────────────────────────────────────────────────

function PreviewModal({ file, onClose }: { file: StoredFile; onClose: () => void }) {
  const t = useTranslations("files");
  const { data, isLoading } = useQuery({
    queryKey: ["download-url", file.id],
    queryFn: () => api.get<{ url: string }>(`/api/v1/files/${file.id}/download`),
    enabled: !file.url,
    staleTime: 55 * 60 * 1000,
  });
  const url = file.url || data?.url;

  const isPdf   = isPDF(file.mime_type);
  const isVid   = isVideo(file.mime_type);
  const isImg   = isImage(file.mime_type);
  const isTxt   = isText(file.mime_type);

  const wideModal = isPdf || isVid;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col bg-[#111118] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden
          ${wideModal ? "w-full max-w-5xl" : "max-w-3xl w-full"}`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono text-gray-400 truncate">{file.filename}</span>
            <span className="text-[10px] text-gray-600 flex-shrink-0">{formatBytes(file.size_bytes)}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={12} /> {t("openTab")}
              </a>
            )}
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0">
          {isLoading || !url ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-gray-700 border-t-[#06B6D4] rounded-full animate-spin" />
            </div>
          ) : isImg ? (
            <div className="flex items-center justify-center p-4 bg-[#0a0a0f]" style={{ minHeight: 300 }}>
              <img src={url} alt={file.filename} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
            </div>
          ) : isVid ? (
            <div className="bg-black flex items-center justify-center" style={{ minHeight: 300 }}>
              <video
                controls
                autoPlay={false}
                className="w-full max-h-[75vh]"
                style={{ outline: "none" }}
              >
                <source src={url} type={file.mime_type} />
                {t("noVideo")}
              </video>
            </div>
          ) : isPdf ? (
            <iframe
              src={url}
              title={file.filename}
              className="w-full"
              style={{ height: "80vh", border: "none" }}
            />
          ) : isTxt ? (
            <TextPreview file={file} mime={file.mime_type} />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500">
              <File size={32} />
              <p className="text-sm">{t("noPreview")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Text / JSON / CSV preview ────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function TextPreview({ file, mime }: { file: StoredFile; mime: string }) {
  const t = useTranslations("files");
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Public: f.url pointe vers l'endpoint NEXIUM qui proxie depuis R2 (pas de CORS).
    // Privé: f.url est vide, on utilise /stream (JWT requis) sur le même domaine API.
    const fetchUrl = file.url
      ? file.url
      : `${API_BASE}/api/v1/files/${file.id}/stream`;

    const headers: Record<string, string> = {};
    if (!file.url) {
      const token = localStorage.getItem("access_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(fetchUrl, { headers })
      .then((r) => r.text())
      .then((txt) => {
        if (mime === "application/json") {
          try { setContent(JSON.stringify(JSON.parse(txt), null, 2)); return; } catch {}
        }
        setContent(txt);
      })
      .catch(() => setError(true));
  }, [file.url, file.id, mime]);

  if (error) return (
    <div className="flex items-center justify-center h-48 text-sm text-red-400">
      {t("loadFailed")}
    </div>
  );
  if (!content) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-[#06B6D4] rounded-full animate-spin" />
    </div>
  );

  if (mime === "text/csv") return <CsvPreview content={content} />;

  return (
    <pre className="p-4 text-xs text-gray-300 font-mono leading-relaxed overflow-auto whitespace-pre-wrap break-all"
      style={{ maxHeight: "75vh" }}>
      {content}
    </pre>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  const range = getPageRange(page, totalPages);
  const btn = "w-8 h-8 flex items-center justify-center rounded text-sm transition-colors";
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${btn} text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <ChevronLeft size={15} />
      </button>
      {range.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-600 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btn} font-mono ${p === page ? "bg-[#06B6D4] text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`${btn} text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function CsvPreview({ content }: { content: string }) {
  const rows = content.trim().split("\n").map((r) => r.split(","));
  const [header, ...body] = rows;
  return (
    <div className="overflow-auto" style={{ maxHeight: "75vh" }}>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-900/80 sticky top-0">
            {header.map((cell, i) => (
              <th key={i} className="px-3 py-2 text-left text-gray-400 font-semibold border-b border-gray-800 whitespace-nowrap">
                {cell.replace(/^"|"$/g, "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-800/50 hover:bg-white/[0.02]">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-gray-300 font-mono whitespace-nowrap">
                  {cell.replace(/^"|"$/g, "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
