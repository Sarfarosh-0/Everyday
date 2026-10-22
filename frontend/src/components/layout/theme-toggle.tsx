import { cn } from "cn"
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { useTheme } from "@/components/theme/theme-context"
import type { Theme } from "@/components/theme/theme-storage"

const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-full bg-muted p-0.5"
    >
      {THEME_OPTIONS.map((option) => {
        const selected = theme === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
            className={cn(
              "flex size-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "bg-background text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTheme(option.value)}
          >
            <option.icon className="size-4" aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
