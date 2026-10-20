import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"

export type RangeKind = "week" | "month" | "year" | "all"

export type DateRange = {
  kind: RangeKind
  startKey: string
  endKey: string
  /** Every day in the period, including future days. */
  days: string[]
  /** Days up to and including today; use this for stats. */
  elapsedDays: string[]
}

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Local calendar date as `YYYY-MM-DD`. */
export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/** Parse `YYYY-MM-DD` in the local timezone (never UTC). */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function isDateKey(value: string): boolean {
  if (!DATE_KEY_PATTERN.test(value)) return false
  const date = parseDateKey(value)
  return !Number.isNaN(date.getTime()) && toDateKey(date) === value
}

/** Weekday with Monday = 1 through Sunday = 7. */
export function getWeekdayNumber(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

export function getWeekdayNumberFromKey(key: string): number {
  return getWeekdayNumber(parseDateKey(key))
}

export function buildRange(
  kind: RangeKind,
  today: Date = new Date(),
  allStartKey?: string,
): DateRange {
  const todayKey = toDateKey(today)
  let start: Date
  let end: Date

  switch (kind) {
    case "week":
      start = startOfWeek(today, { weekStartsOn: 1 })
      end = endOfWeek(today, { weekStartsOn: 1 })
      break
    case "month":
      start = startOfMonth(today)
      end = endOfMonth(today)
      break
    case "year":
      start = startOfYear(today)
      end = endOfYear(today)
      break
    case "all":
      start = parseDateKey(
        allStartKey && allStartKey <= todayKey ? allStartKey : todayKey,
      )
      end = startOfDay(today)
      break
  }

  const days = eachDayOfInterval({ start, end }).map(toDateKey)

  return {
    kind,
    startKey: days[0],
    endKey: days[days.length - 1],
    days,
    elapsedDays: days.filter((day) => day <= todayKey),
  }
}
