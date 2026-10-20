import { addDays } from "date-fns"
import type { Completion, Habit } from "@/lib/types"
import { getWeekdayNumber, parseDateKey, toDateKey } from "@/lib/utils/date"

export type CompletionStats = {
  completed: number
  scheduled: number
  /** `null` when nothing was scheduled, so the UI can show a dash. */
  percent: number | null
}

export function habitCreatedAtKey(habit: Habit): string {
  return toDateKey(new Date(habit.createdAt))
}

export function isScheduled(habit: Habit, dateKey: string): boolean {
  return (
    dateKey >= habitCreatedAtKey(habit) &&
    habit.weekdays.includes(getWeekdayNumber(parseDateKey(dateKey)))
  )
}

export function getScheduledHabits(habits: Habit[], dateKey: string): Habit[] {
  return habits.filter((habit) => isScheduled(habit, dateKey))
}

export function completionRate(
  habits: Habit[],
  completions: Completion[],
  days: string[],
): CompletionStats {
  const completedKeys = buildCompletionKeys(completions)
  let completed = 0
  let scheduled = 0

  for (const day of days) {
    for (const habit of habits) {
      if (!isScheduled(habit, day)) continue
      scheduled += 1
      if (completedKeys.has(`${habit.id}|${day}`)) completed += 1
    }
  }

  return { completed, scheduled, percent: toPercent(completed, scheduled) }
}

export function perDayCompletion(
  habits: Habit[],
  completions: Completion[],
  dateKey: string,
): CompletionStats {
  const completedKeys = buildCompletionKeys(completions)
  const scheduled = getScheduledHabits(habits, dateKey)
  const completed = scheduled.filter((habit) =>
    completedKeys.has(`${habit.id}|${dateKey}`),
  ).length

  return {
    completed,
    scheduled: scheduled.length,
    percent: toPercent(completed, scheduled.length),
  }
}

export function currentStreak(
  habits: Habit[],
  completions: Completion[],
  todayKey: string,
  fromKey?: string,
): number {
  const earliest = earliestHabitDateKey(habits)
  if (!earliest) return 0

  const stopKey = fromKey && fromKey > earliest ? fromKey : earliest
  const completedKeys = buildCompletionKeys(completions)
  let cursor = parseDateKey(todayKey)
  let streak = 0

  while (toDateKey(cursor) >= stopKey) {
    const key = toDateKey(cursor)
    const scheduled = getScheduledHabits(habits, key)

    if (scheduled.length > 0) {
      const allDone = scheduled.every((habit) =>
        completedKeys.has(`${habit.id}|${key}`),
      )
      if (allDone) {
        streak += 1
      } else if (key !== todayKey) {
        break
      }
    }

    cursor = addDays(cursor, -1)
  }

  return streak
}

export function bestStreak(
  habits: Habit[],
  completions: Completion[],
  todayKey: string,
  fromKey?: string,
): number {
  const earliest = earliestHabitDateKey(habits)
  if (!earliest) return 0

  const startKey = fromKey && fromKey > earliest ? fromKey : earliest
  if (startKey > todayKey) return 0

  const completedKeys = buildCompletionKeys(completions)
  let cursor = parseDateKey(startKey)
  let run = 0
  let best = 0

  while (toDateKey(cursor) <= todayKey) {
    const key = toDateKey(cursor)
    const scheduled = getScheduledHabits(habits, key)

    if (scheduled.length > 0) {
      const allDone = scheduled.every((habit) =>
        completedKeys.has(`${habit.id}|${key}`),
      )
      if (allDone) {
        run += 1
        best = Math.max(best, run)
      } else {
        run = 0
      }
    }

    cursor = addDays(cursor, 1)
  }

  return best
}

function earliestHabitDateKey(habits: Habit[]): string | null {
  if (habits.length === 0) return null

  return habits.reduce((earliest, habit) => {
    const key = habitCreatedAtKey(habit)
    return key < earliest ? key : earliest
  }, habitCreatedAtKey(habits[0]))
}

function buildCompletionKeys(completions: Completion[]): Set<string> {
  return new Set(
    completions.map((completion) => `${completion.habitId}|${completion.date}`),
  )
}

function toPercent(completed: number, scheduled: number): number | null {
  if (scheduled === 0) return null
  return Math.round((completed / scheduled) * 100)
}
