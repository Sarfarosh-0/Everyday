export type WeekdayOption = {
  value: number
  label: string
  short: string
}

export const WEEKDAY_OPTIONS: WeekdayOption[] = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
  { value: 7, label: "Sunday", short: "Sun" },
]

export const EVERY_DAY: number[] = [1, 2, 3, 4, 5, 6, 7]

export const WEEKDAYS: number[] = [1, 2, 3, 4, 5]

/** Chip labels for a habit: "Every day" when all seven days are picked. */
export function weekdayChips(weekdays: number[]): string[] {
  if (weekdays.length === 0) return ["No days"]
  if (weekdays.length === EVERY_DAY.length) return ["Every day"]

  return WEEKDAY_OPTIONS.filter((option) =>
    weekdays.includes(option.value),
  ).map((option) => option.short)
}
