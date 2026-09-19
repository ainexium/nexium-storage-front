"use client";

import { useTranslations } from "next-intl";

export function useErrorMessage() {
  const t = useTranslations("errors");

  return (err: unknown) => {
    const msg = err instanceof Error ? err.message : "";
    const map: Record<string, string> = {
      "Session expired": t("sessionExpired"),
      "Session expirée": t("sessionExpired"),
      "Request failed": t("requestFailed"),
      "Network error": t("networkError"),
      "Upload failed": t("uploadFailed"),
      "Invalid response": t("invalidResponse"),
      "Update failed": t("updateFailed"),
    };
    if (msg.startsWith("Upload failed")) return t("uploadFailed");
    return map[msg] ?? (msg || t("generic"));
  };
}
