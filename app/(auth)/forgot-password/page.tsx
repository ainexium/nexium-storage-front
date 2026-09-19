"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { useErrorMessage } from "@/hooks/use-error-message";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const errMsg = useErrorMessage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError(t("enterValidEmail")); return; }
    setError("");
    setIsPending(true);
    try {
      await forgotPassword(email);
      sessionStorage.setItem("reset_email", email);
      router.push("/reset-password");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">{t("forgotTitle")}</h1>
      <p className="text-gray-400 text-sm text-center mb-8">
        {t("forgotBody")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("email")}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="hgs@gmail.com"
            autoFocus
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none text-sm transition"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-60 rounded-lg font-semibold text-sm transition"
        >
          {isPending ? t("sending") : t("sendResetCode")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-[#007BFF] hover:underline">{t("backToLogin")}</Link>
      </p>
    </div>
  );
}
