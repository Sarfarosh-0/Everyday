import { cn } from "cn"
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { useTheme } from "@/components/theme/theme-context"
import type { Theme } from "@/components/theme/theme-storage"

const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <section
      aria-labelledby="appearance-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <h2
        id="appearance-title"
        className="font-heading text-base font-semibold"
      >
        Appearance
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a theme, or match your device setting.
      </p>

      <div
        role="group"
        aria-label="Theme"
        className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-muted p-1"
      >
        {THEME_OPTIONS.map((option) => {
          const selected = theme === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "flex min-h-10 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setTheme(option.value)}
            >
              <option.icon className="size-4" aria-hidden />
              {option.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
