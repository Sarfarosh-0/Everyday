import { CalendarCheck, ChartColumn, Flame, Target, Trophy } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DayDetailSheet } from "@/features/analytics/day-detail-sheet"
import { HabitBreakdown } from "@/features/analytics/habit-breakdown"
import { Heatmap } from "@/features/analytics/heatmap"
import {
  RangeSwitcher,
  type AnalyticsRange,
} from "@/features/analytics/range-switcher"
import { StatCard } from "@/features/analytics/stat-card"
import { TrendChart } from "@/features/analytics/trend-chart"
import { buildRange, toDateKey } from "@/lib/utils/date"
import {
  bestStreak,
  completionRate,
  currentStreak,
  habitCreatedAtKey,
} from "@/lib/utils/habits"
import { useCompletionsStore } from "@/store/completions-store"
import { useHabitsStore } from "@/store/habits-store"

export function AnalyticsPage() {
  const habits = useHabitsStore((state) => state.habits)
  const habitsLoading = useHabitsStore((state) => state.loading)
  const habitsError = useHabitsStore((state) => state.error)
  const loadHabits = useHabitsStore((state) => state.loadHabits)
  const completions = useCompletionsStore((state) => state.completions)
  const completionsLoading = useCompletionsStore((state) => state.loading)
  const completionsError = useCompletionsStore((state) => state.error)
  const loadCompletions = useCompletionsStore((state) => state.loadCompletions)

  const [range, setRange] = useState<AnalyticsRange>("month")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const dayTriggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    void loadHabits()
    void loadCompletions()
  }, [loadHabits, loadCompletions])

  function openDayDetail(date: string) {
    dayTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setSelectedDate(date)
  }

  // Radix only restores focus to a DialogTrigger; remember the heatmap cell.
  function restoreDayTrigger(event: Event) {
    event.preventDefault()
    if (dayTriggerRef.current?.isConnected) dayTriggerRef.current.focus()
  }

  const now = new Date()
  const todayKey = toDateKey(now)
  const earliestKey =
    habits.length > 0 ? habits.map(habitCreatedAtKey).sort()[0] : todayKey
  const dateRange = buildRange(range, now, earliestKey)
  const stats = completionRate(habits, completions, dateRange.elapsedDays)
  const current = currentStreak(
    habits,
    completions,
    todayKey,
    dateRange.startKey,
  )
  const best = bestStreak(habits, completions, todayKey, dateRange.startKey)
  const loading = habitsLoading || completionsLoading
  const error = habitsError ?? completionsError
  const empty = habits.length === 0 || completions.length === 0

  function retry() {
    void loadHabits()
    void loadCompletions()
  }

  return (
    <>
      <PageHeader title="Analytics" description="Your progress over time." />

      {loading ? (
        <div
          className="space-y-6"
          aria-busy="true"
          aria-label="Loading your analytics"
        >
          <Skeleton className="h-10 w-full rounded-full sm:w-64" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[104px] rounded-xl" />
            <Skeleton className="h-[104px] rounded-xl" />
            <Skeleton className="h-[104px] rounded-xl" />
            <Skeleton className="h-[104px] rounded-xl" />
          </div>
          <Skeleton className="h-[360px] rounded-xl" />
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : empty ? (
        <EmptyState
          icon={ChartColumn}
          title="Complete a few habits to see your analytics"
          description="Check off habits on Home and your progress will show up here."
          action={
            <Button asChild variant="outline">
              <Link to="/">Go to Home</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <RangeSwitcher range={range} onRangeChange={setRange} />

          <section aria-labelledby="analytics-summary-title">
            <h2 id="analytics-summary-title" className="sr-only">
              Summary
            </h2>
            <dl className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Target}
                label="Completion rate"
                value={stats.percent === null ? "—" : `${stats.percent}%`}
                detail={
                  stats.scheduled === 0
                    ? "Nothing scheduled"
                    : `${stats.completed} of ${stats.scheduled} check-ins`
                }
              />
              <StatCard
                icon={Flame}
                label="Current streak"
                value={`${current} ${current === 1 ? "day" : "days"}`}
              />
              <StatCard
                icon={Trophy}
                label="Best streak"
                value={`${best} ${best === 1 ? "day" : "days"}`}
              />
              <StatCard
                icon={CalendarCheck}
                label="Total check-ins"
                value={String(stats.completed)}
                detail={
                  stats.scheduled === 0
                    ? "Nothing scheduled"
                    : `${stats.scheduled} scheduled`
                }
              />
            </dl>
          </section>

          <Heatmap
            range={range}
            days={dateRange.days}
            todayKey={todayKey}
            habits={habits}
            completions={completions}
            onSelectDay={openDayDetail}
          />

          <TrendChart
            range={range}
            days={dateRange.elapsedDays}
            habits={habits}
            completions={completions}
          />

          <HabitBreakdown
            days={dateRange.elapsedDays}
            habits={habits}
            completions={completions}
          />
        </div>
      )}

      <DayDetailSheet
        date={selectedDate}
        habits={habits}
        completions={completions}
        onClose={() => setSelectedDate(null)}
        onCloseAutoFocus={restoreDayTrigger}
      />
    </>
  )
}
