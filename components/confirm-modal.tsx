"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ title, description, confirmLabel = "Delete", onConfirm, onCancel }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#0f0f18] border border-white/[0.1] rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-400 text-sm font-medium text-white transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
