"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const ring = ref.current;
    if (!ring || reduced || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const move = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      ring.style.opacity = "1";
      ring.dataset.hover = String(Boolean((event.target as Element).closest("a, button, input")));
    };
    const loop = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      ring.style.transform = `translate(${current.x}px, ${current.y}px)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return <div ref={ref} className="cursor" aria-hidden />;
}
