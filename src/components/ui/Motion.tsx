"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion, useResolvedTheme } from "@/lib/hooks";
import { getResolvedTheme } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

// Owns page-wide scroll behaviour: smooth scrolling, reveals, and parallax.
export default function Motion() {
  const reduced = useReducedMotion();
  const theme = useResolvedTheme();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ anchors: true, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const calm = getResolvedTheme() === "light";
    const context = gsap.context(() => {
      const reveals = calm ? "[data-reveal]:not(.section-title)" : "[data-reveal]";
      gsap.utils.toArray<HTMLElement>(reveals).forEach((element) => {
        gsap.from(element, {
          y: calm ? 14 : 44,
          autoAlpha: 0,
          duration: calm ? 1.4 : 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: Number(element.dataset.parallax),
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  // Light mode's motion is typographic: text rises softly, and italic words settle from gold to ink.
  useEffect(() => {
    if (reduced || theme !== "light") return;

    let cancelled = false;
    let context: gsap.Context | undefined;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent");

    const settle = (element: Element | null, delay: number, scrollTrigger?: ScrollTrigger.Vars) => {
      if (!element) return;
      gsap.from(element, { color: accent, duration: 1.4, delay, ease: "power1.inOut", scrollTrigger });
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      context = gsap.context(() => {
        const name = document.querySelector("#top h1");
        if (name) {
          SplitText.create(name, {
            type: "words,chars",
            mask: "chars",
            charsClass: "split-char",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, { yPercent: 115, duration: 1.1, stagger: 0.028, ease: "power3.out" }),
          });
          settle(name.querySelector(".text-foil"), 0.5);
        }

        gsap.utils.toArray<HTMLElement>(".section-title").forEach((title) => {
          // A heading revealed in dark before switching must not run two animations.
          gsap.killTweensOf(title);
          gsap.set(title, { clearProps: "all" });
          const scrollTrigger = { trigger: title, start: "top 88%", once: true };
          SplitText.create(title, {
            type: "words",
            mask: "words",
            wordsClass: "split-word",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 115,
                duration: 1.1,
                stagger: 0.07,
                ease: "power3.out",
                scrollTrigger,
              }),
          });
          settle(title.querySelector(".text-foil"), 0.35, scrollTrigger);
        });
      });
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [reduced, theme]);

  return null;
}
