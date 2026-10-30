"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { chapters } from "@/content/site";
import {
  frameCount,
  frameUrl,
  nearestFrame,
  startLoadingFrames,
  subscribeFrames,
} from "@/lib/frameStore";
import { useInView, useReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

const FADE = 0.04;

function chapterOpacity(progress: number, [start, end]: readonly [number, number]) {
  const fadeIn = start === 0 ? 1 : (progress - start) / FADE;
  const fadeOut = end === 1 ? 1 : (end - progress) / FADE;
  return Math.min(1, Math.max(0, Math.min(fadeIn, fadeOut)));
}

export default function ScrollSequence() {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const chapterEls = useRef<(HTMLDivElement | null)[]>([]);
  // Frames are the heaviest asset, so visitors who never get near the section skip them.
  const near = useInView(section, "200% 0px");

  useEffect(() => {
    if (near) startLoadingFrames();
  }, [near]);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d", { alpha: false });
    if (!element || !context || !section.current) return;

    let target = 0;
    let current = 0;
    let lastFrame: HTMLImageElement | undefined;
    let dirty = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      element.width = Math.round(element.clientWidth * dpr);
      element.height = Math.round(element.clientHeight * dpr);
      dirty = true;
    };

    const draw = (frame: HTMLImageElement) => {
      const scale = Math.max(
        element.width / frame.naturalWidth,
        element.height / frame.naturalHeight,
      );
      const width = frame.naturalWidth * scale;
      const height = frame.naturalHeight * scale;
      context.drawImage(
        frame,
        (element.width - width) / 2,
        (element.height - height) / 2,
        width,
        height,
      );
    };

    const tick = () => {
      // Based on elapsed time, so slow devices ease at the same speed instead of trailing behind.
      current += (target - current) * (1 - Math.pow(0.8, gsap.ticker.deltaRatio(60)));
      const frame = nearestFrame(Math.round(current * (frameCount() - 1)));
      if (frame && (frame !== lastFrame || dirty)) {
        draw(frame);
        lastFrame = frame;
        dirty = false;
      }
      chapters.forEach((chapter, index) => {
        const el = chapterEls.current[index];
        if (!el) return;
        const opacity = chapterOpacity(current, chapter.range);
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 24}px)`;
      });
    };

    resize();
    window.addEventListener("resize", resize);
    const unsubscribe = subscribeFrames(() => {
      dirty = true;
    });
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = self.progress;
      },
    });
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section id="story" data-inspect="ScrollSequence" className="shell py-24">
        <p className="eyebrow">Story</p>
        <h2 className="section-title">
          My <span className="text-foil italic">story</span>
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
          <Image
            src={frameUrl("desktop", 239)}
            alt="A monogram H formed from champagne particles"
            width={1920}
            height={1080}
            className="rounded-2xl"
          />
          <div className="space-y-8">
            {chapters.map((chapter) => (
              <div key={chapter.kicker}>
                <p className="eyebrow">{chapter.kicker}</p>
                <h3 className="font-display mt-2 text-3xl">{chapter.title}</h3>
                <p className="mt-2 text-ivory/70">{chapter.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="story" data-inspect="ScrollSequence" ref={section} className="relative h-[300vh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="shell relative flex h-full items-end pb-20 md:items-center md:pb-0">
          <div className="relative h-56 w-full max-w-md">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.kicker}
                ref={(el) => {
                  chapterEls.current[index] = el;
                }}
                className="absolute inset-x-0 bottom-0 md:top-0 md:bottom-auto"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                <p className="eyebrow">{chapter.kicker}</p>
                <h2 className="font-display mt-3 text-4xl leading-tight md:text-6xl">
                  {chapter.title}
                </h2>
                <p className="mt-4 text-ivory/70 md:text-lg">{chapter.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
