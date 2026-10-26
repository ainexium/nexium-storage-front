"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRegister } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type FormData = { name: string; email: string; password: string; termsAccepted: boolean };

export default function RegisterPage() {
  const t = useTranslations("auth");
  const { mutate, isPending, error } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(z.object({
      name: z.string().min(2, t("nameMin")),
      email: z.string().email(t("invalidEmail")),
      password: z.string().min(8, t("passwordMin")),
      termsAccepted: z.literal(true, { errorMap: () => ({ message: t("termsRequired") }) }),
    })),
  });

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">{t("createAccountTitle")}</h1>
      <p className="text-gray-400 text-sm text-center mb-8">{t("createAccountSubtitle")}</p>

      <div className="flex flex-col gap-2.5 mb-5">
        <a
          href={`${API_URL}/api/v1/auth/oauth/google`}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 text-sm font-medium transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
            <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
          </svg>
          {t("continueWithGoogle")}
        </a>
        <a
          href={`${API_URL}/api/v1/auth/oauth/github`}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 text-sm font-medium transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          {t("continueWithGitHub")}
        </a>
      </div>

      <div className="relative flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-xs text-gray-500">{t("orContinueWith")}</span>
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        {[
          { name: "name" as const, label: t("name"), type: "text", placeholder: "Ayepo Audrey" },
          { name: "email" as const, label: t("email"), type: "email", placeholder: "kader@gmail.com" },
          { name: "password" as const, label: t("password"), type: "password", placeholder: t("min8") },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{field.label}</label>
            <input
              {...register(field.name)}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#9b3dff] focus:ring-1 focus:ring-[#9b3dff] outline-none text-sm transition"
            />
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-400">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              {...register("termsAccepted")}
              type="checkbox"
              className="mt-0.5 w-4 h-4 shrink-0 accent-[#9b3dff] cursor-pointer"
            />
            <span className="text-sm text-gray-400 leading-snug">
              {t("termsAccept")}{" "}
              <Link
                href={"/terms" as never}
                target="_blank"
                className="text-[#9b3dff] hover:underline"
              >
                {t("termsLink")}
              </Link>
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="mt-1 text-xs text-red-400">{errors.termsAccepted.message}</p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-[#9b3dff] hover:bg-[#aa55ff] disabled:opacity-60 rounded-lg font-semibold text-sm transition"
        >
          {isPending ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-[#9b3dff] hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
