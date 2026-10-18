"use client";

import { useEffect, useState, useRef } from "react";

const LINES = [
  { text: 'curl -X POST \\',             color: "text-[#9b3dff]",   delay: 0    },
  { text: '  -H "Authorization: Bearer nx_live_..." \\', color: "text-orange-300", delay: 60   },
  { text: '  -F "file=@photo.jpg"',       color: "text-orange-300", delay: 120  },
  { text: "",                             color: "",                delay: 200  },
  { text: "// → 201 Created",            color: "text-gray-600",   delay: 280  },
  { text: `{ "url": "cdn.nexiumai.io/…" }`, color: "text-purple-400", delay: 360  },
];

const TYPE_SPEED  = 18;  // ms per char
const PAUSE_AFTER = 2800; // ms before restart

export function AnimTerminal() {
  const [lineIdx, setLineIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [displayed, setDisplayed] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(null!);

  const reset = () => {
    setLineIdx(0);
    setCharIdx(0);
    setDisplayed([]);
  };

  useEffect(() => {
    const line = LINES[lineIdx];
    if (!line) {
      // All lines done — pause then restart
      timer.current = setTimeout(reset, PAUSE_AFTER);
      return;
    }

    if (line.text === "") {
      // Empty line — just advance
      timer.current = setTimeout(() => {
        setDisplayed((d) => [...d, ""]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, line.delay + TYPE_SPEED);
      return;
    }

    if (charIdx < line.text.length) {
      timer.current = setTimeout(() => {
        setCharIdx((c) => c + 1);
      }, charIdx === 0 ? line.delay + TYPE_SPEED : TYPE_SPEED);
    } else {
      // Line complete
      timer.current = setTimeout(() => {
        setDisplayed((d) => [...d, line.text]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, TYPE_SPEED * 2);
    }

    return () => clearTimeout(timer.current);
  }, [lineIdx, charIdx]);

  const currentLine = LINES[lineIdx];
  const isTyping    = currentLine && charIdx < currentLine.text.length;

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[var(--lp-bg-deep)] overflow-hidden">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.05] bg-black/20">
        <span className="w-2 h-2 rounded-full bg-red-500/50" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <span className="w-2 h-2 rounded-full bg-green-500/50" />
        <span className="ml-1.5 text-[11px] text-gray-600 font-mono">terminal</span>
      </div>

      {/* Output */}
      <div className="p-5 font-mono text-[12px] space-y-1.5 min-h-[130px]">
        {displayed.map((text, i) => (
          <p key={i} className={LINES[i]?.color ?? ""}>
            {text}
          </p>
        ))}

        {/* Currently typing line */}
        {currentLine && currentLine.text !== "" && (
          <p className={currentLine.color}>
            {currentLine.text.slice(0, charIdx)}
            {isTyping && (
              <span className="inline-block w-[2px] h-[13px] bg-current align-middle ml-[1px] animate-pulse" />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
