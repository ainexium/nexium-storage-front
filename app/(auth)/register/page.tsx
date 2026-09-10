"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRegister } from "@/hooks/use-auth";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { mutate, isPending, error } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-2">Create your account</h1>
      <p className="text-gray-400 text-sm text-center mb-8">Start building in seconds</p>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        {[
          { name: "name" as const, label: "Name", type: "text", placeholder: "Jane Doe" },
          { name: "email" as const, label: "Email", type: "email", placeholder: "hgs@gmail.com" },
          { name: "password" as const, label: "Password", type: "password", placeholder: "Min 8 characters" },
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
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#007BFF] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
