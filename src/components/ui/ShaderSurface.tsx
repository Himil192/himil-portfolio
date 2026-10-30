"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { ShaderName } from "@/shaders";

const ShaderCanvas = dynamic(() => import("./ShaderCanvas"), { ssr: false });

// Mounts its WebGL context only while on screen, because browsers cap live contexts at around 16.
export default function ShaderSurface({
  name,
  active = true,
  className = "",
}: {
  name: ShaderName;
  active?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={`shader-fallback absolute inset-0 overflow-hidden ${className}`}>
      {inView && active && <ShaderCanvas name={name} still={reduced} />}
    </div>
  );
}
