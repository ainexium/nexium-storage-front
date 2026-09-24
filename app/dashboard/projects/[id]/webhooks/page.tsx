"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useState, use } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Check, Copy } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useErrorMessage } from "@/hooks/use-error-message";

const ALL_EVENTS = ["file.created", "file.deleted", "file.renamed"];

interface Webhook {
  id: string;
  project_id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
}

interface Delivery {
  id: string;
  event: string;
  status_code: number | null;
  success: boolean;
  attempts: number;
  error?: string;
  delivered_at: string | null;
  created_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function DeliveryRow({ d }: { d: Delivery }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 text-xs border-b border-white/[0.04] last:border-0">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${d.success ? "bg-green-400" : "bg-red-400"}`} />
      <span className="text-gray-400 font-mono w-28 flex-shrink-0">{d.event}</span>
      <span className={`w-10 flex-shrink-0 ${d.success ? "text-green-400" : "text-red-400"}`}>
        {d.status_code ?? "—"}
      </span>
      <span className="text-gray-600 flex-1 truncate">{d.error ?? "OK"}</span>
      <span className="text-gray-600 flex-shrink-0">{formatDate(d.created_at)}</span>
    </div>
  );
}

function WebhookRow({ hook, projectId }: { hook: Webhook; projectId: string }) {
  const t = useTranslations("webhooks");
  const tc = useTranslations("common");
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = useMutation({
    mutationFn: () =>
      api.patch<Webhook>(`/api/v1/projects/${projectId}/webhooks/${hook.id}`, {
        is_active: !hook.is_active,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks", projectId] }),
  });

  const remove = useMutation({
    mutationFn: () => api.delete(`/api/v1/projects/${projectId}/webhooks/${hook.id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks", projectId] }),
  });

  const { data: deliveries, isLoading: loadingDeliveries } = useQuery({
    queryKey: ["webhook-deliveries", hook.id],
    queryFn: () => api.get<Delivery[]>(`/api/v1/projects/${projectId}/webhooks/${hook.id}/deliveries`),
    enabled: open,
  });

  return (
    <>
      {confirmDelete && (
        <ConfirmModal
          title={t("deleteTitle")}
          description={t("deleteBody", { url: hook.url })}
          confirmLabel={tc("delete")}
          onConfirm={() => { remove.mutate(); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      <div className="rounded-xl border border-white/[0.07] overflow-hidden mb-3">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hook.is_active ? "bg-green-400" : "bg-gray-600"}`} />
          <span className="text-sm font-mono flex-1 truncate text-gray-200">{hook.url}</span>
          <div className="flex gap-1 flex-wrap">
            {hook.events.map((e) => (
              <span key={e} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-400 font-mono">
                {e}
              </span>
            ))}
          </div>
          <button
            onClick={() => toggle.mutate()}
            className={`text-xs px-2.5 py-1 rounded-md border transition ${
              hook.is_active
                ? "border-white/[0.1] text-gray-400 hover:text-red-400"
                : "border-white/[0.1] text-gray-600 hover:text-green-400"
            }`}
          >
            {hook.is_active ? t("disable") : t("enable")}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-500 hover:text-gray-300 transition p-1"
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-gray-600 hover:text-red-400 transition p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {open && (
          <div className="border-t border-white/[0.06]">
            <div className="px-4 py-2 text-xs text-gray-600 font-medium">{t("recentDeliveries")}</div>
            {loadingDeliveries ? (
              <div className="px-4 py-3 text-xs text-gray-600">{t("loading")}</div>
            ) : !deliveries?.length ? (
              <div className="px-4 py-3 text-xs text-gray-600">{t("noDeliveries")}</div>
            ) : (
              deliveries.map((d) => <DeliveryRow key={d.id} d={d} />)
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function WebhooksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const t = useTranslations("webhooks");
  const tc = useTranslations("common");
  const errMsg = useErrorMessage();
  const qc = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ["webhooks", projectId],
    queryFn: () => api.get<Webhook[]>(`/api/v1/projects/${projectId}/webhooks`),
  });

  const [creating, setCreating] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(ALL_EVENTS);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const create = useMutation({
    mutationFn: () =>
      api.post<{ webhook: Webhook; secret: string }>(
        `/api/v1/projects/${projectId}/webhooks`,
        { url, events: selectedEvents }
      ),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["webhooks", projectId] });
      setNewSecret(data.secret);
      setUrl("");
      setSelectedEvents(ALL_EVENTS);
      setCreating(false);
      setFormError("");
    },
    onError: (e) => setFormError(errMsg(e) || t("createFailed")),
  });

  function toggleEvent(e: string) {
    setSelectedEvents((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  }

  async function copySecret() {
    if (!newSecret) return;
    await navigator.clipboard.writeText(newSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="px-8 py-8 max-w-3xl">
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition"
      >
        <ArrowLeft size={13} /> {t("backToProject")}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-base font-semibold">{t("title")}</h1>
          <p className="text-xs text-gray-500 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={() => { setCreating(true); setNewSecret(null); }}
          className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#06B6D4] hover:bg-blue-600 rounded-lg font-medium transition"
        >
          <Plus size={13} /> {t("add")}
        </button>
      </div>

      {newSecret && (
        <div className="rounded-xl border border-green-400/20 bg-green-400/[0.05] p-4 mb-6">
          <p className="text-xs text-green-400 font-medium mb-2">
            {t("created")}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-gray-300 bg-black/30 px-3 py-2 rounded-lg truncate">
              {newSecret}
            </code>
            <button
              onClick={copySecret}
              className="flex items-center gap-1 text-xs px-2.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      )}

      {creating && (
        <div className="rounded-xl border border-white/[0.07] p-5 mb-6">
          <h2 className="text-sm font-medium mb-4">{t("newWebhook")}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{t("endpointUrl")}</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">{t("events")}</label>
              <div className="flex gap-2 flex-wrap">
                {ALL_EVENTS.map((e) => (
                  <button
                    key={e}
                    onClick={() => toggleEvent(e)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition ${
                      selectedEvents.includes(e)
                        ? "border-[#06B6D4] bg-[#06B6D4]/10 text-[#06B6D4]"
                        : "border-white/[0.1] text-gray-500 hover:border-white/[0.2]"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            {formError && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => create.mutate()}
                disabled={create.isPending || !url || selectedEvents.length === 0}
                className="px-4 py-2 bg-[#06B6D4] hover:bg-blue-600 disabled:opacity-50 rounded-lg text-sm font-medium transition"
              >
                {create.isPending ? t("creating") : tc("create")}
              </button>
              <button
                onClick={() => { setCreating(false); setFormError(""); }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-300 transition"
              >
                {tc("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.07] py-14 text-center">
          <p className="text-sm text-gray-600">{t("empty")}</p>
          <p className="text-xs text-gray-700 mt-1">{t("emptyHint")}</p>
        </div>
      ) : (
        webhooks.map((hook) => (
          <WebhookRow key={hook.id} hook={hook} projectId={projectId} />
        ))
      )}
    </div>
  );
}
