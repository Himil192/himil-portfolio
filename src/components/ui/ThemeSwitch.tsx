"use client";

import { ReactNode, useEffect } from "react";
import { useReducedMotion, useThemeChoice } from "@/lib/hooks";
import { prepareGold } from "@/lib/liquidGold";
import { changeTheme, ThemeChoice } from "@/lib/theme";

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
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 1500));
    idle(prepareGold);
  }, [reduced]);

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
            onChange={(event) => {
              const button = event.currentTarget.parentElement?.getBoundingClientRect();
              changeTheme(
                option,
                button && { x: button.left + button.width / 2, y: button.top + button.height / 2 },
              );
            }}
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
