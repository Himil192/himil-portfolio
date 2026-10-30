"use client";

import { MouseEvent, ReactNode, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

type Props = {
  href?: string;
  children: ReactNode;
  download?: boolean;
  variant?: "foil" | "ghost";
};

export default function MagneticButton({ href = "#", children, download, variant = "ghost" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const external = href.startsWith("http");

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.28;
    const y = (event.clientY - box.top - box.height / 2) * 0.28;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`button button-${variant}`}
    >
      {children}
    </a>
  );
}
