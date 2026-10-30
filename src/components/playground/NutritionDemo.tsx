"use client";

import { useState } from "react";
import { sampleFoods } from "@/content/site";

export default function NutritionDemo() {
  const [foodName, setFoodName] = useState(sampleFoods[0].name);
  const [grams, setGrams] = useState(150);

  const food = sampleFoods.find((item) => item.name === foodName) ?? sampleFoods[0];
  const amount = (value: number) => (value * grams) / 100;
  const calories = amount(food.protein * 4 + food.carbs * 4 + food.fat * 9);
  const macros = [
    { label: "Protein", value: amount(food.protein) },
    { label: "Carbs", value: amount(food.carbs) },
    { label: "Fat", value: amount(food.fat) },
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <label className="text-sm text-ivory/70">
          Food
          <select
            value={foodName}
            onChange={(event) => setFoodName(event.target.value)}
            className="search mt-2 !max-w-none"
          >
            {sampleFoods.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ivory/70">
          Grams
          <input
            type="number"
            min={0}
            max={1000}
            value={grams}
            onChange={(event) => setGrams(Math.max(0, Number(event.target.value)))}
            className="search mt-2 !max-w-none"
          />
        </label>
      </div>
      <dl aria-live="polite" className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-sm text-ivory/70">Calories</dt>
          <dd className="font-display text-3xl">{Math.round(calories)}</dd>
        </div>
        {macros.map((macro) => (
          <div key={macro.label}>
            <dt className="text-sm text-ivory/70">{macro.label}</dt>
            <dd className="font-display text-3xl">{macro.value.toFixed(1)} g</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
