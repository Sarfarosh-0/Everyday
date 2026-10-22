export const THEME_STORAGE_KEY = "everyday-theme"

const LEGACY_THEME_STORAGE_KEY = "fitency-theme"

export type Theme = "light" | "dark"

function readStoredTheme(): string | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored !== null) return stored

    const legacy = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
    if (legacy !== null) {
      // One-time move from the pre-rename key.
      window.localStorage.setItem(THEME_STORAGE_KEY, legacy)
      return legacy
    }
  } catch {
    // localStorage may be unavailable (private mode, blocked storage)
  }
  return null
}

export function getStoredTheme(): Theme {
  const stored = readStoredTheme()
  if (stored === "light" || stored === "dark") return stored

  if (stored === "system") {
    // One-time migration for the removed "system" option.
    const migrated: Theme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light"
    storeTheme(migrated)
    return migrated
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
