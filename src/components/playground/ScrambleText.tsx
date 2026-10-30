"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

const GLYPHS = "ABCDEFGHKLMNPRSTVXYZ0123456789";

export default function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();

  const scramble = () => {
    if (reduced) return;
    let step = 0;
    cancelAnimationFrame(frame.current);
    const run = () => {
      if (!ref.current) return;
      ref.current.textContent = [...text]
        .map((char, index) =>
          index < step / 2 || char === " "
            ? char
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");
      step += 1;
      if (step / 2 <= text.length) frame.current = requestAnimationFrame(run);
    };
    run();
  };

  return (
    <span
      ref={ref}
      onPointerEnter={scramble}
      className="font-display text-foil cursor-default text-4xl"
    >
      {text}
    </span>
  );
}
