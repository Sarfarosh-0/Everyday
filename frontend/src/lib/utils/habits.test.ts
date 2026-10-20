import { describe, expect, it } from "vitest"
import type { Completion, Habit } from "@/lib/types"
import {
  buildRange,
  getWeekdayNumber,
  isDateKey,
  parseDateKey,
  toDateKey,
} from "@/lib/utils/date"
import {
  bestStreak,
  completionRate,
  currentStreak,
  isScheduled,
  perDayCompletion,
} from "@/lib/utils/habits"

const TODAY = new Date(2026, 9, 20) // Tuesday, 20 October 2026
const TODAY_KEY = "2026-10-20"

function localIso(year: number, monthIndex: number, day: number): string {
  return new Date(year, monthIndex, day, 12).toISOString()
}

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    name: "Run",
    icon: "footprints",
    color: "orange",
    weekdays: [1, 2, 3, 4, 5, 6, 7],
    createdAt: localIso(2026, 9, 1),
    ...overrides,
  }
}

function done(habitId: string, date: string): Completion {
  return { habitId, date }
}

describe("date helpers", () => {
  it("formats the local date, not the UTC date", () => {
    expect(toDateKey(new Date(2026, 0, 1, 0, 30))).toBe("2026-01-01")
    expect(toDateKey(new Date(2026, 11, 31, 23, 30))).toBe("2026-12-31")
  })

  it("parses date keys as local midnight", () => {
    const date = parseDateKey("2026-10-20")
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(9)
    expect(date.getDate()).toBe(20)
    expect(date.getHours()).toBe(0)
  })

  it("rejects malformed and impossible date keys", () => {
    expect(isDateKey("2026-10-20")).toBe(true)
    expect(isDateKey("2026-02-31")).toBe(false)
    expect(isDateKey("20-10-2026")).toBe(false)
    expect(isDateKey("")).toBe(false)
  })

  it("numbers weekdays Monday = 1 through Sunday = 7", () => {
    expect(getWeekdayNumber(new Date(2026, 9, 19))).toBe(1)
    expect(getWeekdayNumber(new Date(2026, 9, 25))).toBe(7)
  })

  it("builds a Monday-first week and caps stats days at today", () => {
    const range = buildRange("week", TODAY)
    expect(range.startKey).toBe("2026-10-19")
    expect(range.endKey).toBe("2026-10-25")
    expect(range.days).toHaveLength(7)
    expect(range.elapsedDays).toEqual(["2026-10-19", "2026-10-20"])
  })

  it("builds month and year ranges with future days marked as not elapsed", () => {
    const month = buildRange("month", TODAY)
    expect(month.startKey).toBe("2026-10-01")
    expect(month.endKey).toBe("2026-10-31")
    expect(month.days).toHaveLength(31)
    expect(month.elapsedDays.at(-1)).toBe(TODAY_KEY)

    const year = buildRange("year", TODAY)
    expect(year.startKey).toBe("2026-01-01")
    expect(year.endKey).toBe("2026-12-31")
    expect(year.elapsedDays).toHaveLength(293)
  })

  it("builds an all-time range from the earliest habit date", () => {
    const range = buildRange("all", TODAY, "2026-10-10")
    expect(range.startKey).toBe("2026-10-10")
    expect(range.endKey).toBe(TODAY_KEY)
    expect(range.days).toHaveLength(11)
    expect(range.elapsedDays).toEqual(range.days)
  })
})

describe("isScheduled", () => {
  it("matches only chosen weekdays on or after the creation date", () => {
    const habit = makeHabit({
      weekdays: [1, 3],
      createdAt: localIso(2026, 9, 14),
    })

    expect(isScheduled(habit, "2026-10-19")).toBe(true) // Monday
    expect(isScheduled(habit, "2026-10-20")).toBe(false) // Tuesday
    expect(isScheduled(habit, "2026-10-21")).toBe(true) // Wednesday
    expect(isScheduled(habit, "2026-10-12")).toBe(false) // Monday, before creation
  })
})

