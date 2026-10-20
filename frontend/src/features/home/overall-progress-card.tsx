import { cn } from "cn"
import type { CompletionStats } from "@/lib/utils/habits"

export type OverallRange = "week" | "month" | "all"

type OverallProgressCardProps = {
  stats: CompletionStats
  range: OverallRange
  onRangeChange: (range: OverallRange) => void
}

const RANGES: { value: OverallRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "all", label: "All" },
]

export function OverallProgressCard({
  stats,
  range,
  onRangeChange,
}: OverallProgressCardProps) {
  const completedPercent = stats.percent ?? 0
  const leftPercent = stats.percent === null ? 0 : 100 - completedPercent

  return (
    <section
      aria-labelledby="overall-progress-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="overall-progress-title"
          className="font-heading text-base font-semibold"
        >
          Overall progress
        </h2>
        <div
          role="group"
          aria-label="Overall progress range"
          className="flex gap-1 rounded-full bg-muted p-1"
        >
          {RANGES.map((option) => {
            const selected = range === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                className={cn(
                  "flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
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
      </div>

      {stats.percent === null ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Nothing scheduled in this period.
        </p>
      ) : (
        <>
          <div
            role="img"
            aria-label={`${completedPercent}% completed, ${leftPercent}% left`}
            className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className="bg-success"
              style={{ width: `${completedPercent}%` }}
            />
            <div
              className="bg-muted-foreground/30"
              style={{ width: `${leftPercent}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm">
            <span className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-full bg-success" />
              {completedPercent}% completed
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden
                className="size-2.5 rounded-full bg-muted-foreground/30"
              />
              {leftPercent}% left
            </span>
          </div>
        </>
      )}
    </section>
  )
}
