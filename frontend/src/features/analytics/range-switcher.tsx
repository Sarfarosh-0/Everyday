import { cn } from "cn"

export type AnalyticsRange = "week" | "month" | "year"

type RangeSwitcherProps = {
  range: AnalyticsRange
  onRangeChange: (range: AnalyticsRange) => void
}

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
]

export function RangeSwitcher({ range, onRangeChange }: RangeSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Analytics range"
      className="flex w-full gap-1 rounded-full bg-muted p-1 sm:w-fit"
    >
      {RANGES.map((option) => {
        const selected = range === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            className={cn(
              "flex min-h-10 flex-1 items-center justify-center rounded-full px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-none",
              selected
                ? "bg-background text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onRangeChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
