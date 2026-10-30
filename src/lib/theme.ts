import { pourGold } from "./liquidGold";

// Theme state lives outside React so the nav switch, command menu, and shaders share one source.

export const THEME_CHOICES = ["system", "light", "dark"] as const;
export type ThemeChoice = (typeof THEME_CHOICES)[number];
export type ResolvedTheme = "light" | "dark";

const KEY = "theme";
const COLORS = { light: "#fbfaf8", dark: "#0a0a0b" };
const LIGHT_QUERY = "(prefers-color-scheme: light)";

const listeners = new Set<() => void>();

// Applies a saved choice before first paint. System has no attribute, so CSS follows the device.
export const themeScript = `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function getThemeChoice(): ThemeChoice {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : "system";
}

export function getResolvedTheme(): ResolvedTheme {
  const choice = getThemeChoice();
  if (choice !== "system") return choice;
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

export function setThemeChoice(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;

  try {
    if (choice === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    // Private windows can block storage; the theme still applies for this visit.
  }

  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const device = meta.media.includes("light") ? "light" : "dark";
    meta.content = COLORS[choice === "system" ? device : choice];
  });
  notify();
}

const resolve = (choice: ThemeChoice): ResolvedTheme =>
  choice === "system" ? (window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark") : choice;

// The pour is for a visitor's own choice; device changes in System mode stay instant.
let pouring: ThemeChoice | undefined;

// The switch shows the target straight away, even while gold still covers the old theme.
export const getDisplayedChoice = () => pouring ?? getThemeChoice();

const notify = () => listeners.forEach((listener) => listener());

export function changeTheme(choice: ThemeChoice, origin?: { x: number; y: number }) {
  // A click during a pour runs as soon as this one ends.
  if (pouring) {
    pouring = choice;
    notify();
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || resolve(choice) === getResolvedTheme()) {
    setThemeChoice(choice);
    return;
  }

  pouring = choice;
  notify();
  const started = pourGold(
    resolve(choice),
    origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    () => setThemeChoice(choice),
    () => {
      const last = pouring;
      pouring = undefined;
      if (last && last !== getThemeChoice()) changeTheme(last, origin);
      else notify();
    },
  );
  if (!started) {
    pouring = undefined;
    setThemeChoice(choice);
  }
}

export function subscribeTheme(listener: () => void) {
  const query = window.matchMedia(LIGHT_QUERY);
  listeners.add(listener);
  query.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    query.removeEventListener("change", listener);
  };
}
