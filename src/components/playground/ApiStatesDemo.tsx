"use client";

import { useEffect, useRef, useState } from "react";
import { sampleFoods } from "@/content/site";

const STATES = ["Loading", "Success", "Empty", "Error"] as const;
const RETRY_MS = 900;

export default function ApiStatesDemo() {
  const [state, setState] = useState<(typeof STATES)[number]>("Success");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (next: (typeof STATES)[number]) => {
    clearTimeout(timer.current);
    setState(next);
  };
  const retry = () => {
    choose("Loading");
    timer.current = setTimeout(() => setState("Success"), RETRY_MS);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an API state">
        {STATES.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={state === name}
            onClick={() => choose(name)}
            className="chip chip-button"
          >
            {name}
          </button>
        ))}
      </div>
      <div role="status" className="mt-5 min-h-32 rounded-xl border border-ivory/10 p-4">
        {state === "Loading" && (
          <div className="animate-pulse space-y-3 motion-reduce:animate-none">
            <span className="sr-only">Loading</span>
            <div className="h-4 w-2/3 rounded bg-ivory/10" />
            <div className="h-4 w-1/2 rounded bg-ivory/10" />
            <div className="h-4 w-3/5 rounded bg-ivory/10" />
          </div>
        )}
        {state === "Success" && (
          <ul className="space-y-2">
            {sampleFoods.slice(0, 3).map((food) => (
              <li key={food.name} className="flex justify-between gap-4 text-sm">
                <span>{food.name}</span>
                <span className="text-ivory/70">{food.protein} g protein</span>
              </li>
            ))}
          </ul>
        )}
        {state === "Empty" && <p className="text-sm text-ivory/70">No foods match this request.</p>}
        {state === "Error" && (
          <div>
            <p className="text-sm text-ivory/70">The request failed. Please try again.</p>
            <button type="button" onClick={retry} className="chip chip-button mt-3">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
