import { achievements, certifications, education, skills } from "@/content/site";

export default function Credentials() {
  return (
    <section id="skills" className="shell py-28 md:py-44">
      <p className="eyebrow" data-reveal>
        Toolkit
      </p>
      <h2 className="section-title" data-reveal>
        What I <span className="text-foil italic">work with</span>
      </h2>

      <dl className="mt-16 border-t border-ivory/10">
        {skills.map((skill) => (
          <div
            key={skill.group}
            data-reveal
            className="grid gap-3 border-b border-ivory/10 py-6 md:grid-cols-[1fr_3fr]"
          >
            <dt className="eyebrow pt-1">{skill.group}</dt>
            <dd className="flex flex-wrap gap-2">
              {skill.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 grid gap-14 md:grid-cols-2">
        <div data-reveal className="md:col-span-2">
          <h3 className="font-display text-3xl">Education</h3>
          <p className="mt-6">{education.degree}</p>
          <p className="mt-1 text-ivory/70">{education.school}</p>
          <p className="eyebrow mt-3">
            {education.period} / {education.score}
          </p>
        </div>
        <div data-reveal>
          <h3 className="font-display text-3xl">Certifications</h3>
          <ul className="mt-6 space-y-3">
            {certifications.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer" className="link">
                  {item.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <h3 className="font-display text-3xl">Achievements</h3>
          <ul className="mt-6 space-y-3 text-ivory/70">
            {achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
