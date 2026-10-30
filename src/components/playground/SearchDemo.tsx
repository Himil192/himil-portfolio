"use client";

import { useEffect, useRef, useState } from "react";

const RECORDS = Array.from({ length: 5000 }, (_, index) => `Record ${index + 1}`);
const DEBOUNCE_MS = 250;

const search = (query: string) =>
  RECORDS.filter((record) => record.toLowerCase().includes(query.trim().toLowerCase()));

export default function SearchDemo() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState(true);
  const [matches, setMatches] = useState(RECORDS);
  const [keystrokes, setKeystrokes] = useState(0);
  const [runs, setRuns] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = (value: string) => {
    setMatches(search(value));
    setRuns((count) => count + 1);
  };
  const change = (value: string) => {
    setQuery(value);
    setKeystrokes((count) => count + 1);
    clearTimeout(timer.current);
    if (debounced) timer.current = setTimeout(() => run(value), DEBOUNCE_MS);
    else run(value);
  };
  const toggle = () => {
    clearTimeout(timer.current);
    setDebounced(!debounced);
    setQuery("");
    setMatches(RECORDS);
    setKeystrokes(0);
    setRuns(0);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(event) => change(event.target.value)}
          placeholder="Try typing 1234"
          aria-label="Search 5,000 sample records"
          className="search min-w-0 flex-1"
        />
        <button type="button" aria-pressed={debounced} onClick={toggle} className="chip chip-button">
          Debounce
        </button>
      </div>
      <dl aria-live="polite" className="mt-5 grid grid-cols-3 gap-4">
        <div>
          <dt className="text-sm text-ivory/70">Keystrokes</dt>
          <dd className="font-display text-3xl">{keystrokes}</dd>
        </div>
        <div>
          <dt className="text-sm text-ivory/70">Filter runs</dt>
          <dd className="font-display text-3xl">{runs}</dd>
        </div>
        <div>
          <dt className="text-sm text-ivory/70">Matches</dt>
          <dd className="font-display text-3xl">{matches.length}</dd>
        </div>
      </dl>
    </div>
  );
}
