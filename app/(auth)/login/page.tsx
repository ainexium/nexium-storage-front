"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetSuccess, setResetSuccess] = useState(false);
  const { mutate, isPending, error } = useLogin();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (searchParams.get("reset") === "1") setResetSuccess(true);
  }, [searchParams]);

  function onSubmit(d: FormData) {
    mutate(d, {
      onError: (err) => {
        if (err.message === "email_not_verified") {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verify_email", d.email);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router.push("/verify-email" as any);
        }
      },
    });
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
      <p className="text-gray-400 text-sm text-center mb-8">Sign in to your account</p>

      {resetSuccess && (
        <p className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2 mb-4">
          Password updated — you can sign in with your new password.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="hgs@gmail.com"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none text-sm transition"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-[#007BFF] transition">
              Forgot password?
            </Link>
          </div>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none text-sm transition"
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {error && error.message !== "email_not_verified" && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-60 rounded-lg font-semibold text-sm transition"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        No account?{" "}
        <Link href="/register" className="text-[#007BFF] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
