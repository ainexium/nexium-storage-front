"use client";

import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { useRef } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { PlyrLayout, plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "next-intl";

export function HeroVideo() {
  const locale = useLocale();
  const ref    = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [40, 0]);

  const src = locale === "fr" ? "/hero-fr.mp4" : "/hero-en.mp4";

  return (
    <div ref={ref} className="w-full mt-14" style={{ perspective: "1400px" }}>
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
        }}
        className="rounded-2xl overflow-hidden border border-white/[0.09] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-500/40" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <span className="w-3 h-3 rounded-full bg-green-500/40" />
          </div>
          <div className="flex-1 mx-3 h-5 rounded-md bg-white/[0.04] flex items-center px-3">
            <span className="text-[10px] text-gray-600 font-mono">console.nexiumai.io</span>
          </div>
        </div>

        <MediaPlayer
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full"
        >
          <MediaProvider />
          <PlyrLayout icons={plyrLayoutIcons} />
        </MediaPlayer>
      </motion.div>
    </div>
  );
}
