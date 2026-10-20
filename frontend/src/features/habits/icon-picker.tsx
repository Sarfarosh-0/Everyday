import { useId } from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { HABIT_ICONS } from "@/features/habits/habit-icons"

type IconPickerProps = {
  value: string
  onChange: (icon: string) => void
  label?: string
  error?: string
}

export function IconPicker({
  value,
  onChange,
  label = "Icon",
  error,
}: IconPickerProps) {
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
        className="flex flex-wrap gap-2"
      >
        {HABIT_ICONS.map((option) => {
          const Icon = option.icon
          const selected = option.key === value

          return (
            <Button
              key={option.key}
              type="button"
              variant="outline"
              size="icon"
              aria-label={option.label}
              aria-pressed={selected}
              className={cn(
                "rounded-full",
                selected && "border-primary bg-primary/10 text-primary",
              )}
              onClick={() => onChange(option.key)}
            >
              <Icon aria-hidden />
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
