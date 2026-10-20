import { Dumbbell, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getHabitColor,
  readableTextColor,
} from "@/features/habits/habit-colors"
import { HABIT_ICONS } from "@/features/habits/habit-icons"
import { weekdayChips } from "@/features/habits/weekdays"
import type { Habit } from "@/lib/types"

type HabitCardProps = {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const iconOption = HABIT_ICONS.find((option) => option.key === habit.icon)
  const Icon = iconOption?.icon ?? Dumbbell
  const color = getHabitColor(habit.color)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: color,
          color: readableTextColor(color),
        }}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate font-medium" title={habit.name}>
          {habit.name}
        </p>
        <ul className="flex flex-wrap gap-1">
          {weekdayChips(habit.weekdays).map((chip) => (
            <li
              key={chip}
              className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] leading-4 text-muted-foreground"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Edit ${habit.name}`}
          onClick={() => onEdit(habit)}
        >
          <Pencil aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${habit.name}`}
          onClick={() => onDelete(habit)}
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
    </div>
  )
}
