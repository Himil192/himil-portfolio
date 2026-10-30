import { site } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";
import ShaderSurface from "@/components/ui/ShaderSurface";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-dvh items-end overflow-hidden">
      <ShaderSurface name="liquid" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/20" />
      <div className="shell relative pb-16 md:pb-24">
        <p className="eyebrow">
          {site.role} / {site.location}
        </p>
        <h1 className="font-display mt-5 text-[17vw] leading-[0.92] md:text-[11.5vw]">
          Himil <span className="text-foil italic">Prajapati</span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-lg text-ivory/75">{site.intro}</p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton href="#work" variant="foil">
              View work
            </MagneticButton>
            <MagneticButton href={site.resume} download>
              Resume
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