describe("completionRate", () => {
  it("counts a habit only from its creation date", () => {
    const habit = makeHabit({
      weekdays: [1, 2, 3, 4, 5, 6, 7],
      createdAt: localIso(2026, 9, 14),
    })
    const days = [
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ]
    const completions = [
      done(habit.id, "2026-10-12"),
      done(habit.id, "2026-10-14"),
      done(habit.id, "2026-10-15"),
    ]

    expect(completionRate([habit], completions, days)).toEqual({
      completed: 2,
      scheduled: 5,
      percent: 40,
    })
  })

  it("filters by weekday", () => {
    const habit = makeHabit({ weekdays: [1, 3] })
    const days = [
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ]

    expect(
      completionRate([habit], [done(habit.id, "2026-10-12")], days),
    ).toEqual({ completed: 1, scheduled: 2, percent: 50 })
  })

  it("returns a dash state when nothing is scheduled or the range is empty", () => {
    const mondayOnly = makeHabit({ weekdays: [1] })

    expect(completionRate([mondayOnly], [], [])).toEqual({
      completed: 0,
      scheduled: 0,
      percent: null,
    })
    expect(completionRate([mondayOnly], [], ["2026-10-20"])).toEqual({
      completed: 0,
      scheduled: 0,
      percent: null,
    })
  })

  it("aggregates raw check-ins across habits rather than averaging days", () => {
    const daily = makeHabit({ id: "daily" })
    const monday = makeHabit({ id: "monday", weekdays: [1] })
    const days = ["2026-10-19", "2026-10-20"]
    const completions = [
      done("daily", "2026-10-19"),
      done("daily", "2026-10-20"),
      done("monday", "2026-10-19"),
    ]

    expect(completionRate([daily, monday], completions, days)).toEqual({
      completed: 3,
      scheduled: 3,
      percent: 100,
    })
  })
})

describe("perDayCompletion", () => {
  it("reports completed, scheduled, and percent for one day", () => {
    const first = makeHabit({ id: "first" })
    const second = makeHabit({ id: "second" })

    expect(perDayCompletion([first, second], [], TODAY_KEY)).toEqual({
      completed: 0,
      scheduled: 2,
      percent: 0,
    })
    expect(
      perDayCompletion([first, second], [done("first", TODAY_KEY)], TODAY_KEY),
    ).toEqual({ completed: 1, scheduled: 2, percent: 50 })
  })

  it("returns a dash state when no habit is scheduled that day", () => {
    const mondayOnly = makeHabit({ weekdays: [1] })
    expect(perDayCompletion([mondayOnly], [], TODAY_KEY)).toEqual({
      completed: 0,
      scheduled: 0,
      percent: null,
    })
  })
})

describe("currentStreak", () => {
  it("skips days with no scheduled habits", () => {
    const habit = makeHabit({ weekdays: [1, 3, 5] })
    const completions = [
      done(habit.id, "2026-10-14"),
      done(habit.id, "2026-10-16"),
      done(habit.id, "2026-10-19"),
    ]

    expect(currentStreak([habit], completions, TODAY_KEY)).toBe(3)
  })

  it("does not break on an unfinished today", () => {
    const habit = makeHabit()
    const completions = [
      done(habit.id, "2026-10-18"),
      done(habit.id, "2026-10-19"),
    ]

    expect(currentStreak([habit], completions, TODAY_KEY)).toBe(2)
  })

  it("does not break on a partially finished today", () => {
    const first = makeHabit({ id: "first" })
    const second = makeHabit({ id: "second" })
    const completions = [
      done("first", "2026-10-18"),
      done("second", "2026-10-18"),
      done("first", "2026-10-19"),
      done("second", "2026-10-19"),
      done("first", TODAY_KEY),
    ]

    expect(currentStreak([first, second], completions, TODAY_KEY)).toBe(2)
  })

  it("breaks on an incomplete past day", () => {
    const habit = makeHabit()
    const completions = [done(habit.id, "2026-10-18")]

    expect(currentStreak([habit], completions, TODAY_KEY)).toBe(0)
  })

  it("requires every habit scheduled that day to be complete", () => {
    const first = makeHabit({ id: "first" })
    const second = makeHabit({ id: "second" })
    const completions = [done("first", "2026-10-19")]

    expect(currentStreak([first, second], completions, TODAY_KEY)).toBe(0)
  })

  it("starts counting from the habit creation date", () => {
    const habit = makeHabit({ createdAt: localIso(2026, 9, 20) })

    expect(currentStreak([habit], [], TODAY_KEY)).toBe(0)
    expect(currentStreak([habit], [done(habit.id, TODAY_KEY)], TODAY_KEY)).toBe(
      1,
    )
  })

  it("returns zero without habits", () => {
    expect(currentStreak([], [], TODAY_KEY)).toBe(0)
  })
})

