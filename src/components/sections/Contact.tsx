import MagneticButton from "@/components/ui/MagneticButton";
import ShaderSurface from "@/components/ui/ShaderSurface";
import { site } from "@/content/site";

export default function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden">
      <ShaderSurface name="contour" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/60 to-obsidian" />
      <div className="shell relative py-32 md:py-48">
        <p className="eyebrow" data-reveal>
          Contact
        </p>
        <h2 className="font-display mt-4 text-[13vw] leading-[0.95] md:text-[8vw]" data-reveal>
          Let&apos;s build <span className="text-foil italic">something</span>
        </h2>
        <div className="mt-10 flex flex-wrap gap-3" data-reveal>
          <MagneticButton href={`mailto:${site.email}`} variant="foil">
            {site.email}
          </MagneticButton>
          <MagneticButton href={site.resume} download>
            Download resume
          </MagneticButton>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-ivory/10 pt-6">
          <ul className="flex flex-wrap gap-6">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="link">
                  {social.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="eyebrow">
            {site.name} / {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
