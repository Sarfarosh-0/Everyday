import { cn } from "cn"
import { format } from "date-fns"
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import type { AnalyticsRange } from "@/features/analytics/range-switcher"
import type { Completion, Habit } from "@/lib/types"
import { getWeekdayNumberFromKey, parseDateKey } from "@/lib/utils/date"
import { perDayCompletion, type CompletionStats } from "@/lib/utils/habits"

type HeatmapProps = {
  range: AnalyticsRange
  days: string[]
  todayKey: string
  habits: Habit[]
  completions: Completion[]
  onSelectDay: (date: string) => void
}

type HeatmapDay = {
  date: string
  stats: CompletionStats
  isFuture: boolean
  interactive: boolean
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const CONTRIBUTION_WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"]

const KEY_DELTAS = {
  calendar: { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 },
  contribution: { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 },
}

type HeatmapOrientation = keyof typeof KEY_DELTAS

/**
 * Keeps one cell in the tab order and moves between days with the arrow keys.
 * Without this, a year view adds 365 tab stops.
 */
function useRovingFocus(days: HeatmapDay[], orientation: HeatmapOrientation) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeDate, setActiveDate] = useState<string | null>(null)

  const defaultDate = useMemo(() => {
    for (let index = days.length - 1; index >= 0; index -= 1) {
      if (days[index].interactive) return days[index].date
    }
    return null
  }, [days])

  const currentDate = activeDate ?? defaultDate

  function focusDate(date: string | undefined) {
    if (!date) return
    setActiveDate(date)
    containerRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)
      ?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!currentDate) return

    if (event.key === "Home" || event.key === "End") {
      const ordered = event.key === "Home" ? days : [...days].reverse()
      const target = ordered.find((day) => day.interactive)
      if (target) {
        event.preventDefault()
        focusDate(target.date)
      }
      return
    }

    const delta = KEY_DELTAS[orientation][
      event.key as keyof (typeof KEY_DELTAS)[HeatmapOrientation]
    ]
    if (!delta) return

    const index = days.findIndex((day) => day.date === currentDate)
    if (index < 0) return

    const step = Math.sign(delta)
    for (
      let next = index + delta;
      next >= 0 && next < days.length;
      next += step
    ) {
      if (days[next].interactive) {
        event.preventDefault()
        focusDate(days[next].date)
        return
      }
    }
  }

  return { containerRef, currentDate, setActiveDate, onKeyDown }
}

export function Heatmap({
  range,
  days,
  todayKey,
  habits,
  completions,
  onSelectDay,
}: HeatmapProps) {
  const heatmapDays: HeatmapDay[] = days.map((date) => {
    const stats = perDayCompletion(habits, completions, date)
    const isFuture = date > todayKey

    return {
      date,
      stats,
      isFuture,
      interactive: !isFuture && stats.scheduled > 0,
    }
  })

  return (
    <section
      aria-labelledby="heatmap-title"
      className="rounded-xl border border-border/60 bg-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="heatmap-title" className="font-heading text-base font-semibold">
          Consistency
        </h2>
        <p className="text-xs text-muted-foreground">
          Select a day for details.
        </p>
      </div>

      <div className="mt-4">
        {range === "year" ? (
          <ContributionHeatmap days={heatmapDays} onSelectDay={onSelectDay} />
        ) : (
          <CalendarHeatmap days={heatmapDays} onSelectDay={onSelectDay} />
        )}
      </div>

      <div
        aria-hidden
        className="mt-4 flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5 text-[0.65rem] text-muted-foreground"
      >
        <span className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded-[3px]", levelClass("none"))} />
          No habits
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("size-3 rounded-[3px]", levelClass("zero"))} />
          0%
        </span>
        <span className="flex items-center gap-1.5">
          <span>Less</span>
          <span className={cn("size-3 rounded-[3px]", levelClass("some"))} />
          <span className={cn("size-3 rounded-[3px]", levelClass("high"))} />
          <span className={cn("size-3 rounded-[3px]", levelClass("full"))} />
          <span>More</span>
        </span>
      </div>
    </section>
  )
}

function CalendarHeatmap({
  days,
  onSelectDay,
}: {
  days: HeatmapDay[]
  onSelectDay: (date: string) => void
}) {
  const leadingBlanks =
    days.length > 0 ? getWeekdayNumberFromKey(days[0].date) - 1 : 0
  const { containerRef, currentDate, setActiveDate, onKeyDown } =
    useRovingFocus(days, "calendar")

  return (
    <div className="mx-auto max-w-md">
      <div
        className="-mx-2 grid grid-cols-7 gap-1 sm:mx-0"
        aria-hidden
      >
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="text-center text-[0.65rem] font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
      <div
        ref={containerRef}
        role="group"
        aria-label="Monthly completion calendar. Use the arrow keys to move between days."
        onKeyDown={onKeyDown}
        className="mt-1.5 -mx-2 grid grid-cols-7 gap-1 sm:mx-0"
      >
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden />
        ))}
        {days.map((day) => (
          <HeatmapCell
            key={day.date}
            day={day}
            onSelectDay={onSelectDay}
            tabIndex={day.date === currentDate ? 0 : -1}
            onFocus={() => setActiveDate(day.date)}
            className="flex aspect-square w-full items-center justify-center rounded-lg text-xs font-medium"
          />
        ))}
      </div>
    </div>
  )
}

