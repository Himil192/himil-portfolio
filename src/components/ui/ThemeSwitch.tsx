"use client";

import { ReactNode } from "react";
import { useThemeChoice } from "@/lib/hooks";
import { setThemeChoice, ThemeChoice } from "@/lib/theme";

const icons: Record<ThemeChoice, ReactNode> = {
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
};

export default function ThemeSwitch({ name }: { name: string }) {
  const choice = useThemeChoice();

  return (
    <fieldset className="theme-switch">
      <legend className="sr-only">Theme</legend>
      {(Object.keys(icons) as ThemeChoice[]).map((option) => (
        <label key={option} className="theme-option" title={option}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={choice === option}
            onChange={() => setThemeChoice(option)}
            className="sr-only"
          />
          <span className="sr-only">{option}</span>
          <svg viewBox="0 0 24 24" aria-hidden width="16" height="16">
            {icons[option]}
          </svg>
        </label>
      ))}
    </fieldset>
  );
}
