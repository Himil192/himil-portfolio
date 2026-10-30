"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useReducedMotion, useResolvedTheme } from "@/lib/hooks";
import { ShaderName } from "@/shaders";

const ShaderCanvas = dynamic(() => import("./ShaderCanvas"), { ssr: false });

// Mounts its WebGL context only while on screen, because browsers cap live contexts at around 16.
export default function ShaderSurface({
  name,
  light,
  active = true,
  className = "",
}: {
  name: ShaderName;
  // Light mode is minimal, so a shader only runs there when a section asks for one.
  light?: ShaderName;
  active?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const theme = useResolvedTheme();
  const shader = theme === "light" ? light : name;

  return (
    <div ref={ref} className={`shader-fallback absolute inset-0 overflow-hidden ${className}`}>
      {inView && active && shader && <ShaderCanvas name={shader} theme={theme} still={reduced} />}
    </div>
  );
}
