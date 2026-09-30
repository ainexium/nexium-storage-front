"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { BillingCountry, PaymentChannel, Plan } from "@/types";
import { useState, useRef } from "react";
import { Pencil, Trash2, Check, X, Plus, Upload, ToggleLeft, ToggleRight, AlertTriangle, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

// ─── utils ────────────────────────────────────────────────────────────────────

function fmtBytes(b: number) {
  if (b >= 1_099_511_627_776) return `${(b / 1_099_511_627_776).toFixed(0)} TB`;
  if (b >= 1_073_741_824)    return `${(b / 1_073_741_824).toFixed(0)} GB`;
  if (b >= 1_048_576)        return `${(b / 1_048_576).toFixed(0)} MB`;
  return `${b} B`;
}

// ─── inline editable field ────────────────────────────────────────────────────

function EditableField({
  value, onSave, type = "text", suffix = ""
}: { value: string | number; onSave: (v: string) => void; type?: string; suffix?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!editing) {
    return (
      <span className="group flex items-center gap-1.5 cursor-pointer" onClick={() => { setDraft(String(value)); setEditing(true); }}>
        <span className="text-sm text-gray-200">{value}{suffix}</span>
        <Pencil size={11} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1">
      <input
        autoFocus type={type} value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { onSave(draft); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
        className="w-28 px-2 py-0.5 rounded bg-white/[0.06] border border-white/15 text-sm text-gray-200 outline-none"
      />
      <button onClick={() => { onSave(draft); setEditing(false); }} className="text-emerald-400 hover:text-emerald-300"><Check size={13} /></button>
      <button onClick={() => setEditing(false)} className="text-gray-600 hover:text-gray-400"><X size={13} /></button>
    </span>
  );
}

// ─── Plans tab ────────────────────────────────────────────────────────────────

function PlansTab() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const qc = useQueryClient();
  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["admin-billing-plans"],
    queryFn: () => api.get("/api/v1/admin/billing/plans"),
  });

  async function updatePlan(id: string, field: string, raw: string) {
    const value = field === "addons_enabled" || field === "is_active"
      ? raw === "true"
      : field === "storage_bytes" || field === "max_file_bytes"
      ? parseInt(raw) * 1_073_741_824
      : parseInt(raw);
    await api.patch(`/api/v1/admin/billing/plans/${id}`, { [field]: value });
    qc.invalidateQueries({ queryKey: ["admin-billing-plans"] });
    qc.invalidateQueries({ queryKey: ["billing-plans"] });
  }

  if (isLoading) return <div className="py-10 text-center text-sm text-gray-600">{tc("loading")}</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <th className="text-left px-4 py-3">{t("plan")}</th>
            <th className="text-left px-4 py-3">{t("priceMonth")}</th>
            <th className="text-left px-4 py-3">{t("storage")}</th>
            <th className="text-left px-4 py-3">{t("maxFile")}</th>
            <th className="text-left px-4 py-3">{t("maxProjects")}</th>
            <th className="text-left px-4 py-3">{t("addons")}</th>
            <th className="text-left px-4 py-3">{t("active")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {plans.map(p => (
            <tr key={p.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-medium text-gray-200">{p.name}</td>
              <td className="px-4 py-3"><EditableField value={p.price_xof} suffix=" XOF" type="number" onSave={v => updatePlan(p.id, "price_xof", v)} /></td>
              <td className="px-4 py-3"><EditableField value={p.storage_bytes / 1_073_741_824} suffix=" GB" type="number" onSave={v => updatePlan(p.id, "storage_bytes", v)} /></td>
              <td className="px-4 py-3"><EditableField value={p.max_file_bytes / 1_073_741_824} suffix=" GB" type="number" onSave={v => updatePlan(p.id, "max_file_bytes", v)} /></td>
              <td className="px-4 py-3"><EditableField value={p.max_projects === -1 ? "∞" : p.max_projects} type="number" onSave={v => updatePlan(p.id, "max_projects", v === "∞" ? "-1" : v)} /></td>
              <td className="px-4 py-3">
                <button onClick={() => updatePlan(p.id, "addons_enabled", String(!p.addons_enabled))} className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${p.addons_enabled ? "text-emerald-400" : "text-gray-600"}`}>
                  {p.addons_enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {p.addons_enabled ? tc("yes") : tc("no")}
                </button>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => updatePlan(p.id, "is_active", String(!p.is_active))} className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${p.is_active ? "text-emerald-400" : "text-gray-600"}`}>
                  {p.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {p.is_active ? t("active") : t("hidden")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Countries tab ────────────────────────────────────────────────────────────

function CountriesTab() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const qc = useQueryClient();
  const { data: countries = [], isLoading } = useQuery<BillingCountry[]>({
    queryKey: ["admin-billing-countries"],
    queryFn: () => api.get("/api/v1/admin/billing/countries"),
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin-billing-countries"] });
    qc.invalidateQueries({ queryKey: ["billing-countries"] });
  }

  async function toggleCountry(code: string, current: boolean) {
    await api.patch(`/api/v1/admin/billing/countries/${code}`, { is_active: !current });
    refresh();
  }

  async function updateRate(code: string, rate: string) {
    const n = parseFloat(rate);
    if (isNaN(n) || n <= 0) return;
    await api.patch(`/api/v1/admin/billing/countries/${code}`, { local_per_xof: n });
    refresh();
  }

  if (isLoading) return <div className="py-10 text-center text-sm text-gray-600">{tc("loading")}</div>;

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <th className="text-left px-4 py-3">{t("countryName")}</th>
            <th className="text-left px-4 py-3">{t("currencyCode")}</th>
            <th className="text-left px-4 py-3">{t("rateFromXOF")}</th>
            <th className="text-left px-4 py-3">{t("provider")}</th>
            <th className="text-left px-4 py-3">{t("status")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {countries.map(c => (
            <tr key={c.code} className={`hover:bg-white/[0.02] ${!c.is_active ? "opacity-50" : ""}`}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{c.flag_emoji}</span>
                  <div>
                    <p className="font-medium text-gray-200">{c.name}</p>
                    <p className="text-[11px] text-gray-600 font-mono">{c.code}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs font-mono font-semibold text-gray-300 bg-white/[0.04] px-2 py-0.5 rounded">
                  {c.currency_code}
                </span>
              </td>
              <td className="px-4 py-3">
                <EditableField
                  value={c.local_per_xof}
                  type="number"
                  suffix={` XOF → 1 ${c.currency_code}`}
                  onSave={v => updateRate(c.code, v)}
                />
              </td>
              <td className="px-4 py-3">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded border
                  ${c.code === "CI"
                    ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
                    : "text-purple-400 bg-purple-400/10 border-purple-400/20"
                  }`}>
                  {c.code === "CI" ? "Adullam" : "SasPay"}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleCountry(c.code, c.is_active)}
                  className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${c.is_active ? "text-emerald-400" : "text-orange-400"}`}
                >
                  {c.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {c.is_active ? t("active") : t("unavailable")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Channel row ──────────────────────────────────────────────────────────────

function ChannelRow({ ch, onRefresh }: { ch: PaymentChannel; onRefresh: () => void }) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(ch.name);
  const [logoUrl, setLogoUrl] = useState(ch.logo_url);
  const [maintenanceNote, setMaintenanceNote] = useState(ch.maintenance_note);
  const [displayOrder, setDisplayOrder] = useState(String(ch.display_order));
  const [provider, setProvider] = useState(ch.provider);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function cancel() {
    setName(ch.name); setLogoUrl(ch.logo_url); setMaintenanceNote(ch.maintenance_note);
    setDisplayOrder(String(ch.display_order)); setProvider(ch.provider); setEditing(false);
  }

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/api/v1/admin/billing/channels/${ch.id}`, {
        name, logo_url: logoUrl, maintenance_note: maintenanceNote,
        display_order: parseInt(displayOrder) || 0, provider,
      });
      setEditing(false);
      onRefresh();
    } finally { setSaving(false); }
  }

  async function toggle() {
    await api.patch(`/api/v1/admin/billing/channels/${ch.id}`, { is_active: !ch.is_active });
    onRefresh();
  }

  async function remove() {
    if (!confirm(t("deleteChannel", { name: ch.name }))) return;
    await api.delete(`/api/v1/admin/billing/channels/${ch.id}`);
    onRefresh();
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/billing/channels/${ch.id}/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        body: form,
      });
      const data = await res.json();
      if (data.logo_url) { setLogoUrl(data.logo_url); onRefresh(); }
    } finally { setUploading(false); }
  }

  return (
    <>
      <tr className={`border-b border-white/[0.04] ${!ch.is_active ? "opacity-50" : ""} ${editing ? "bg-white/[0.02]" : ""}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {ch.logo_url
              ? <img src={ch.logo_url} alt={ch.name} className="w-8 h-8 rounded-lg object-contain bg-white/[0.04] p-0.5" />
              : <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-gray-600 text-xs">{ch.name[0]}</div>
            }
            <span className="text-sm font-medium text-gray-200">{ch.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{ch.slug}</td>
        <td className="px-4 py-3">
          <span className="text-xs text-gray-400 font-mono">{ch.country_code}</span>
        </td>
        <td className="px-4 py-3">
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border
            ${ch.provider === "adullam"
              ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
              : "text-purple-400 bg-purple-400/10 border-purple-400/20"
            }`}>
            {ch.provider}
          </span>
        </td>
        <td className="px-4 py-3">
          {ch.maintenance_note
            ? <span className="flex items-center gap-1 text-xs text-orange-400"><AlertTriangle size={10} />{ch.maintenance_note}</span>
            : <span className="text-xs text-gray-700">—</span>
          }
        </td>
        <td className="px-4 py-3">
          <button onClick={toggle} className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${ch.is_active ? "text-emerald-400" : "text-orange-400"}`}>
            {ch.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {ch.is_active ? t("active") : t("unavailable")}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(v => !v)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${editing ? "border-white/15 text-gray-200 bg-white/[0.06]" : "border-white/[0.06] text-gray-500 hover:text-gray-300"}`}
            >
              <Pencil size={11} /> {editing ? t("editing") : t("edit")}
            </button>
            {!editing && (
              <button onClick={remove} className="p-1.5 rounded-lg border border-red-500/20 text-red-500/60 hover:text-red-400 hover:border-red-500/40 transition-all"><Trash2 size={12} /></button>
            )}
          </div>
        </td>
      </tr>

      {editing && (
        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
          <td colSpan={7} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("name")}</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("maintenanceNote")}</label>
                <input value={maintenanceNote} onChange={e => setMaintenanceNote(e.target.value)} placeholder={t("maintenancePlaceholder")} className="w-full px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("logoUrl")}</label>
                <div className="flex gap-2">
                  <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="/logos/mtnBJ.png ou URL R2" className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20" />
                  <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-gray-200 hover:border-white/20 transition-all shrink-0">
                    <Upload size={11} /> {uploading ? t("upload") : "Upload"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("displayOrder")}</label>
                <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} className="w-24 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("provider")}</label>
                <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0f] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20">
                  <option value="adullam">Adullam</option>
                  <option value="saspay">SasPay</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
              <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 text-sm font-medium transition-all disabled:opacity-40">
                <Check size={13} /> {saving ? t("saving") : tc("save")}
              </button>
              <button onClick={cancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] text-gray-400 hover:text-gray-200 text-sm font-medium transition-all">
                <X size={13} /> {tc("cancel")}
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Channels tab ─────────────────────────────────────────────────────────────

function ChannelsTab() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const qc = useQueryClient();
  const [filterCountry, setFilterCountry] = useState<string>("");

  const { data: channels = [], isLoading } = useQuery<PaymentChannel[]>({
    queryKey: ["admin-billing-channels", filterCountry],
    queryFn: () => api.get(`/api/v1/admin/billing/channels${filterCountry ? `?country=${filterCountry}` : ""}`),
  });

  const { data: countries = [] } = useQuery<BillingCountry[]>({
    queryKey: ["admin-billing-countries"],
    queryFn: () => api.get("/api/v1/admin/billing/countries"),
  });

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCountry, setNewCountry] = useState("CI");
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const newLogoRef = useRef<HTMLInputElement>(null);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin-billing-channels"] });
    qc.invalidateQueries({ queryKey: ["billing-channels"] });
  }

  function pickFile(file: File) {
    setNewLogoFile(file);
    setNewLogoPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setNewName(""); setNewSlug(""); setNewCountry("CI"); setNewLogoFile(null); setNewLogoPreview(""); setAdding(false);
  }

  async function addChannel() {
    if (!newName || !newSlug) return;
    setSaving(true);
    try {
      const created: { id: string } = await api.post("/api/v1/admin/billing/channels", {
        name: newName, slug: newSlug,
        country_code: newCountry,
        provider: newCountry === "CI" ? "adullam" : "saspay",
      });
      if (newLogoFile) {
        const form = new FormData();
        form.append("logo", newLogoFile);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/billing/channels/${created.id}/logo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          body: form,
        });
      }
      resetForm();
      refresh();
    } finally { setSaving(false); }
  }

  if (isLoading) return <div className="py-10 text-center text-sm text-gray-600">{tc("loading")}</div>;

  return (
    <div>
      {/* country filter */}
      <div className="flex items-center gap-2 mb-4">
        <Globe size={13} className="text-gray-500" />
        <span className="text-xs text-gray-500">{t("filterByCountry")}:</span>
        <button
          onClick={() => setFilterCountry("")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filterCountry === "" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
        >
          {t("filterAll")}
        </button>
        {countries.map(c => (
          <button
            key={c.code}
            onClick={() => setFilterCountry(c.code)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filterCountry === c.code ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            <span>{c.flag_emoji}</span> {c.code}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.07] overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3">{t("channel")}</th>
              <th className="text-left px-4 py-3">{t("slug")}</th>
              <th className="text-left px-4 py-3">{t("country")}</th>
              <th className="text-left px-4 py-3">{t("provider")}</th>
              <th className="text-left px-4 py-3">{t("maintenanceNote")}</th>
              <th className="text-left px-4 py-3">{t("status")}</th>
              <th className="text-left px-4 py-3">{t("actionsCol")}</th>
            </tr>
          </thead>
          <tbody>
            {channels.map(ch => (
              <ChannelRow key={ch.id} ch={ch} onRefresh={refresh} />
            ))}
          </tbody>
        </table>
      </div>

      {adding ? (
        <div className="rounded-xl border border-white/[0.1] bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-gray-400 mb-3">{t("newChannel")}</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("name")}</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t("channelNamePlaceholder")} className="w-full px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("slug")}</label>
              <input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder={t("slugPlaceholder")} className="w-full px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20 font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("country")}</label>
              <select
                value={newCountry}
                onChange={e => setNewCountry(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-gray-200 outline-none focus:border-white/20"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag_emoji} {c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("logo")}</label>
              <button type="button" onClick={() => newLogoRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/15 text-xs text-gray-400 hover:text-gray-200 hover:border-white/25 transition-all">
                {newLogoPreview
                  ? <img src={newLogoPreview} className="w-5 h-5 rounded object-contain" />
                  : <Upload size={12} />}
                {newLogoPreview ? t("changeFile", { name: newLogoFile?.name ?? "" }) : t("chooseLogo")}
              </button>
              <input ref={newLogoRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && pickFile(e.target.files[0])} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05]">
            <button onClick={addChannel} disabled={saving || !newName || !newSlug} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 text-sm font-medium transition-all disabled:opacity-40">
              <Check size={13} /> {saving ? t("creatingChannel") : t("createChannel")}
            </button>
            <button onClick={resetForm} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] text-gray-400 hover:text-gray-200 text-sm font-medium transition-all">
              <X size={13} /> {tc("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/10 text-sm text-gray-500 hover:text-gray-300 hover:border-white/20 transition-all">
          <Plus size={14} /> {t("addChannel")}
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBillingPage() {
  const t = useTranslations("admin");
  const [tab, setTab] = useState<"plans" | "countries" | "channels">("plans");

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-base font-semibold">{t("billingTitle")}</h1>
        <p className="text-xs text-gray-500 mt-1">{t("billingSubtitle")}</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-white/[0.06]">
        {(["plans", "countries", "channels"] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${tab === tabKey ? "border-[#9b3dff] text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
          >
            {tabKey === "plans" ? t("tabPlans") : tabKey === "countries" ? t("tabCountries") : t("tabChannels")}
          </button>
        ))}
      </div>

      {tab === "plans"     && <PlansTab />}
      {tab === "countries" && <CountriesTab />}
      {tab === "channels"  && <ChannelsTab />}
    </div>
  );
}
