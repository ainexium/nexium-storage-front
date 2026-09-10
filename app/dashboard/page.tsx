"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project, UsageSummary } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-6 py-5">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/api/v1/projects"),
  });

  const usageResults = useQueries({
    queries: projects.map((p) => ({
      queryKey: ["usage", p.id],
      queryFn: () => api.get<UsageSummary>(`/api/v1/projects/${p.id}/usage`),
    })),
  });

  const totalBuckets = usageResults.reduce((s, r) => s + (r.data?.bucket_count ?? 0), 0);
  const totalFiles   = usageResults.reduce((s, r) => s + (r.data?.file_count ?? 0), 0);
  const totalStorage = usageResults.reduce((s, r) => s + (r.data?.storage_bytes ?? 0), 0);

  return (
    <div className="px-8 py-8 max-w-4xl">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-base font-semibold">Overview</h1>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-white/[0.07] divide-x divide-white/[0.07] flex mb-10">
        <Stat value={projects.length.toString()} label="Projects" />
        <Stat value={totalBuckets.toString()} label="Buckets" />
        <Stat value={totalFiles.toString()} label="Files" />
        <Stat value={formatBytes(totalStorage)} label="Storage used" />
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-300">Recent projects</h2>
          <Link href="/dashboard/projects" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            View all
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.07] py-14 text-center">
            <p className="text-sm text-gray-600">No projects yet.</p>
            <Link href="/dashboard/projects" className="text-xs text-[#007BFF] hover:underline mt-2 inline-block">
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-gray-600 font-mono">{p.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                  <ChevronRight size={13} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
