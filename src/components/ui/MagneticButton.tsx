"use client";

import { MouseEvent, ReactNode, useRef } from "react";
import { useReducedMotion, useResolvedTheme } from "@/lib/hooks";

type Props = {
  href?: string;
  children: ReactNode;
  download?: boolean | string;
  variant?: "foil" | "ghost";
};

export default function MagneticButton({ href, children, download, variant = "ghost" }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const theme = useResolvedTheme();
  const external = href?.startsWith("http");

  const move = (event: MouseEvent<HTMLElement>) => {
    if (reduced || theme === "light" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.28;
    const y = (event.clientY - box.top - box.height / 2) * 0.28;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const shared = {
    ref,
    onMouseMove: move,
    onMouseLeave: leave,
    className: `button button-${variant}`,
  };

  if (!href) {
    return (
      <button type="button" {...shared}>
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      {...shared}
    >
      {children}
    </a>
  );
}
