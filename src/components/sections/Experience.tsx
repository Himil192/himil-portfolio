import { experience } from "@/content/site";

export default function Experience() {
  return (
    <section id="experience" className="shell relative py-28 md:py-44">
      <span
        data-parallax="-30"
        aria-hidden
        className="font-display pointer-events-none absolute top-16 right-4 text-[24vw] leading-none text-ivory/[0.04] select-none"
      >
        Work
      </span>
      <p className="eyebrow" data-reveal>
        Experience
      </p>
      <h2 className="section-title" data-reveal>
        Where I&apos;ve <span className="text-foil italic">built</span>
      </h2>
      <div className="mt-16 border-t border-ivory/10">
        {experience.map((job) => (
          <article
            key={job.company}
            data-reveal
            className="grid gap-6 border-b border-ivory/10 py-10 md:grid-cols-[1fr_1.4fr] md:gap-12"
          >
            <div>
              <h3 className="font-display text-3xl md:text-4xl">{job.company}</h3>
              <p className="mt-2 text-ivory/70">{job.role}</p>
              <p className="eyebrow mt-3">{job.period}</p>
            </div>
            <ul className="space-y-3 text-ivory/70">
              {job.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-champagne" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
