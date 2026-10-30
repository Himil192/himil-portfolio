import JobMatch from "./JobMatch";

export default function Playground() {
  return (
    <section id="playground" className="shell py-28 md:py-44">
      <p className="eyebrow" data-reveal>
        Playground
      </p>
      <h2 className="section-title" data-reveal>
        Test me against <span className="text-foil italic">your job</span>
      </h2>
      <p className="mt-6 mb-12 max-w-xl text-ivory/70" data-reveal>
        Paste a job description to see which skills match my real experience, and which ones I
        would still need to learn.
      </p>
      <JobMatch />
    </section>
  );
}
