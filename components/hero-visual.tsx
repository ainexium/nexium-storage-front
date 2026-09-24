"use client";

import { useState } from "react";
import { CloudUpload, Check } from "lucide-react";

interface Props {
  tabDashboard: string;
  tabApi: string;
  dragText: string;
  dragSubPre: string;
  dragSubPost: string;
  browseLabel: string;
  uploadComment: string;
}

const FILES = [
  { name: "hero.jpg",    size: "1.2 MB" },
  { name: "banner.png",  size: "890 KB" },
  { name: "logo.svg",    size: "18 KB"  },
  { name: "report.pdf",  size: "4.5 MB" },
];

export function HeroVisual({ tabDashboard, tabApi, dragText, dragSubPre, dragSubPost, browseLabel, uploadComment }: Props) {
  const [tab, setTab] = useState<"ui" | "api">("ui");

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden text-left shadow-2xl">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
        <button
          onClick={() => setTab("ui")}
          className={`px-3 py-1 rounded-md text-[12px] font-medium transition ${
            tab === "ui"
              ? "bg-[#9b3dff]/15 text-[#9b3dff]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tabDashboard}
        </button>
        <button
          onClick={() => setTab("api")}
          className={`px-3 py-1 rounded-md text-[12px] font-medium transition ${
            tab === "api"
              ? "bg-[#9b3dff]/15 text-[#9b3dff]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tabApi}
        </button>
      </div>

      {tab === "ui" ? (
        <div className="p-6">
          {/* Drop zone */}
          <div className="border border-dashed border-white/[0.12] rounded-lg py-5 px-4 text-center mb-4 bg-white/[0.01]">
            <CloudUpload size={26} className="mx-auto mb-2 text-[#9b3dff]/50" />
            <p className="text-[13px] text-gray-400">{dragText}</p>
            <p className="text-[11px] text-gray-600 mt-1">
              {dragSubPre} <span className="text-[#9b3dff]">{browseLabel}</span>{dragSubPost}
            </p>
          </div>
          {/* File list */}
          <div className="space-y-0">
            {FILES.map(({ name, size }, i) => (
              <div
                key={name}
                className={`flex items-center gap-3 py-2.5 ${i < FILES.length - 1 ? "border-b border-white/[0.04]" : ""}`}
              >
                <div className="w-6 h-6 rounded bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-[#9b3dff]" />
                </div>
                <span className="text-[13px] text-gray-300 flex-1 font-mono">{name}</span>
                <span className="text-[12px] text-gray-600">{size}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 font-mono text-[13px] leading-7">
          <p className="text-gray-600">{uploadComment}</p>
          <p className="text-gray-300 mt-2">
            <span className="text-[#9b3dff]">curl</span>{" "}
            <span className="text-green-400">-X POST</span> \
          </p>
          <p className="text-gray-300 pl-6">
            <span className="text-yellow-400">-H</span>{" "}
            <span className="text-orange-300">&quot;Authorization: Bearer nx_live_...&quot;</span> \
          </p>
          <p className="text-gray-300 pl-6">
            <span className="text-yellow-400">-F</span>{" "}
            <span className="text-orange-300">&quot;file=@photo.jpg&quot;</span> \
          </p>
          <p className="text-gray-400 pl-6">
            https://api.nexiumai.io/v1/ext/buckets/&lt;id&gt;/files
          </p>
          <p className="text-gray-600 mt-4">{"// → 201 Created"}</p>
          <p className="text-purple-400 mt-1">
            {`{ "url": "https://cdn.nexiumai.io/…", "id": "file_…" }`}
          </p>
        </div>
      )}
    </div>
  );
}
