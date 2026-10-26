"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const at = params.get("at");
    const rt = params.get("rt");
    const error = params.get("error");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (at && rt) {
      localStorage.setItem("access_token", at);
      localStorage.setItem("refresh_token", rt);
      router.replace("/dashboard");
    } else {
      router.replace("/login?error=oauth_failed");
    }
  }, [params, router]);

  return <div className="min-h-screen bg-[#0a0a0f]" />;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <CallbackInner />
    </Suspense>
  );
}
