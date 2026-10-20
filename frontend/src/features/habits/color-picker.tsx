import { useId } from "react"
import { Check } from "lucide-react"
import { cn } from "cn"
import { HABIT_COLORS, readableTextColor } from "@/features/habits/habit-colors"

type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
  label?: string
  error?: string
}

export function ColorPicker({
  value,
  onChange,
  label = "Color",
  error,
}: ColorPickerProps) {
  const labelId = useId()
  const errorId = useId()

  return (
    <div className="space-y-2">
      <span id={labelId} className="text-sm font-medium">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className="flex flex-wrap gap-3"
      >
        {HABIT_COLORS.map((option) => {
          const selected = option.value === value

          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={selected}
              className={cn(
                "flex size-10 items-center justify-center rounded-full transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected && "ring-2 ring-foreground/50 ring-offset-2",
              )}
              style={{
                backgroundColor: option.value,
                color: readableTextColor(option.value),
              }}
              onClick={() => onChange(option.value)}
            >
              {selected ? <Check className="size-4" aria-hidden /> : null}
            </button>
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
