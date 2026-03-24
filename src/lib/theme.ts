export type Theme = "light" | "dark";

const THEME_KEY = "intelliapply-theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as Theme) ?? "light";
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function toggleTheme(): Theme {
  const next = getTheme() === "light" ? "dark" : "light";
  setTheme(next);
  return next;
}
