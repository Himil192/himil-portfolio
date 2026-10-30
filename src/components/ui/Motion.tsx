"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion, useResolvedTheme } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);
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

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        if (theme === "light") {
          // Tied to the scrollbar, so content glides in and reverses when scrolling back.
          // Clamped so the last blocks on the page still finish.
          gsap.fromTo(
            element,
            { y: 56, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "clamp(top 95%)",
                end: "clamp(top 62%)",
                scrub: 0.6,
              },
            },
          );
          return;
        }
        gsap.from(element, {
          y: 44,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      if (theme === "light") {
        gsap.to("#top .shell", {
          y: -70,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom 30%", scrub: 0.6 },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: Number(element.dataset.parallax),
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => context.revert();
  }, [reduced, theme]);

  return null;
}
