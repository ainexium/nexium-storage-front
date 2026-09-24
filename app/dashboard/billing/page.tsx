"use client";

import { api } from "@/lib/api-client";
import type {
  AddonPackage,
  BillingPayment,
  PaymentChannel,
  Plan,
  StorageAddon,
  SubscriptionResponse,
} from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Check,
  Loader2,
  X,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useErrorMessage } from "@/hooks/use-error-message";

// ─── utils ────────────────────────────────────────────────────────────────────

const fmt = {
  bytes(b: number) {
    if (b >= 1_099_511_627_776) return `${(b / 1_099_511_627_776).toFixed(0)} TB`;
    if (b >= 1_073_741_824)    return `${(b / 1_073_741_824).toFixed(0)} GB`;
    return `${(b / 1_048_576).toFixed(0)} MB`;
  },
  xof(n: number, locale: string) {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR").format(n);
  },
  date(d: string | null, locale: string) {
    if (!d) return null;
    return new Date(d).toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
  },
};



// ─── plan config ──────────────────────────────────────────────────────────────

const PLAN_CONFIG: Record<string, {
  accent: string;
  bg: string;
  border: string;
  ring: string;
  btnClass: string;
}> = {
  free: {
    accent:   "text-gray-500",
    bg:       "bg-transparent",
    border:   "border-white/[0.08] hover:border-white/25",
    ring:     "",
    btnClass: "border border-white/[0.18] text-gray-400 hover:border-[#9b3dff]/60 hover:text-[#9b3dff]",
  },
  starter: {
    accent:   "text-[#9b3dff]",
    bg:       "bg-transparent",
    border:   "border-white/[0.08] hover:border-[#9b3dff]/50",
    ring:     "",
    btnClass: "border border-[#9b3dff]/40 text-[#9b3dff] hover:bg-[#9b3dff] hover:text-white hover:border-[#9b3dff]",
  },
  pro: {
    accent:   "text-[#9b3dff]",
    bg:       "bg-transparent",
    border:   "border-[#9b3dff]/35",
    ring:     "",
    btnClass: "bg-[#9b3dff] hover:bg-[#aa55ff] text-white border border-[#9b3dff]",
  },
  business: {
    accent:   "text-[#9b3dff]",
    bg:       "bg-transparent",
    border:   "border-white/[0.08] hover:border-[#9b3dff]/50",
    ring:     "",
    btnClass: "border border-[#9b3dff]/40 text-[#9b3dff] hover:bg-[#9b3dff] hover:text-white hover:border-[#9b3dff]",
  },
};

// ─── status chip ──────────────────────────────────────────────────────────────

