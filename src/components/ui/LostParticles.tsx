"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion, useResolvedTheme } from "@/lib/hooks";

const COUNT = { dark: 5200, light: 2400 };
const MORPH_MS = 1300;
const PUSH_RADIUS = 110;
const PATH_LIMIT = 42;

type Particle = { x: number; y: number; vx: number; vy: number; home: [number, number]; h: [number, number] };

const subscribeNothing = () => () => {};
const getPath = () => {
  const path = decodeURI(window.location.pathname);
  return path.length > PATH_LIMIT ? `${path.slice(0, PATH_LIMIT - 1)}…` : path;
};

// Draws a shape offscreen and returns the positions of its filled pixels.
function sample(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];
  draw(context);
  const { data } = context.getImageData(0, 0, width, height);
  const points: [number, number][] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (data[(y * width + x) * 4 + 3] > 128) points.push([x, y]);
    }
  }
  return points;
}

const pick = (points: [number, number][]) => points[Math.floor(Math.random() * points.length)];

export default function LostParticles() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const morphing = useRef(false);
  const router = useRouter();
  const theme = useResolvedTheme();
  const reduced = useReducedMotion();
  const path = useSyncExternalStore(subscribeNothing, getPath, () => "this address");

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;

    const pointer = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const styles = getComputedStyle(document.documentElement);
    const color = styles.getPropertyValue(theme === "light" ? "--color-ink" : "--color-accent").trim();

    const build = () => {
      const width = Math.round(element.clientWidth * dpr);
      const height = Math.round(element.clientHeight * dpr);
      element.width = width;
      element.height = height;
      const size = Math.min(width * 0.36, height * 0.62);
      const centerX = width / 2;
      const centerY = height * 0.36;

      const number = sample(width, height, (ctx) => {
        ctx.font = `400 ${size}px ${styles.getPropertyValue("--font-display").split(",")[0]}, serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("404", centerX, centerY);
      });
      const unit = size * 0.44;
      const monogram = sample(width, height, (ctx) => {
        ctx.fillRect(centerX - unit * 0.9, centerY - unit, unit * 0.34, unit * 2);
        ctx.fillRect(centerX + unit * 0.56, centerY - unit, unit * 0.34, unit * 2);
        ctx.fillRect(centerX - unit * 0.56, centerY - unit * 0.13, unit * 1.12, unit * 0.26);
      });
      if (number.length === 0 || monogram.length === 0) return;

      particles = Array.from({ length: COUNT[theme] }, () => {
        const home = pick(number);
        return {
          x: reduced ? home[0] : Math.random() * width,
          y: reduced ? home[1] : Math.random() * height,
          vx: 0,
          vy: 0,
          home,
          h: pick(monogram),
        };
      });
    };

    const paint = () => {
      context.clearRect(0, 0, element.width, element.height);
      context.fillStyle = color;
      context.globalAlpha = theme === "light" ? 0.72 : 0.8;
      const dot = (theme === "light" ? 1.1 : 1.6) * dpr;
      for (const particle of particles) context.fillRect(particle.x, particle.y, dot, dot);
    };

    const tick = () => {
      const spring = morphing.current ? 0.07 : 0.035;
      for (const particle of particles) {
        const [targetX, targetY] = morphing.current ? particle.h : particle.home;
        particle.vx += (targetX - particle.x) * spring;
        particle.vy += (targetY - particle.y) * spring;
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = PUSH_RADIUS * dpr;
        if (distance < radius && distance > 0 && !morphing.current) {
          const force = (1 - distance / radius) * 9;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
      }
      paint();
      frame = requestAnimationFrame(tick);
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX * dpr;
      pointer.y = event.clientY * dpr;
    };
    const rebuild = () => {
      build();
      if (reduced) paint();
    };

    // Waits for the display font, so the particles trace the same serif as the headings.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      rebuild();
      if (!reduced) frame = requestAnimationFrame(tick);
    });
    window.addEventListener("resize", rebuild);
    if (!reduced) window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("pointermove", move);
    };
  }, [theme, reduced]);

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    event.preventDefault();
    morphing.current = true;
    setTimeout(() => router.push("/"), MORPH_MS);
  };

  return (
    <main className="relative flex min-h-dvh items-end overflow-hidden">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="shell relative pb-12 md:pb-16">
        <p className="eyebrow">Page match</p>
        <h1 className="font-display mt-3 text-5xl md:text-7xl">
          0 of 1 pages <span className="text-foil italic">matched</span>
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="eyebrow">New to me</span>
          <code className="chip">{path}</code>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <Link href="/" onClick={goHome} className="button button-foil">
            Take me home
          </Link>
          <Link href="/#work" className="link">
            See my work
          </Link>
          <Link href="/#playground" className="link">
            Test me against your job
          </Link>
        </div>
      </div>
    </main>
  );
}
