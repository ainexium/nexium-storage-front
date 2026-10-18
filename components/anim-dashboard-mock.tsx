"use client";

import { useEffect, useState } from "react";
import { FolderOpen, ChevronRight, LayoutDashboard, Key, BarChart2, Plus, Upload } from "lucide-react";

const BASE = [
  { name: "my-app",      buckets: 4, mb: 45.2  },
  { name: "api-backend", buckets: 2, mb: 12.1  },
  { name: "ml-assets",   buckets: 1, mb: 2148.0 },
];

function fmtSize(mb: number) {
  return mb >= 1024
    ? `${(mb / 1024).toFixed(1)} GB`
    : `${mb.toFixed(1)} MB`;
}

export function AnimDashboardMock() {
  const [rows, setRows]         = useState(BASE);
  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  /* Simulate a file upload on one of the workspaces every ~4s */
  useEffect(() => {
    let pctTimer: ReturnType<typeof setTimeout>;
    let loop: ReturnType<typeof setTimeout>;

    const runUpload = () => {
      const idx = Math.floor(Math.random() * BASE.length);
      setUploading(idx);
      setUploadPct(0);

      let pct = 0;
      const step = () => {
        pct += Math.random() * 18 + 4;
        if (pct >= 100) {
          pct = 100;
          setUploadPct(100);
          pctTimer = setTimeout(() => {
            // Add bytes to that workspace
            setRows((prev) =>
              prev.map((r, i) =>
                i === idx
                  ? { ...r, mb: parseFloat((r.mb + Math.random() * 2 + 0.3).toFixed(1)) }
                  : r
              )
            );
            setUploading(null);
            loop = setTimeout(runUpload, 3200);
          }, 400);
        } else {
          setUploadPct(pct);
          pctTimer = setTimeout(step, 80 + Math.random() * 60);
        }
      };
      pctTimer = setTimeout(step, 80);
    };

    loop = setTimeout(runUpload, 1200);
    return () => { clearTimeout(pctTimer); clearTimeout(loop); };
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[var(--lp-bg-deep)] overflow-hidden shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
        </div>
        <div className="flex-1 mx-2 h-5 rounded bg-white/[0.04] flex items-center px-2.5 overflow-hidden">
          <span className="text-[10px] text-gray-600 font-mono truncate">console.nexiumai.io/dashboard/projects</span>
        </div>
      </div>

      {/* Layout */}
      <div className="flex min-h-0">
        {/* Sidebar */}
        <div className="hidden min-[490px]:flex flex-col w-[140px] shrink-0 border-r border-white/[0.06] bg-[var(--lp-bg)] px-2 py-3">
          <div className="flex items-center gap-1.5 px-1.5 mb-4">
            <span className="text-[#9b3dff] font-bold text-[10px] tracking-tight">NEXIUM</span>
            <span className="text-gray-600 text-[9px]">/ storage</span>
          </div>
          {[
            { Icon: LayoutDashboard, name: "Overview",   active: false },
            { Icon: FolderOpen,      name: "Workspaces", active: true  },
            { Icon: Key,             name: "API Keys",   active: false },
            { Icon: BarChart2,       name: "Usage",      active: false },
          ].map(({ Icon, name, active }) => (
            <div
              key={name}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 text-[11px] ${
                active ? "bg-white/[0.07] text-white font-medium" : "text-gray-500"
              }`}
            >
              <Icon size={11} className={active ? "text-white" : "text-gray-600"} />
              {name}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[12px] font-semibold text-white">Workspaces</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{rows.length} workspaces</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[#9b3dff] text-white font-medium shrink-0">
              <Plus size={9} /> New
            </span>
          </div>

          {rows.map(({ name, buckets, mb }, i) => (
            <div
              key={name}
              className={`flex items-center gap-2.5 py-2.5 ${i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}
            >
              <div className="w-6 h-6 rounded bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                {uploading === i ? (
                  <Upload size={10} className="text-[#9b3dff] animate-bounce" />
                ) : (
                  <FolderOpen size={11} className="text-gray-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-200 font-mono truncate">{name}</p>

                {uploading === i ? (
                  <div className="mt-1 h-[3px] rounded-full bg-white/10 overflow-hidden w-full">
                    <div
                      className="h-full rounded-full bg-[#9b3dff] transition-all duration-100"
                      style={{ width: `${uploadPct}%` }}
                    />
                  </div>
                ) : (
                  <p className="text-[9px] text-gray-600">
                    {buckets} bucket{buckets > 1 ? "s" : ""} · {fmtSize(mb)}
                  </p>
                )}
              </div>

              <ChevronRight size={11} className="text-gray-700 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
