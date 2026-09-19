"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRegister } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

type FormData = { name: string; email: string; password: string };

export default function RegisterPage() {
  const t = useTranslations("auth");
  const { mutate, isPending, error } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(z.object({
      name: z.string().min(2, t("nameMin")),
      email: z.string().email(t("invalidEmail")),
      password: z.string().min(8, t("passwordMin")),
    })),
  });

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">{t("createAccountTitle")}</h1>
      <p className="text-gray-400 text-sm text-center mb-8">{t("createAccountSubtitle")}</p>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        {[
          { name: "name" as const, label: t("name"), type: "text", placeholder: "Jane Doe" },
          { name: "email" as const, label: t("email"), type: "email", placeholder: "hgs@gmail.com" },
          { name: "password" as const, label: t("password"), type: "password", placeholder: t("min8") },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{field.label}</label>
            <input
              {...register(field.name)}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none text-sm transition"
            />
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-400">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-60 rounded-lg font-semibold text-sm transition"
        >
          {isPending ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-[#007BFF] hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
