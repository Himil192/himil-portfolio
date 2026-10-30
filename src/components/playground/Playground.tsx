import ApiStatesDemo from "./ApiStatesDemo";
import NutritionDemo from "./NutritionDemo";
import ResponsiveDemo from "./ResponsiveDemo";
import SearchDemo from "./SearchDemo";

const demos = [
  {
    title: "Nutrition calculator",
    skill: "Real-time UI",
    note: "A small take on the kind of feature I built at Neonat Health. Sample data, not their product.",
    demo: <NutritionDemo />,
  },
  {
    title: "API states",
    skill: "API integration",
    note: "Every request needs a plan for waiting, nothing found, and failure. Try the error, then retry.",
    demo: <ApiStatesDemo />,
  },
  {
    title: "Responsive layout",
    skill: "Responsive design",
    note: "Container queries let a component adapt to its own space. Drag to resize it.",
    demo: <ResponsiveDemo />,
  },
  {
    title: "Search performance",
    skill: "Performance",
    note: "Debouncing waits for a pause in typing. Type with it on and off, then compare filter runs.",
    demo: <SearchDemo />,
  },
];

export default function Playground() {
  return (
    <section id="lab" className="shell py-28 md:py-44">
      <p className="eyebrow" data-reveal>
        Frontend lab
      </p>
      <h2 className="section-title" data-reveal>
        Try how I <span className="text-foil italic">work</span>
      </h2>
      <p className="mt-6 max-w-xl text-ivory/70" data-reveal>
        Four small working demos of everyday frontend problems, all built for this site.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {demos.map((item) => (
          <article key={item.title} className="rounded-2xl border border-ivory/10 p-5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-3xl">{item.title}</h3>
              <span className="eyebrow">{item.skill}</span>
            </div>
            <p className="mt-2 mb-6 text-sm text-ivory/70">{item.note}</p>
            {item.demo}
          </article>
        ))}
      </div>
    </section>
  );
}