function ContributionHeatmap({
  days,
  onSelectDay,
}: {
  days: HeatmapDay[]
  onSelectDay: (date: string) => void
}) {
  const leadingBlanks =
    days.length > 0 ? getWeekdayNumberFromKey(days[0].date) - 1 : 0
  const cells: (HeatmapDay | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...days,
  ]
  const weeks = chunk(cells, 7)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { containerRef, currentDate, setActiveDate, onKeyDown } =
    useRovingFocus(days, "contribution")

  // The current year's activity sits at the right edge; show it first.
  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollLeft = scroller.scrollWidth
  }, [])

  const monthLabels = weeks.map((week, index) => {
    const first = week.find((cell): cell is HeatmapDay => cell !== null)
    const previous = weeks[index - 1]?.find(
      (cell): cell is HeatmapDay => cell !== null,
    )

    if (!first) return ""
    if (previous && previous.date.slice(0, 7) === first.date.slice(0, 7)) {
      return ""
    }

    return format(parseDateKey(first.date), "MMM")
  })

  return (
    <div ref={scrollerRef} className="overflow-x-auto pb-1">
      <div className="w-max">
        <div
          aria-hidden
          className="ml-8 grid h-3 gap-1"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, 0.75rem)`,
          }}
        >
          {monthLabels.map((label, index) => (
            <span
              key={`month-${index}`}
              className="whitespace-nowrap text-[0.6rem] leading-none text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-1.5 flex gap-1">
          <div aria-hidden className="grid w-7 grid-rows-7 gap-1">
            {CONTRIBUTION_WEEKDAYS.map((label, index) => (
              <span
                key={`weekday-${index}`}
                className="flex items-center text-[0.6rem] leading-none text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          <div
            ref={containerRef}
            role="group"
            aria-label="Daily completion heatmap. Use the arrow keys to move between days."
            onKeyDown={onKeyDown}
            className="grid grid-flow-col grid-rows-7 gap-1"
          >
            {cells.map((day, index) =>
              day ? (
                <HeatmapCell
                  key={day.date}
                  day={day}
                  onSelectDay={onSelectDay}
                  tabIndex={day.date === currentDate ? 0 : -1}
                  onFocus={() => setActiveDate(day.date)}
                  dense
                  className="flex size-5 items-center justify-center rounded-[3px] sm:size-3"
                />
              ) : (
                <span key={`blank-${index}`} aria-hidden />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeatmapCell({
  day,
  onSelectDay,
  tabIndex,
  onFocus,
  dense = false,
  className,
}: {
  day: HeatmapDay
  onSelectDay: (date: string) => void
  tabIndex: number
  onFocus: () => void
  dense?: boolean
  className?: string
}) {
  const dateLabel = format(parseDateKey(day.date), "EEEE, d MMMM yyyy")
  const label = day.isFuture
    ? `${dateLabel}: upcoming day`
    : day.stats.scheduled === 0
      ? `${dateLabel}: no habits scheduled`
      : `${dateLabel}: ${day.stats.completed} of ${day.stats.scheduled} habits completed (${day.stats.percent}%)`

  return (
    <button
      type="button"
      disabled={!day.interactive}
      tabIndex={day.interactive ? tabIndex : -1}
      data-date={day.date}
      aria-label={label}
      title={label}
      onFocus={onFocus}
      onClick={() => onSelectDay(day.date)}
      className={cn(
        "outline-none focus-visible:ring-3 focus-visible:ring-ring",
        day.interactive
          ? "cursor-pointer hover:ring-2 hover:ring-foreground/25"
          : "cursor-default",
        levelClass(levelFor(day)),
        className,
      )}
    >
      {dense ? null : <span aria-hidden>{Number(day.date.slice(8, 10))}</span>}
    </button>
  )
}

function levelFor(day: HeatmapDay): Level {
  if (day.isFuture) return "future"
  if (day.stats.scheduled === 0) return "none"
  if (day.stats.percent === 0) return "zero"
  if (day.stats.percent === 100) return "full"
  if ((day.stats.percent ?? 0) >= 50) return "high"
  return "some"
}

type Level = "future" | "none" | "zero" | "some" | "high" | "full"

const LEVEL_CLASSES: Record<Level, string> = {
  future: "bg-muted/40 text-muted-foreground/40",
  none: "bg-muted text-muted-foreground",
  zero: "bg-success/10 text-foreground inset-ring-1 inset-ring-success/60",
  some: "bg-success/25 text-foreground",
  high: "bg-success/45 text-foreground",
  full: "bg-success text-success-foreground",
}

function levelClass(level: Level): string {
  return LEVEL_CLASSES[level]
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }
  return result
}
