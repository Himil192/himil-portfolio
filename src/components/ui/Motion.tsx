"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion, useResolvedTheme } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const FLY_DISTANCE = "+=75%";
const GHOST_PUSH = 0.07;
const GHOST_LIMIT = 180;

// Each flying copy starts exactly over its real word in the hero heading, then lands in the nav.
function flyName() {
  const words = gsap.utils.toArray<HTMLElement>("[data-name-word]");
  const copies = gsap.utils.toArray<HTMLElement>("[data-fly-word]");
  const logo = document.querySelector<HTMLElement>("[data-nav-logo]");
  const heading = document.querySelector<HTMLElement>("#top h1");
  if (!logo || !heading || words.length !== copies.length) return;

  const start = (index: number) => {
    const word = words[index].getBoundingClientRect();
    const copy = copies[index];
    const origin = logo.getBoundingClientRect();
    return {
      x: word.left - (origin.left + copy.offsetLeft),
      y: word.top + window.scrollY - (origin.top + copy.offsetTop),
      scale: word.height / copy.offsetHeight,
    };
  };

  // Everything else in the hero leaves first, so the name flies through clear space.
  gsap.to("[data-hero-fade]", {
    y: -60,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: { trigger: "#top", start: "top top", end: "+=18%", scrub: 0.3 },
  });

  gsap.set("[data-name-fly]", { visibility: "visible" });
  gsap.set(heading, { opacity: 0 });
  gsap.to("[data-nav-hp]", {
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: { trigger: "#top", start: "top top", end: "+=20%", scrub: true },
  });

  copies.forEach((copy, index) => {
    gsap.fromTo(
      copy,
      {
        x: () => start(index).x,
        y: () => start(index).y,
        scale: () => start(index).scale,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: FLY_DISTANCE,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

// Light mode's motion is all tied to the scrollbar, so everything reverses when scrolling back.
function lightMotion() {
  gsap.utils.toArray<HTMLElement>(".section-title").forEach((title) => {
    SplitText.create(title, {
      type: "words",
      autoSplit: true,
      onSplit: ({ words }) =>
        gsap.fromTo(
          words,
          {
            x: (index) => (index % 2 ? 1 : -1) * window.innerWidth * 0.4,
            rotation: (index) => (index % 2 ? 7 : -7),
            autoAlpha: 0,
          },
          {
            x: 0,
            rotation: 0,
            autoAlpha: 1,
            ease: "power2.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: title,
              start: "clamp(top 98%)",
              end: "clamp(top 52%)",
              scrub: 0.6,
            },
          },
        ),
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-ink]").forEach((block) => {
    SplitText.create(block, {
      type: "words",
      autoSplit: true,
      onSplit: ({ words }) =>
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: block,
              start: "clamp(top 90%)",
              end: "clamp(top 55%)",
              scrub: 0.4,
            },
          },
        ),
    });
  });

  gsap.utils.toArray<HTMLElement>("#work article").forEach((card) => {
    gsap.fromTo(
      card,
      { y: 130, scale: 0.93, autoAlpha: 0 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: { trigger: card, start: "clamp(top 100%)", end: "clamp(top 60%)", scrub: 0.6 },
      },
    );
    gsap.fromTo(
      card.querySelector("img"),
      { yPercent: -5, scale: 1.13 },
      {
        yPercent: 5,
        scale: 1.13,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>("#skills dl > div").forEach((row, index) => {
    gsap.fromTo(
      row.querySelectorAll("dt, .chip"),
      { x: (index % 2 ? 1 : -1) * 160, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: { trigger: row, start: "clamp(top 96%)", end: "clamp(top 66%)", scrub: 0.5 },
      },
    );
  });

  // Giant words drift with the page, and scroll speed pushes them further in either direction.
  const ghosts = gsap.utils.toArray<HTMLElement>("[data-ghost]").map((ghost, index) => {
    const direction = index % 2 ? 1 : -1;
    const tween = gsap.fromTo(
      ghost,
      { xPercent: direction * 14 },
      {
        xPercent: direction * -30,
        ease: "none",
        scrollTrigger: {
          trigger: ghost.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      },
    );
    return {
      trigger: tween.scrollTrigger,
      push: gsap.quickTo(ghost, "x", { duration: 0.7, ease: "power3.out" }),
    };
  });
  const push = () => {
    ghosts.forEach(({ trigger, push: setPush }) => {
      const speed = (trigger?.getVelocity() ?? 0) * GHOST_PUSH;
      setPush(gsap.utils.clamp(-GHOST_LIMIT, GHOST_LIMIT, -speed));
    });
  };
  gsap.ticker.add(push);
  return () => gsap.ticker.remove(push);
}

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

    let cancelled = false;
    let context: gsap.Context | undefined;
    let stopLight: (() => void) | undefined;

    // Waits for fonts, because split lines and the flying name are measured from real text.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      context = gsap.context(() => {
        const light = theme === "light";
        const reveals = light
          ? "[data-reveal]:not(.section-title):not(#work article):not(#skills dl > div)"
          : "[data-reveal]";

        gsap.utils.toArray<HTMLElement>(reveals).forEach((element) => {
          if (light) {
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

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.to(element, {
            yPercent: Number(element.dataset.parallax),
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
          });
        });

        flyName();
        if (light) stopLight = lightMotion();
      });
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      stopLight?.();
      context?.revert();
    };
  }, [reduced, theme]);

  return null;
}
