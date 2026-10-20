import { Check } from "lucide-react"
import { Checkbox } from "radix-ui"
import type { Habit } from "@/lib/types"

type HabitItemProps = {
  habit: Habit
  completed: boolean
  autoFocus?: boolean
  onToggle: () => void
}

export function HabitItem({
  habit,
  completed,
  autoFocus,
  onToggle,
}: HabitItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
      <Checkbox.Root
        checked={completed}
        autoFocus={autoFocus}
        onCheckedChange={() => onToggle()}
        aria-label={
          completed ? `Uncheck ${habit.name}` : `Check off ${habit.name}`
        }
        className="group flex size-11 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="flex size-6 items-center justify-center rounded-md border border-input bg-background transition-colors group-data-[state=checked]:border-success group-data-[state=checked]:bg-success group-data-[state=checked]:text-success-foreground">
          <Checkbox.Indicator>
            <Check className="size-4" aria-hidden />
          </Checkbox.Indicator>
        </span>
      </Checkbox.Root>
      <p
        title={habit.name}
        className={
          completed
            ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
            : "min-w-0 flex-1 truncate text-sm"
        }
      >
        {habit.name}
      </p>
    </div>
  )
}
