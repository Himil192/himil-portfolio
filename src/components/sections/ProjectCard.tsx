"use client";

import { useState } from "react";
import ShaderSurface from "@/components/ui/ShaderSurface";
import { projects } from "@/content/site";

export default function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-reveal
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl border border-ivory/10 p-7 md:p-9"
    >
      <ShaderSurface
        name={project.shader}
        active={hovered}
        className="opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-obsidian/10" />
      <div className="relative">
        <p className="eyebrow">{project.tag}</p>
        <h3 className="font-display mt-3 text-4xl">{project.title}</h3>
        <p className="mt-3 text-ivory/70">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-6">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="link">
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
