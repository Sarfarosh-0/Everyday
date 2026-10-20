import { CalendarX, ListChecks, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GreetingHeader } from "@/features/home/greeting-header"
import { HabitItem } from "@/features/home/habit-item"
import {
  OverallProgressCard,
  type OverallRange,
} from "@/features/home/overall-progress-card"
import { StreakBadge } from "@/features/home/streak-badge"
import { TodayProgressCard } from "@/features/home/today-progress-card"
import { buildRange, toDateKey } from "@/lib/utils/date"
import {
  completionRate,
  currentStreak,
  getScheduledHabits,
  habitCreatedAtKey,
  perDayCompletion,
} from "@/lib/utils/habits"
import { useAuthStore } from "@/store/auth-store"
import { useCompletionsStore } from "@/store/completions-store"
import { useHabitsStore } from "@/store/habits-store"

export function HomePage() {
  const user = useAuthStore((state) => state.user)
  const habits = useHabitsStore((state) => state.habits)
  const habitsLoading = useHabitsStore((state) => state.loading)
  const habitsError = useHabitsStore((state) => state.error)
  const loadHabits = useHabitsStore((state) => state.loadHabits)
  const completions = useCompletionsStore((state) => state.completions)
  const completionsLoading = useCompletionsStore((state) => state.loading)
  const completionsError = useCompletionsStore((state) => state.error)
  const loadCompletions = useCompletionsStore((state) => state.loadCompletions)
  const toggleCompletion = useCompletionsStore(
    (state) => state.toggleCompletion,
  )

  const [range, setRange] = useState<OverallRange>("week")
  const [focusHabitId, setFocusHabitId] = useState<string | null>(null)

  useEffect(() => {
    void loadHabits()
    void loadCompletions()
  }, [loadHabits, loadCompletions])

  const today = new Date()
  const todayKey = toDateKey(today)
  const scheduledToday = getScheduledHabits(habits, todayKey)
  const completedToday = new Set(
    completions
      .filter((completion) => completion.date === todayKey)
      .map((completion) => completion.habitId),
  )
  const pending = scheduledToday.filter(
    (habit) => !completedToday.has(habit.id),
  )
  const completed = scheduledToday.filter((habit) =>
    completedToday.has(habit.id),
  )
  const todayStats = perDayCompletion(habits, completions, todayKey)
  const streak = currentStreak(habits, completions, todayKey)
  const earliestKey =
    habits.length > 0 ? habits.map(habitCreatedAtKey).sort()[0] : todayKey
  const overallStats = completionRate(
    habits,
    completions,
    buildRange(range, today, earliestKey).elapsedDays,
  )
  const loading = habitsLoading || completionsLoading
  const error = habitsError ?? completionsError

  function retry() {
    void loadHabits()
    void loadCompletions()
  }

  function toggleHabit(habitId: string) {
    setFocusHabitId(habitId)
    void toggleCompletion(habitId, todayKey)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <GreetingHeader user={user} />

      {loading ? (
        <div
          className="space-y-6"
          aria-busy="true"
          aria-label="Loading your dashboard"
        >
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
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
      ) : habits.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No habits yet"
          description="Create your first habit to start tracking your days."
          action={
            <Button asChild>
              <Link to="/habits">
                <Plus aria-hidden />
                Add your first habit
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          {scheduledToday.length > 0 ? (
            <TodayProgressCard stats={todayStats} />
          ) : null}

          <StreakBadge streak={streak} />

          {scheduledToday.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="Nothing scheduled today"
              description="Enjoy the rest day."
            />
          ) : (
            <>
              {pending.length === 0 ? (
                <p className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
                  All done for today — nice work.
                </p>
              ) : (
                <section aria-labelledby="pending-title" className="space-y-3">
                  <h2
                    id="pending-title"
                    className="font-heading text-base font-semibold"
                  >
                    Pending
                  </h2>
                  <ul className="space-y-3">
                    {pending.map((habit) => (
                      <li key={habit.id}>
                        <HabitItem
                          habit={habit}
                          completed={false}
                          autoFocus={habit.id === focusHabitId}
                          onToggle={() => toggleHabit(habit.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {completed.length > 0 ? (
                <section
                  aria-labelledby="completed-title"
                  className="space-y-3"
                >
                  <h2
                    id="completed-title"
                    className="font-heading text-base font-semibold"
                  >
                    Completed
                  </h2>
                  <ul className="space-y-3">
                    {completed.map((habit) => (
                      <li key={habit.id}>
                        <HabitItem
                          habit={habit}
                          completed
                          autoFocus={habit.id === focusHabitId}
                          onToggle={() => toggleHabit(habit.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}

          <OverallProgressCard
            stats={overallStats}
            range={range}
            onRangeChange={setRange}
          />
        </>
      )}
    </div>
  )
}
