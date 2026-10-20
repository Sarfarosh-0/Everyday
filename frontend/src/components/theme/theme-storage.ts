export const THEME_STORAGE_KEY = "fitency-theme"

export type Theme = "light" | "dark" | "system"

export function getStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
  } catch {
    // localStorage may be unavailable (private mode, blocked storage)
  }
  return "system"
}

export function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function resolveIsDark(theme: Theme): boolean {
  if (theme === "system") return getSystemPrefersDark()
  return theme === "dark"
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", resolveIsDark(theme))
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Persisting the choice is best-effort; the app still works without it
  }
}
