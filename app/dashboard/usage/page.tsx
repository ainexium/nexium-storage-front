"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project, UsageSummary } from "@/types";
import { useMe } from "@/hooks/use-auth";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function ProjectCard({ project, quotaBytes }: { project: Project; quotaBytes: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["usage", project.id],
    queryFn: () => api.get<UsageSummary>(`/api/v1/projects/${project.id}/usage`),
  });

  const pct = data && quotaBytes > 0
    ? Math.min((data.storage_bytes / quotaBytes) * 100, 100)
    : 0;

  return (
    <div className="rounded-xl border border-white/[0.07] p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-medium">{project.name}</h3>
        <span className="text-xs text-gray-600 font-mono">{project.slug}</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-3 rounded bg-white/[0.04] animate-pulse" />
          <div className="h-8 rounded bg-white/[0.04] animate-pulse" />
        </div>
      ) : data ? (
        <>
          {/* Storage bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{formatBytes(data.storage_bytes)}</span>
              <span>{quotaBytes === 0 ? "Unlimited" : formatBytes(quotaBytes)}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: pct > 90 ? "#ef4444" : pct > 70 ? "#f97316" : "#007BFF",
                }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1.5">
              {quotaBytes === 0 ? "No limit" : `${pct.toFixed(1)}% of quota`}
            </p>
          </div>

          {/* Buckets / Files */}
          <div className="grid grid-cols-2 divide-x divide-white/[0.07] border border-white/[0.07] rounded-lg overflow-hidden">
            <div className="px-4 py-3">
              <p className="text-lg font-semibold tabular-nums">{data.bucket_count}</p>
              <p className="text-xs text-gray-500 mt-0.5">Buckets</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-lg font-semibold tabular-nums">{data.file_count}</p>
              <p className="text-xs text-gray-500 mt-0.5">Files</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function UsagePage() {
  const { data: me } = useMe();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/api/v1/projects"),
  });

  const quotaBytes = me?.quota_bytes ?? 0;

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">Usage</h1>
          <p className="text-xs text-gray-500 mt-1">Storage consumption per project</p>
        </div>
        <span className="text-xs text-gray-500">
          Quota : {quotaBytes === 0 ? "Unlimited" : formatBytes(quotaBytes)}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <p className="text-sm text-gray-600">Create a project to track usage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectCard key={p.id} project={p} quotaBytes={quotaBytes} />)}
        </div>
      )}
    </div>
  );
}
