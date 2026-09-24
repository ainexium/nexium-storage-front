"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimInView } from "@/components/anim-in-view";
import { techStyle } from "@/lib/tech-colors";
import { TECH_PATHS } from "@/lib/tech-icons";

interface Props {
  title: string;
  body: string;
  primary: string;
  secondary: string;
}

/*
  Positions are pixel offsets from the section's CENTER.

  sx/sy = "spread" : where logos sit when section is NOT yet in view
           (below viewport → progress = 0)
  cx/cy = "close"  : where logos converge when section is fully scrolled past
           (above viewport → progress = 1)

  The bordered rectangle around the CTA is ≈ 852px × 320px (max-w-[900px] minus px-6),
  so ±426px horizontal, ±160px vertical from center.
  Close positions sit just outside that border on each side.
*/
/*
  12 logos arranged in a symmetric ring — 4 top, 2 left, 2 right, 4 bottom.
  Icons are 80×80px so centers need ≥ 110px separation to avoid overlap.
  Box border: ±426px horizontal, ±175px vertical from section center.
*/
const LOGOS = [
  /* ── top row ── */
  { name: "Node.js",  sx: -470, sy: -270, cx: -390, cy: -205, dur: "4.2s", del: "0s"   },
  { name: "Python",   sx: -200, sy: -255, cx: -175, cy: -210, dur: "5.1s", del: "0.8s" },
  { name: "Go",       sx:  200, sy: -255, cx:  155, cy: -210, dur: "3.8s", del: "1.5s" },
  { name: "PHP",      sx:  470, sy: -270, cx:  390, cy: -205, dur: "4.8s", del: "0.3s" },
  /* ── left side ── */
  { name: "Flutter",  sx: -570, sy: -165, cx: -510, cy:  -85, dur: "4.9s", del: "2.3s" },
  { name: "React",    sx: -570, sy:   55, cx: -510, cy:   65, dur: "5.5s", del: "1.2s" },
  /* ── right side ── */
  { name: "Swift",    sx:  570, sy: -165, cx:  510, cy:  -85, dur: "3.9s", del: "0.7s" },
  { name: "Vue",      sx:  570, sy:   55, cx:  510, cy:   65, dur: "4.5s", del: "2.0s" },
  /* ── bottom row ── */
  { name: "Java",     sx: -470, sy:  375, cx: -390, cy:  205, dur: "4.0s", del: "0.5s" },
  { name: "Next.js",  sx: -200, sy:  355, cx: -175, cy:  210, dur: "5.0s", del: "0.9s" },
  { name: "Django",   sx:  200, sy:  355, cx:  155, cy:  210, dur: "4.6s", del: "1.6s" },
  { name: "Rust",     sx:  470, sy:  375, cx:  390, cy:  205, dur: "3.6s", del: "1.8s" },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function CtaFloatingLogos({ title, body, primary, secondary }: Props) {
  const sectionRef  = useRef<HTMLElement>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function update() {
      const rect = section!.getBoundingClientRect();
      const vh   = window.innerHeight;
      const sh   = rect.height;

      /* 0 = section below viewport, 1 = section fully above */
      const raw      = (vh - rect.top) / (vh + sh);
      const progress = easeInOut(Math.max(0, Math.min(1, raw)));

      wrapperRefs.current.forEach((el, i) => {
        if (!el) return;
        const { sx, sy, cx, cy } = LOGOS[i];
        const x = lerp(sx, cx, progress);
        const y = lerp(sy, cy, progress);
        /* outer wrapper = convergence (JS); inner div = float (CSS) — no conflict */
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/[0.06] py-52 overflow-hidden"
    >
      <div className="glow-blue-center" />
      <div className="grid-dark" />

      {/* ── Floating badges ───────────────────────────────────── */}
      {LOGOS.map((logo, i) => (
        <div
          key={logo.name}
          ref={el => { wrapperRefs.current[i] = el; }}
          className="absolute hidden lg:block z-[12]"
          style={{
            top: "50%",
            left: "50%",
            transform: `translate(calc(-50% + ${logo.sx}px), calc(-50% + ${logo.sy}px))`,
          }}
        >
          {/* Inner keeps the float-badge CSS animation — doesn't conflict with outer transform */}
          <div
            style={{
              animationName: "float-badge",
              animationDuration: logo.dur,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: logo.del,
            }}
          >
            <span
              className="w-20 h-20 border flex items-center justify-center select-none"
              style={techStyle(logo.name)}
              title={logo.name}
            >
              <svg
                width="48" height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={TECH_PATHS[logo.name] ?? ""} />
              </svg>
            </span>
          </div>
        </div>
      ))}

      {/* ── Central CTA — bordered rectangle ─────────────────── */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <AnimInView>
          <div className="rounded-2xl border border-white/[0.12] bg-[var(--lp-bg-deep)] px-10 md:px-20 py-10 md:py-12 text-center">
            <h2
              className="font-medium leading-[1.12] tracking-[-0.03em] mb-6"
              style={{ fontSize: "clamp(2.1rem, 5vw, 3.2rem)" }}
            >
              {title}
            </h2>
            <p className="text-[17px] text-gray-400 mb-10 leading-[1.65]">
              {body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#9b3dff] hover:bg-[#aa55ff] rounded-lg text-[14px] font-semibold transition"
              >
                {primary} <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-white/[0.1] hover:border-white/20 rounded-lg text-[14px] font-semibold text-gray-300 hover:text-white transition"
              >
                {secondary}
              </Link>
            </div>
          </div>
        </AnimInView>
      </div>
    </section>
  );
}
