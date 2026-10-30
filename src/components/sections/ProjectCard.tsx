"use client";

import Image from "next/image";
import { useState } from "react";
import ShaderSurface from "@/components/ui/ShaderSurface";
import { Project } from "@/content/site";

export default function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-reveal
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 p-5 md:p-6"
    >
      <ShaderSurface
        name={project.shader}
        active={hovered}
        className="opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/85 to-canvas/40" />
      <div className="relative flex h-full flex-col">
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={960}
          height={600}
          className="rounded-lg border border-ink/10 transition-transform duration-700 ease-out group-hover:-translate-y-1"
        />
        <p className="eyebrow mt-6">{project.tag}</p>
        <h3 className="font-display mt-3 text-4xl">{project.title}</h3>
        <p className="mt-3 text-ink/70">{project.description}</p>
        <p className="mt-3 text-ink/70">{project.built}</p>
        {project.result && <p className="mt-3">{project.result}</p>}
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
        </ul>
        {project.links.length > 0 && (
          <div className="mt-6 flex gap-6">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="link">
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
