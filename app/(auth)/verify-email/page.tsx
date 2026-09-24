"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { verifyEmail, resendVerification } from "@/lib/auth";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useErrorMessage } from "@/hooks/use-error-message";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const errMsg = useErrorMessage();
  const router = useRouter();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("verify_email") ?? "";
    setEmail(stored);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
    if (stored) resendVerification(stored).catch(() => {});
  }, []);

  async function checkCode(code: string) {
    setError("");
    setIsVerifying(true);
    try {
      await verifyEmail(email, code);
      qc.invalidateQueries({ queryKey: ["me"] });
      sessionStorage.removeItem("verify_email");
      router.push("/dashboard");
    } catch (err) {
      setError(errMsg(err) || t("invalidCode"));
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setIsVerifying(false);
    }
  }

  function handleDigit(index: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    setError("");

    if (v && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every(Boolean)) {
      checkCode(next.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = ["", "", "", "", "", ""];
    text.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputRefs.current[Math.min(text.length - 1, 5)]?.focus();
    if (text.length === 6) checkCode(text);
  }

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">{t("checkInbox")}</h1>
      <p className="text-gray-400 text-sm text-center mb-1">{t("weSentCode")}</p>
      <p className="text-sm text-center font-mono text-white mb-8">
        {email || t("yourEmailAddress")}
      </p>

      <div className="flex gap-2 justify-center mb-6">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={isVerifying}
            className="w-11 h-14 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] outline-none text-xl font-mono text-center transition disabled:opacity-40"
          />
        ))}
      </div>

      {isVerifying && (
        <p className="text-xs text-gray-500 text-center mb-4">{t("checking")}</p>
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {resent && (
        <p className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2 mb-4">
          {t("newCodeSent")}
        </p>
      )}

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          {t("didntReceive")}{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[#06B6D4] hover:underline disabled:opacity-50"
          >
            {resending ? t("sending") : t("resendCode")}
          </button>
        </p>
        <p className="text-sm text-gray-600">
          <Link href="/login" className="hover:text-gray-400 transition">
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
