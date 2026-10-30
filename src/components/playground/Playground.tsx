"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect, useMemo, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import ShaderSurface from "@/components/ui/ShaderSurface";
import ScrambleText from "./ScrambleText";

type Item = { title: string; category: string; note: string; demo: ReactNode };

const items: Item[] = [
  {
    title: "Liquid Metal",
    category: "Shaders",
    note: "Domain-warped noise lit like polished metal. Move your pointer to raise a swell.",
    demo: <ShaderSurface name="liquid" />,
  },
  {
    title: "Voronoi Glass",
    category: "Shaders",
    note: "Drifting cells whose edges light up around the pointer.",
    demo: <ShaderSurface name="cells" />,
  },
  {
    title: "Contour Field",
    category: "Backgrounds",
    note: "Animated topographic lines that lift toward the pointer.",
    demo: <ShaderSurface name="contour" />,
  },
  {
    title: "Silk Folds",
    category: "Backgrounds",
    note: "Layered sine folds that lean gently toward the pointer.",
    demo: <ShaderSurface name="silk" />,
  },
  {
    title: "Foil Button",
    category: "Buttons",
    note: "A metallic sweep on a magnetic hit area.",
    demo: <MagneticButton variant="foil">Hover me</MagneticButton>,
  },
  {
    title: "Ghost Magnet",
    category: "Buttons",
    note: "A quiet outline button that follows the pointer.",
    demo: <MagneticButton>Hover me</MagneticButton>,
  },
  {
    title: "Scramble Reveal",
    category: "Motion",
    note: "Text that decodes itself one character at a time on hover.",
    demo: <ScrambleText text="Hover to decode" />,
  },
];

const categories = ["All", ...new Set(items.map((item) => item.category))];

export default function Playground() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        `${item.title} ${item.category} ${item.note}`.toLowerCase().includes(term),
    );
  }, [query, category]);

  // Filtering changes page height, which moves every scroll trigger below this section.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [visible]);

  return (
    <section id="playground" className="shell py-28 md:py-44">
      <p className="eyebrow" data-reveal>
        Playground
      </p>
      <h2 className="section-title" data-reveal>
        The parts of <span className="text-foil italic">this site</span>
      </h2>
      <p className="mt-6 max-w-xl text-ivory/70" data-reveal>
        Every shader, background, and interaction used here, running live. Search the library or
        browse a category.
      </p>

      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
              className="chip chip-button"
            >
              {name}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the library"
          aria-label="Search the library"
          className="search"
        />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-2xl border border-ivory/10"
          >
            <div className="relative flex h-56 items-center justify-center overflow-hidden">
              {item.demo}
            </div>
            <div className="border-t border-ivory/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl">{item.title}</h3>
                <span className="eyebrow">{item.category}</span>
              </div>
              <p className="mt-2 text-sm text-ivory/70">{item.note}</p>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="mt-10 text-ivory/70">Nothing matches that search.</p>
      )}
    </section>
  );
}
