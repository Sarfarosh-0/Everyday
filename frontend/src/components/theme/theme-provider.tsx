import { useEffect, useState, type ReactNode } from "react"
import { ThemeContext } from "./theme-context"
import {
  applyTheme,
  getStoredTheme,
  storeTheme,
  type Theme,
} from "./theme-storage"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
    storeTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
