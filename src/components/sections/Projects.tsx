import { projects } from "@/content/site";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="work" className="shell relative overflow-x-clip py-28 md:py-44">
      <span data-ghost aria-hidden className="ghost-word">
        Work
      </span>
      <p className="eyebrow" data-reveal>
        Selected work
      </p>
      <h2 className="section-title" data-reveal>
        Things I&apos;ve <span className="text-foil italic">made</span>
      </h2>
      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