describe("bestStreak", () => {
  it("finds the longest run in history", () => {
    const habit = makeHabit()
    const completions = [
      done(habit.id, "2026-10-01"),
      done(habit.id, "2026-10-02"),
      done(habit.id, "2026-10-03"),
      done(habit.id, "2026-10-05"),
      done(habit.id, "2026-10-06"),
    ]

    expect(bestStreak([habit], completions, TODAY_KEY)).toBe(3)
  })

  it("skips unscheduled days without breaking the run", () => {
    const habit = makeHabit({ weekdays: [1, 3, 5] })
    const completions = [
      done(habit.id, "2026-10-12"),
      done(habit.id, "2026-10-14"),
      done(habit.id, "2026-10-16"),
    ]

    expect(bestStreak([habit], completions, TODAY_KEY)).toBe(3)
  })

  it("never counts days before the habit existed", () => {
    const habit = makeHabit({ createdAt: localIso(2026, 9, 14) })
    const completions = [
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
    ].map((date) => done(habit.id, date))

    expect(bestStreak([habit], completions, TODAY_KEY)).toBe(3)
  })

  it("returns zero without habits or completions", () => {
    expect(bestStreak([], [], TODAY_KEY)).toBe(0)
    expect(bestStreak([makeHabit()], [], TODAY_KEY)).toBe(0)
  })
})

describe("range-bounded streaks", () => {
  const habit = makeHabit()
  const completions = [
    "2026-10-14",
    "2026-10-15",
    "2026-10-16",
    "2026-10-17",
    "2026-10-18",
    "2026-10-19",
  ].map((date) => done(habit.id, date))

  it("counts the same run when no range start is given", () => {
    expect(currentStreak([habit], completions, TODAY_KEY)).toBe(6)
    expect(bestStreak([habit], completions, TODAY_KEY)).toBe(6)
  })

  it("cuts the run at the selected range start", () => {
    expect(currentStreak([habit], completions, TODAY_KEY, "2026-10-17")).toBe(3)
    expect(bestStreak([habit], completions, TODAY_KEY, "2026-10-17")).toBe(3)
    expect(currentStreak([habit], completions, TODAY_KEY, TODAY_KEY)).toBe(0)
  })
})

describe("analytics cross-check", () => {
  // Hand-calculated over Wed 14 Oct through Tue 20 Oct 2026.
  const daily = makeHabit({ id: "daily", name: "Daily" })
  const mwf = makeHabit({
    id: "mwf",
    name: "MWF",
    weekdays: [1, 3, 5],
  })
  const addedLate = makeHabit({
    id: "late",
    name: "Added late",
    createdAt: localIso(2026, 9, 16),
  })
  const habits = [daily, mwf, addedLate]
  const days = [
    "2026-10-14",
    "2026-10-15",
    "2026-10-16",
    "2026-10-17",
    "2026-10-18",
    "2026-10-19",
    "2026-10-20",
  ]
  const completions = [
    done("daily", "2026-10-14"),
    done("mwf", "2026-10-14"),
    done("daily", "2026-10-15"),
    done("daily", "2026-10-16"),
    done("late", "2026-10-16"),
    done("daily", "2026-10-17"),
    done("late", "2026-10-17"),
    done("daily", "2026-10-19"),
    done("mwf", "2026-10-19"),
    done("late", "2026-10-19"),
    done("daily", "2026-10-20"),
  ]

  it("matches the hand-calculated summary and per-day figures", () => {
    expect(completionRate(habits, completions, days)).toEqual({
      completed: 11,
      scheduled: 15,
      percent: 73,
    })
    expect(
      days.map((day) => perDayCompletion(habits, completions, day).percent),
    ).toEqual([100, 100, 67, 100, 0, 100, 50])
    expect(currentStreak(habits, completions, TODAY_KEY, days[0])).toBe(1)
    expect(bestStreak(habits, completions, TODAY_KEY, days[0])).toBe(2)
  })

  it("per-habit figures add up to the summary totals", () => {
    const perHabit = habits.map((habit) => ({
      id: habit.id,
      ...completionRate([habit], completions, days),
    }))

    expect(perHabit).toEqual([
      { id: "daily", completed: 6, scheduled: 7, percent: 86 },
      { id: "mwf", completed: 2, scheduled: 3, percent: 67 },
      { id: "late", completed: 3, scheduled: 5, percent: 60 },
    ])
    expect(perHabit.reduce((total, habit) => total + habit.completed, 0)).toBe(
      11,
    )
    expect(perHabit.reduce((total, habit) => total + habit.scheduled, 0)).toBe(
      15,
    )
  })

  it("returns zero when the selected range starts today and today is unfinished", () => {
    expect(currentStreak(habits, completions, TODAY_KEY, TODAY_KEY)).toBe(0)
    expect(bestStreak(habits, completions, TODAY_KEY, TODAY_KEY)).toBe(0)
  })
})
