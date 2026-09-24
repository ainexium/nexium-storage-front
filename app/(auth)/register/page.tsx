"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRegister } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

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
                href="/terms"
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
