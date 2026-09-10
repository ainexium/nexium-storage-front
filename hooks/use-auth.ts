"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, login, logout, register } from "@/lib/auth";
import type { TokenPair } from "@/types";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
}

function postLoginRoute(pair: TokenPair): string {
  if (pair.user.is_admin || pair.user.is_super_admin) return "/admin";
  return "/dashboard";
}

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (pair) => {
      qc.invalidateQueries({ queryKey: ["me"] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(postLoginRoute(pair) as any);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      register(name, email, password),
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("verify_email", data.email);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push("/verify-email" as any);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.clear();
      router.push("/login");
    },
  });
}
