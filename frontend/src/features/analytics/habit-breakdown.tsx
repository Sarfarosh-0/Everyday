import { Dumbbell } from "lucide-react"
import {
  getHabitColor,
  readableTextColor,
} from "@/features/habits/habit-colors"
import { HABIT_ICONS } from "@/features/habits/habit-icons"
import type { Completion, Habit } from "@/lib/types"
import { completionRate } from "@/lib/utils/habits"

type HabitBreakdownProps = {
  days: string[]
  habits: Habit[]
  completions: Completion[]
}

export function HabitBreakdown({
  days,
  habits,
  completions,
}: HabitBreakdownProps) {
  return (
    <section
      aria-labelledby="breakdown-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <h2 id="breakdown-title" className="font-heading text-base font-semibold">
        Habit breakdown
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Completion rate for each habit in the selected range.
      </p>

      {habits.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No habits yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {habits.map((habit) => (
            <HabitBreakdownRow
              key={habit.id}
              habit={habit}
              days={days}
              completions={completions}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function HabitBreakdownRow({
  habit,
  days,
  completions,
}: {
  habit: Habit
  days: string[]
  completions: Completion[]
}) {
  const stats = completionRate([habit], completions, days)
  const iconOption = HABIT_ICONS.find((option) => option.key === habit.icon)
  const Icon = iconOption?.icon ?? Dumbbell
  const color = getHabitColor(habit.color)

  return (
    <li>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color, color: readableTextColor(color) }}
        >
          <Icon className="size-4" />
        </span>
        <span
          className="min-w-0 flex-1 truncate font-medium"
          title={habit.name}
        >
          {habit.name}
        </span>
        <span className="shrink-0 font-heading text-sm font-semibold tabular-nums">
          {stats.percent === null ? "—" : `${stats.percent}%`}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3 pl-11">
        <div
          aria-hidden
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.percent ?? 0}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="w-24 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
          {stats.scheduled === 0
            ? "No scheduled days"
            : `${stats.completed} of ${stats.scheduled}`}
        </span>
      </div>
    </li>
  )
}
