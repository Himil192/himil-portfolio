"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getKeyProgress, startLoadingFrames, subscribeFrames } from "@/lib/frameStore";
import { useReducedMotion } from "@/lib/hooks";

const MAX_WAIT_MS = 6000;

export default function Preloader() {
  const progress = useSyncExternalStore(subscribeFrames, getKeyProgress, () => 0);
  const reduced = useReducedMotion();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    startLoadingFrames(reduced);
    const timer = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, [reduced]);

  const done = progress >= 1 || timedOut;

  return (
    <div className={`preloader ${done ? "preloader-done" : ""}`} aria-hidden>
      <span className="font-display text-foil text-5xl">HP</span>
      <div className="preloader-track">
        <div className="preloader-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <span className="eyebrow">{Math.round(progress * 100)}%</span>
    </div>
  );
}
