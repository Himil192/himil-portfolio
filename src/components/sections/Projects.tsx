import { otherProjects, projects } from "@/content/site";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="work" className="shell py-28 md:py-44">
      <p className="eyebrow" data-reveal>
        Selected work
      </p>
      <h2 className="section-title" data-reveal>
        Things I&apos;ve <span className="text-foil italic">made</span>
      </h2>
      <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      <h3 className="font-display mt-20 text-3xl" data-reveal>
        Other work
      </h3>
      <ul className="mt-6 border-t border-ivory/10">
        {otherProjects.map((project) => (
          <li
            key={project.title}
            data-reveal
            className="flex flex-col gap-2 border-b border-ivory/10 py-5 md:flex-row md:items-center md:justify-between md:gap-8"
          >
            <div>
              <p>{project.title}</p>
              <p className="mt-1 text-sm text-ivory/70">{project.note}</p>
            </div>
            <div className="flex gap-6">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="link">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