function Chip({ status }: { status: string }) {
  const t = useTranslations("billing.status");
  const styles: Record<string, { cls: string; Icon: React.ElementType }> = {
    pending:    { cls: "text-yellow-400 bg-yellow-400/8 border-yellow-400/15", Icon: Clock },
    processing: { cls: "text-blue-400 bg-blue-400/8 border-blue-400/15", Icon: Loader2 },
    completed:  { cls: "text-emerald-400 bg-emerald-400/8 border-emerald-400/15", Icon: CheckCircle2 },
    failed:     { cls: "text-red-400 bg-red-400/8 border-red-400/15", Icon: XCircle },
    expired:    { cls: "text-gray-500 bg-gray-500/8 border-gray-500/15", Icon: XCircle },
  };
  const s = styles[status] ?? styles.pending;
  const labelKey = (["pending", "processing", "completed", "failed", "expired"].includes(status)
    ? status
    : "pending") as "pending" | "processing" | "completed" | "failed" | "expired";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.cls}`}>
      <s.Icon size={9} className={status === "processing" ? "animate-spin" : ""} />
      {t(labelKey)}
    </span>
  );
}

// ─── payment modal ────────────────────────────────────────────────────────────

interface ModalProps {
  title: string;
  priceXOF: number;
  badge?: string;
  channels: PaymentChannel[];
  onClose: () => void;
  onPay: (channel: string, phone: string) => Promise<{ id: string; status: string; redirect_url?: string }>;
  onPoll: (id: string) => Promise<{ status: string }>;
  onSuccess: () => void;
}

function PaymentModal({ title, priceXOF, badge, channels, onClose, onPay, onPoll, onSuccess }: ModalProps) {
  const t = useTranslations("billing");
  const tc = useTranslations("common");
  const locale = useLocale();
  const formatError = useErrorMessage();
  const [step, setStep]       = useState<"form" | "pending" | "done" | "error">("form");
  const [channel, setChannel] = useState("");
  const [phone, setPhone]         = useState<string | undefined>(undefined);
  const [redirectURL, setRedirectURL] = useState<string | null>(null);
  const [pendingID, setPendingID] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState("");
  const [errMsg, setErrMsg]   = useState("");
  const [loading, setLoading] = useState(false);
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step !== "pending" || !pendingID) return;
    intervalRef.current = setInterval(async () => {
      try {
        const d = await onPoll(pendingID);
        setPollStatus(d.status);
        if (d.status === "completed") { clearInterval(intervalRef.current!); setStep("done"); setTimeout(onSuccess, 1400); }
        if (d.status === "failed" || d.status === "expired") { clearInterval(intervalRef.current!); setStep("error"); setErrMsg(t("paymentRetry", { status: t(`status.${d.status}` as "status.failed" | "status.expired") })); }
      } catch { /* retry */ }
    }, 3000);
    return () => clearInterval(intervalRef.current!);
  }, [step, pendingID, onPoll, onSuccess]);

  async function submit() {
    setLoading(true); setErrMsg("");
    try {
      const d = await onPay(channel, phone ?? "");
      setPendingID(d.id); setPollStatus(d.status);
      if (d.redirect_url) setRedirectURL(d.redirect_url);
      if (d.status === "completed") { setStep("done"); setTimeout(onSuccess, 1400); }
      else setStep("pending");
    } catch (e) {
      setErrMsg(formatError(e)); setStep("error");
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[420px] bg-[#0c0c14] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl">

        {/* header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            {badge && (
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-purple-400 mb-2">{badge}</span>
            )}
            <h2 className="text-[15px] font-semibold text-white leading-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="ml-4 mt-0.5 p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* ── done ── */}
          {step === "done" && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 size={26} className="text-emerald-400" />
              </div>
              <p className="text-[15px] font-semibold text-white">{t("paymentConfirmed")}</p>
              <p className="text-xs text-gray-500 text-center">{t("accountUpdating")}</p>
            </div>
          )}

          {/* ── pending ── */}
          {step === "pending" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#9b3dff]/10 border border-[#9b3dff]/20 flex items-center justify-center">
                  <Loader2 size={24} className="text-[#9b3dff] animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-white mb-1">{t("waitingConfirm")}</p>
                {redirectURL ? (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t("waveHint")}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t("notifSent")}<br />
                    <span className="text-gray-300 font-medium">{phone}</span>
                  </p>
                )}
              </div>
              {redirectURL && (
                <a
                  href={redirectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-[#aa55ff] text-sm font-semibold text-white transition-all"
                >
                  {t("openWave")}
                </a>
              )}
              <Chip status={pollStatus || "pending"} />
            </div>
          )}

          {/* ── error ── */}
          {step === "error" && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <XCircle size={24} className="text-red-400" />
              </div>
              <p className="text-sm text-red-300 text-center">{errMsg}</p>
              <button
                onClick={() => setStep("form")}
                className="mt-1 px-5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-gray-300 transition-all"
              >
                {tc("retry")}
              </button>
            </div>
          )}

          {/* ── form ── */}
          {step === "form" && (
            <div className="space-y-5">
              {errMsg && (
                <div className="text-xs text-red-300 bg-red-500/[0.08] border border-red-500/15 rounded-xl px-4 py-3">{errMsg}</div>
              )}

              {/* operator */}
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2.5">{t("operator")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {channels.map((ch) => {
                    const active = channel === ch.slug;
                    const disabled = !ch.is_active;
                    return (
                      <button
                        key={ch.slug}
                        onClick={() => !disabled && setChannel(ch.slug)}
                        disabled={disabled}
                        title={disabled && ch.maintenance_note ? ch.maintenance_note : undefined}
                        className={`relative flex items-center gap-2.5 px-3 py-3 rounded-xl border text-[13px] font-medium transition-all
                          ${active ? "border-white/20 bg-white/[0.07] text-white" : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/10 hover:bg-white/[0.04]"}
                          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
                        `}
                      >
                        {ch.logo_url
                          ? <img src={ch.logo_url} alt={ch.name} className="w-6 h-6 rounded object-contain shrink-0" />
                          : <span className="w-6 h-6 rounded bg-white/10 shrink-0" />
                        }
                        <span className="truncate">{ch.name}</span>
                        {disabled && (
                          <span className="absolute top-1 right-1 text-[8px] font-bold text-orange-400 uppercase tracking-wide">{t("unavailable")}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* phone */}
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2.5">{t("number")}</p>
                <PhoneInput
                  defaultCountry="CI"
                  countries={["CI"]}
                  value={phone}
                  onChange={setPhone}
                  international
                  countryCallingCodeEditable={false}
                  className="phone-input"
                />
                {phone && !isValidPhoneNumber(phone) && (
                  <p className="text-[11px] text-red-400 mt-1.5">{t("invalidPhone")}</p>
                )}
              </div>

              {/* total + CTA */}
              <div className="pt-1">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
                  <span className="text-xs text-gray-500">{t("totalDue")}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{fmt.xof(priceXOF, locale)}</span>
                    <span className="text-xs text-gray-600">XOF</span>
                  </div>
                </div>
                <button
                  onClick={submit}
                  disabled={loading || !channel || !phone || !isValidPhoneNumber(phone ?? "")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#9b3dff] hover:bg-[#aa55ff] active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
                  {loading ? t("connecting") : t("confirmPayment")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── plan card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, isCurrent, onUpgrade }: { plan: Plan; isCurrent: boolean; onUpgrade: () => void }) {
  const t = useTranslations("billing");
  const tp = useTranslations("billing.plans");
  const locale = useLocale();
  const cfg = PLAN_CONFIG[plan.slug] ?? PLAN_CONFIG.starter;
  const isPro = plan.slug === "pro";
  const slug = (["free", "starter", "pro", "business"].includes(plan.slug)
    ? plan.slug
    : "starter") as "free" | "starter" | "pro" | "business";
  const features = tp.raw(`${slug}.features` as `${typeof slug}.features`) as string[];
  const tagline = tp(`${slug}.tagline` as `${typeof slug}.tagline`);

  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${cfg.bg} ${cfg.border} ${cfg.ring}`}>
      {isPro && (
        <div className="absolute -top-3.5 inset-x-0 flex justify-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#9b3dff] text-white shadow-lg">
            <Sparkles size={9} />
            {t("recommended")}
          </span>
        </div>
      )}

      {/* plan name + tagline */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[11px] font-bold uppercase tracking-widest ${cfg.accent}`}>{plan.name}</span>
          {isCurrent && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <Check size={10} strokeWidth={3} /> {t("current")}
            </span>
          )}
        </div>
        <p className="text-[12px] text-gray-600">{tagline}</p>
      </div>

      {/* price */}
      <div className="mb-6">
        {plan.price_xof === 0 ? (
          <div className="text-4xl font-black text-white tracking-tight">{t("free")}</div>
        ) : (
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-black text-white tracking-tight leading-none">
              {fmt.xof(plan.price_xof, locale)}
            </span>
            <span className="text-xs text-gray-600 mb-1.5">{t("perMonth")}</span>
          </div>
        )}
        <p className={`text-[13px] font-semibold mt-1.5 ${cfg.accent}`}>{fmt.bytes(plan.storage_bytes)}</p>
      </div>

      {/* features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[13px] text-gray-400">
            <Check size={13} strokeWidth={2.5} className="text-[#9b3dff] shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent && plan.price_xof === 0 ? (
        <div className="w-full text-center py-2.5 rounded-xl text-[13px] text-gray-600 bg-white/[0.03] border border-white/[0.05] cursor-default">
          {t("currentPlan")}
        </div>
      ) : plan.price_xof > 0 ? (
        <button
          onClick={onUpgrade}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors active:scale-[0.98] ${cfg.btnClass}`}
        >
          {isCurrent ? <>{t("renew")} <ArrowRight size={13} /></> : <>{t("choose", { name: plan.name })} <ArrowRight size={13} /></>}
        </button>
      ) : null}
    </div>
  );
}

