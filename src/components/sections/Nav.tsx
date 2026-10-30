"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import CommandMenu from "@/components/ui/CommandMenu";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { navLinks } from "@/content/site";

export default function Nav() {
  const menu = useRef<HTMLDetailsElement>(null);
  const [active, setActive] = useState("");
  const close = () => menu.current?.removeAttribute("open");
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  useEffect(() => {
    // A thin band at mid-screen, so exactly one section counts as current.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("section[id], footer[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav-bar fixed inset-x-0 top-0 z-40">
      <div className="shell relative flex items-center justify-between py-5">
        <a href="#top" data-nav-logo className="nav-logo font-display text-2xl" aria-label="Back to top">
          <span data-nav-hp>HP</span>
          {/* Stays hidden unless motion is allowed; the real name remains in the hero heading. */}
          <span data-name-fly aria-hidden className="name-fly">
            <span data-fly-word>Himil</span>
            <span data-fly-word className="text-foil italic">
              Prajapati
            </span>
          </span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          <nav aria-label="Primary" className="flex gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className="nav-link eyebrow"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <CommandMenu />
          <ThemeSwitch name="theme-desktop" />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitch name="theme-mobile" />
          {/* A details element, so the menu still opens if JavaScript never runs. */}
          <details ref={menu} onKeyDown={closeOnEscape}>
            <summary className="nav-toggle" aria-label="Menu">
              <span aria-hidden />
              <span aria-hidden />
            </summary>
            <nav aria-label="Mobile" onClick={close} className="nav-panel">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="font-display text-3xl">
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
