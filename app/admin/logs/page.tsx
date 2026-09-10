"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ActivityLog } from "@/types";
import { useState } from "react";
import { ShieldCheck, Crown, RefreshCw } from "lucide-react";

const ACTION_GROUPS = [
  { label: "All",      value: "" },
  { label: "Auth",     value: "auth" },
  { label: "Admin",    value: "admin" },
  { label: "Files",    value: "file" },
  { label: "Projects", value: "project" },
  { label: "Buckets",  value: "bucket" },
];

function actionLabel(action: string): string {
  const map: Record<string, string> = {
    "auth.login": "Logged in",
    "auth.logout": "Logged out",
    "auth.register": "Registered",
    "auth.profile.update": "Updated profile",
    "admin.user.create": "Created admin",
    "admin.role.grant": "Granted admin role",
    "admin.role.revoke": "Revoked admin role",
    "file.upload": "Uploaded file",
    "file.delete": "Deleted file",
    "project.create": "Created project",
    "project.delete": "Deleted project",
    "bucket.create": "Created bucket",
    "bucket.delete": "Deleted bucket",
  };
  return map[action] ?? action;
}

function actionColor(action: string): string {
  if (action.startsWith("auth")) return "text-blue-400";
  if (action.startsWith("admin")) return "text-yellow-400";
  if (action.includes("delete") || action.includes("revoke")) return "text-red-400";
  return "text-green-400";
}

export default function AdminLogsPage() {
  const [actionFilter, setActionFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-logs", actionFilter],
    queryFn: () => {
      const params = new URLSearchParams({ limit: "200" });
      if (actionFilter) params.set("action", actionFilter);
      return api.get<ActivityLog[]>(`/api/v1/admin/logs?${params}`);
    },
    refetchInterval: autoRefresh ? 10000 : false,
  });

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-semibold">Activity logs</h1>
          <p className="text-xs text-gray-500 mt-1">Last {logs.length} events across all users</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoRefresh(v => !v)}
            className={`text-xs px-2.5 py-1.5 rounded border transition-colors ${
              autoRefresh
                ? "border-[#007BFF]/40 bg-[#007BFF]/10 text-[#007BFF]"
                : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
            }`}
          >
            {autoRefresh ? "Live ●" : "Live"}
          </button>
          <button onClick={() => refetch()}
            className="p-1.5 rounded border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 transition-colors">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {ACTION_GROUPS.map(({ label, value }) => (
          <button key={value} onClick={() => setActionFilter(value)}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              actionFilter === value
                ? "bg-white/[0.08] text-white font-medium"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.07]">
          {[1,2,3,4,5].map(i => <div key={i} className="h-11 bg-white/[0.02] animate-pulse" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-16 text-center">
          <p className="text-sm text-gray-600">No logs yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-2.5 text-xs text-gray-600 border-b border-white/[0.07] bg-white/[0.02]">
            <span>Time</span>
            <span>User</span>
            <span>Action</span>
            <span>Resource</span>
          </div>
          <div className="divide-y divide-white/[0.06] max-h-[calc(100vh-280px)] overflow-auto">
            {logs.map((l) => (
              <div key={l.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-2.5 hover:bg-white/[0.02] transition-colors">
                <span className="text-[11px] text-gray-600 tabular-nums whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5 min-w-0">
                  {l.is_super_admin
                    ? <Crown size={10} className="text-yellow-400 shrink-0" />
                    : l.is_admin
                    ? <ShieldCheck size={10} className="text-[#007BFF] shrink-0" />
                    : <span className="w-2.5 h-2.5 rounded-full bg-gray-700 shrink-0" />
                  }
                  <span className="text-xs text-gray-300 truncate">{l.user_name}</span>
                  <span className="text-[11px] text-gray-600 truncate hidden sm:block">{l.user_email}</span>
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${actionColor(l.action)}`}>
                  {actionLabel(l.action)}
                </span>
                <span className="text-[11px] text-gray-700 font-mono truncate max-w-[120px]" title={l.resource_id}>
                  {l.resource_type ? `${l.resource_type}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
