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
  listeners.forEach((listener) => listener());
}

// The gold sweep is for a visitor's own choice; device changes in System mode stay instant.
export function changeTheme(choice: ThemeChoice) {
  const before = getResolvedTheme();
  const instant =
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (instant) {
    setThemeChoice(choice);
    return;
  }

  // Two sweeps cannot share a transition name, so a quick second click replaces the first.
  document.querySelector(".theme-sweep")?.remove();
  const sweep = document.createElement("div");
  sweep.className = "theme-sweep";

  const transition = document.startViewTransition(() => {
    setThemeChoice(choice);
    if (getResolvedTheme() !== before) document.body.append(sweep);
  });
  transition.finished.finally(() => sweep.remove());
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
