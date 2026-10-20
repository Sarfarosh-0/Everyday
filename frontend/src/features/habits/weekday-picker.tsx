import { useId } from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  EVERY_DAY,
  WEEKDAYS,
  WEEKDAY_OPTIONS,
} from "@/features/habits/weekdays"

type WeekdayPickerProps = {
  value: number[]
  onChange: (weekdays: number[]) => void
  label?: string
  error?: string
}

export function WeekdayPicker({
  value,
  onChange,
  label = "Days",
  error,
}: WeekdayPickerProps) {
  const labelId = useId()
  const errorId = useId()

  function toggle(day: number) {
    const next = value.includes(day)
      ? value.filter((selected) => selected !== day)
      : [...value, day].sort((first, second) => first - second)

    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span id={labelId} className="text-sm font-medium">
          {label}
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-10"
            onClick={() => onChange([...EVERY_DAY])}
          >
            Every day
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-10"
            onClick={() => onChange([...WEEKDAYS])}
          >
            Weekdays
          </Button>
        </div>
      </div>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className="grid grid-cols-7 gap-1.5"
      >
        {WEEKDAY_OPTIONS.map((option) => {
          const selected = value.includes(option.value)

          return (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              size="default"
              aria-label={option.label}
              aria-pressed={selected}
              className={cn(
                "px-0",
                selected && "border-primary bg-primary/10 text-primary",
              )}
              onClick={() => toggle(option.value)}
            >
              {option.short}
            </Button>
          )
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
