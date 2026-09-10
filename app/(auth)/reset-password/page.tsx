"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyResetCode, resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"code" | "password">("code");
  const [verifiedCode, setVerifiedCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEmail(sessionStorage.getItem("reset_email") ?? "");
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, []);

  useEffect(() => {
    if (step === "password") {
      setTimeout(() => passwordRef.current?.focus(), 50);
    }
  }, [step]);

  async function checkCode(code: string) {
    setError("");
    setIsVerifying(true);
    try {
      await verifyResetCode(email, code);
      setVerifiedCode(code);
      setStep("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }

    setIsPending(true);
    try {
      await resetPassword(email, verifiedCode, password);
      sessionStorage.removeItem("reset_email");
      router.push("/login?reset=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  if (step === "code") {
    return (
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Enter your code</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Code sent to{" "}
          <span className="text-gray-300">{email || "your email"}</span>
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
              className="w-11 h-14 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none text-xl font-mono text-center transition disabled:opacity-40"
            />
          ))}
        </div>

        {isVerifying && (
          <p className="text-xs text-gray-500 text-center mb-4">Checking…</p>
        )}

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Didn&apos;t receive it?{" "}
          <Link href="/forgot-password" className="text-[#007BFF] hover:underline">
            Resend code
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          <Link href="/login" className="hover:text-gray-400 transition">
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">New password</h1>
      <p className="text-gray-400 text-sm text-center mb-8">
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            New password
          </label>
          <input
            ref={passwordRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Min 8 characters"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none text-sm transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Confirm password
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Repeat password"
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
          {isPending ? "Updating…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}
