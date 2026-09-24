import type { TokenPair, User } from "@/types";
import { api } from "./api-client";

export function saveTokens(pair: TokenPair) {
  localStorage.setItem("access_token", pair.access_token);
  localStorage.setItem("refresh_token", pair.refresh_token);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export async function login(email: string, password: string): Promise<TokenPair> {
  const pair = await api.post<TokenPair>("/api/v1/auth/login", { email, password });
  saveTokens(pair);
  return pair;
}

export async function register(name: string, email: string, password: string, termsAccepted: boolean): Promise<{ email: string; message: string }> {
  return api.post("/api/v1/auth/register", { name, email, password, terms_accepted: termsAccepted });
}

export async function verifyEmail(email: string, code: string): Promise<TokenPair> {
  const pair = await api.post<TokenPair>("/api/v1/auth/verify-email", { email, code });
  saveTokens(pair);
  return pair;
}

export async function resendVerification(email: string): Promise<void> {
  await api.post("/api/v1/auth/resend-verification", { email });
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post("/api/v1/auth/forgot-password", { email });
}

export async function verifyResetCode(email: string, code: string): Promise<void> {
  await api.post("/api/v1/auth/verify-reset-code", { email, code });
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  await api.post("/api/v1/auth/reset-password", { email, code, password });
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (refreshToken) {
    await api.post("/api/v1/auth/logout", { refresh_token: refreshToken }).catch(() => {});
  }
  clearTokens();
}

export async function getMe(): Promise<User> {
  return api.get<User>("/api/v1/auth/me");
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
