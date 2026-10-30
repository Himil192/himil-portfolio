"use client";

import { useState } from "react";

const CARDS = ["Overview", "Activity", "Reports"];

export default function ResponsiveDemo() {
  const [width, setWidth] = useState(100);

  return (
    <div>
      <label className="block text-sm text-ivory/70">
        Container width: {width}%
        <input
          type="range"
          min={40}
          max={100}
          value={width}
          onChange={(event) => setWidth(Number(event.target.value))}
          className="lab-range mt-3 block w-full"
        />
      </label>
      <div
        style={{ width: `${width}%` }}
        className="@container mt-5 rounded-xl border border-ivory/10 p-3"
      >
        <div className="grid grid-cols-1 gap-2 @[16rem]:grid-cols-2 @[26rem]:grid-cols-3">
          {CARDS.map((card) => (
            <div key={card} className="rounded-lg bg-ivory/5 p-3">
              <p className="text-sm">{card}</p>
              <div className="mt-3 h-1.5 w-2/3 rounded bg-champagne/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
