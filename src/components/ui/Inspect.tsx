"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { inspectSections, site } from "@/content/site";

type Metrics = { loadMs: number; scriptKb: number; requests: number; nodes: number };

const REFRESH_MS = 2000;
const subscribeNothing = () => () => {};

function measure(): Metrics {
  const [page] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const scriptBytes = resources
    .filter((entry) => entry.initiatorType === "script")
    .reduce((total, entry) => total + (entry.transferSize || entry.encodedBodySize), 0);
  return {
    loadMs: Math.round(page?.loadEventEnd ?? 0),
    scriptKb: Math.round(scriptBytes / 1024),
    requests: resources.length + 1,
    nodes: document.querySelectorAll("*").length,
  };
}

export default function Inspect() {
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(inspectSections[0].component);
  const [metrics, setMetrics] = useState<Metrics>();

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.inspecting = "true";

    // A thin band at mid-screen, so exactly one section counts as current.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setCurrent((visible.target as HTMLElement).dataset.inspect ?? "");
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-inspect]").forEach((section) => observer.observe(section));

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    const refresh = window.setInterval(() => setMetrics(measure()), REFRESH_MS);

    return () => {
      delete root.dataset.inspecting;
      observer.disconnect();
      window.removeEventListener("keydown", closeOnEscape);
      window.clearInterval(refresh);
    };
  }, [open]);

  if (!hydrated) return null;

  const toggle = () => {
    if (!open) setMetrics(measure());
    setOpen(!open);
  };
  const section = inspectSections.find((item) => item.component === current) ?? inspectSections[0];
  const stats = metrics && [
    { label: "Page load", value: `${metrics.loadMs} ms` },
    { label: "JS transferred", value: `${metrics.scriptKb} KB` },
    { label: "Requests", value: metrics.requests },
    { label: "DOM nodes", value: metrics.nodes },
  ];

  return (
    <div className="inspect">
      {open && (
        <aside aria-label="Site inspector" data-lenis-prevent className="inspect-panel">
          <div aria-live="polite">
            <p className="eyebrow">Section in view</p>
            <h2 className="mt-2 font-mono text-lg">{`<${section.component} />`}</h2>
            <p className="mt-1 text-sm text-ivory/70">{section.rendering}</p>
            <p className="mt-3 text-sm text-ivory/70">{section.why}</p>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {section.tools.map((tool) => (
              <li key={tool} className="chip">
                {tool}
              </li>
            ))}
          </ul>
          <a
            href={`${site.repo}/blob/main/${section.file}`}
            target="_blank"
            rel="noreferrer"
            className="link mt-3"
          >
            View code ↗
          </a>
          {stats && (
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ivory/10 pt-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-ivory/70">{stat.label}</dt>
                  <dd className="font-mono text-sm">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-3 text-xs text-ivory/70">Measured live in your browser.</p>
        </aside>
      )}
      <button type="button" aria-pressed={open} onClick={toggle} className="inspect-toggle">
        {open ? "Close inspector" : "Inspect this site"}
      </button>
    </div>
  );
}
