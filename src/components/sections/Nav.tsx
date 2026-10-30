"use client";

import { KeyboardEvent, useRef } from "react";

const links = [
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Story", href: "#story" },
  { label: "Playground", href: "#playground" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => menu.current?.removeAttribute("open");
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  return (
    <header className="nav-bar shell fixed inset-x-0 top-0 z-40 flex items-center justify-between py-6">
      <a href="#top" className="font-display text-2xl" aria-label="Back to top">
        HP
      </a>
      <nav aria-label="Primary" className="hidden gap-8 md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="eyebrow !text-ivory hover:opacity-60">
            {link.label}
          </a>
        ))}
      </nav>
      {/* A details element, so the menu still opens if JavaScript never runs. */}
      <details ref={menu} onKeyDown={closeOnEscape} className="md:hidden">
        <summary className="nav-toggle eyebrow !text-ivory">Menu</summary>
        <nav aria-label="Mobile" onClick={close} className="nav-panel">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="font-display text-3xl">
              {link.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}
