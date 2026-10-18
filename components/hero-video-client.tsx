"use client";

import dynamic from "next/dynamic";

export const HeroVideoClient = dynamic(
  () => import("./hero-video").then((m) => m.HeroVideo),
  { ssr: false }
);