// ─── add-on section ───────────────────────────────────────────────────────────

function AddonSection({ planBytes, onBuy }: { planBytes: number; onBuy: (p: AddonPackage) => void }) {
  const t = useTranslations("billing");
  const locale = useLocale();
  const { data: pkgs   } = useQuery<AddonPackage[]>({ queryKey: ["addon-packages"], queryFn: () => api.get("/api/v1/billing/addons/packages") });
  const { data: addons } = useQuery<StorageAddon[]>({ queryKey: ["addons"],          queryFn: () => api.get("/api/v1/billing/addons") });

  const done      = (addons ?? []).filter((a) => a.status === "completed");
  const addonSum  = done.reduce((s, a) => s + a.bytes, 0);
  const totalGB   = (planBytes + addonSum) / 1_073_741_824;
  const planGB    = planBytes / 1_073_741_824;

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">{t("addonsTitle")}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{t("addonsSubtitle")}</p>
        </div>
        {addonSum > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-600">{t("planPlusAddons", { plan: fmt.bytes(planBytes), addons: fmt.bytes(addonSum) })}</p>
            <p className="text-sm font-bold text-white">{t("total", { total: fmt.bytes(planBytes + addonSum) })}</p>
          </div>
        )}
      </div>

      {/* storage bar */}
      {addonSum > 0 && (
        <div className="mb-5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="text-gray-500">{t("totalCapacity")}</span>
            <span className="font-semibold text-white">{fmt.bytes(planBytes + addonSum)}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9b3dff] to-purple-500"
              style={{ width: `${Math.min(100, (planGB / totalGB) * 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span className="w-2 h-2 rounded-sm bg-[#9b3dff]" /> {t("basePlan")}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span className="w-2 h-2 rounded-sm bg-purple-500" /> {t("addons")}
            </span>
          </div>
        </div>
      )}

      {/* packages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {(pkgs ?? []).map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => onBuy(pkg)}
            className="group flex flex-col items-center gap-2 py-5 px-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-[#9b3dff]/30 hover:bg-[#9b3dff]/[0.04] transition-all active:scale-[0.97]"
          >
            <HardDrive size={18} className="text-gray-600 group-hover:text-[#9b3dff] transition-colors" />
            <span className="text-[15px] font-bold text-white">{pkg.label}</span>
            <span className="text-[11px] text-gray-500">{fmt.xof(pkg.price_xof, locale)} XOF</span>
          </button>
        ))}
      </div>

      {/* purchased */}
      {done.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.05]">
            <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">{t("activeAddons")}</span>
          </div>
          {done.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                <HardDrive size={13} className="text-[#9b3dff]" />
                <span className="text-[13px] text-gray-300">{fmt.bytes(a.bytes)}</span>
              </div>
              <Chip status="completed" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

type Modal =
  | { kind: "plan";  plan: Plan }
  | { kind: "addon"; pkg: AddonPackage }
  | null;

export default function BillingPage() {
  const t = useTranslations("billing");
  const locale = useLocale();
  const qc    = useQueryClient();
  const [modal, setModal] = useState<Modal>(null);

  const { data: sub,      isLoading: subLoading   } = useQuery<SubscriptionResponse>({
    queryKey: ["billing-subscription"],
    queryFn:  () => api.get("/api/v1/billing/subscription"),
  });
  const { data: plans,    isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["billing-plans"],
    queryFn:  () => api.get("/api/v1/billing/plans"),
  });
  const { data: payments } = useQuery<BillingPayment[]>({
    queryKey: ["billing-payments"],
    queryFn:  () => api.get("/api/v1/billing/payments"),
  });
  const { data: channels = [] } = useQuery<PaymentChannel[]>({
    queryKey: ["billing-channels"],
    queryFn:  () => api.get("/api/v1/billing/channels"),
  });

  const currentSlug  = sub?.plan?.slug ?? "free";
  const canAddons    = currentSlug === "pro" || currentSlug === "business";
  const subscription = sub?.subscription;

  function refresh() {
    ["billing-subscription", "billing-payments", "addons", "me"].forEach(
      (k) => qc.invalidateQueries({ queryKey: [k] })
    );
  }

  if (subLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 size={18} className="text-gray-700 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* ── modals ── */}
      {modal?.kind === "plan" && (
        <PaymentModal
          title={t("upgradeTitle", { name: modal.plan.name })}
          priceXOF={modal.plan.price_xof}
          badge={modal.plan.slug === "pro" ? t("recommended") : undefined}
          channels={channels}
          onClose={() => setModal(null)}
          onPay={(ch, ph) => api.post("/api/v1/billing/checkout", { plan_id: modal.plan.id, channel: ch, phone: ph })}
          onPoll={(id) => api.get(`/api/v1/billing/payments/${id}`)}
          onSuccess={() => { setModal(null); refresh(); }}
        />
      )}
      {modal?.kind === "addon" && (
        <PaymentModal
          title={t("addonTitle", { label: modal.pkg.label })}
          priceXOF={modal.pkg.price_xof}
          channels={channels}
          onClose={() => setModal(null)}
          onPay={(ch, ph) => api.post("/api/v1/billing/addons/checkout", { package_id: modal.pkg.id, channel: ch, phone: ph })}
          onPoll={(id) => api.get(`/api/v1/billing/addons/${id}`)}
          onSuccess={() => { setModal(null); refresh(); }}
        />
      )}

      <div className="min-h-screen px-4 sm:px-8 py-6 sm:py-10 max-w-5xl">

        {/* ── page header ── */}
        <div className="mb-10">
          <h1 className="text-xl font-bold text-white tracking-tight">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>

        {/* ── current plan status (only when paid) ── */}
        {subscription && (
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={15} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t("activePlan", { name: sub?.plan?.name ?? "" })}</p>
                {subscription.current_period_end && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("expiresOn", { date: fmt.date(subscription.current_period_end, locale) ?? "" })}
                  </p>
                )}
              </div>
            </div>
            <Chip status="completed" />
          </div>
        )}

        {/* ── plan grid ── */}
        <section className="mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
            {(plans ?? []).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={plan.slug === currentSlug}
                onUpgrade={() => setModal({ kind: "plan", plan })}
              />
            ))}
          </div>
        </section>

        {/* ── add-ons ── */}
        {canAddons && (
          <section className="mb-14 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
            <AddonSection
              planBytes={sub?.plan?.storage_bytes ?? 0}
              onBuy={(pkg) => setModal({ kind: "addon", pkg })}
            />
          </section>
        )}

        {/* ── payment history ── */}
        {payments && payments.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-white mb-4">{t("history")}</h2>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
              {payments.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between px-5 py-4 ${i < payments.length - 1 ? "border-b border-white/[0.05]" : ""}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <CreditCard size={13} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-200">{t("planPrefix", { name: p.plan?.name ?? "" })}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{fmt.date(p.created_at, locale)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-semibold text-gray-300">{fmt.xof(p.amount_xof, locale)} XOF</span>
                    <Chip status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
