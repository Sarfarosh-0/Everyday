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

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
