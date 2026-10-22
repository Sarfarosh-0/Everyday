export const THEME_STORAGE_KEY = "fitency-theme"

export type Theme = "light" | "dark"

export function getStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored

    if (stored === "system") {
      // One-time migration for the removed "system" option.
      const migrated: Theme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      window.localStorage.setItem(THEME_STORAGE_KEY, migrated)
      return migrated
    }
  } catch {
    // localStorage may be unavailable (private mode, blocked storage)
  }
  return "light"
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Persisting the choice is best-effort; the app still works without it
  }
}
