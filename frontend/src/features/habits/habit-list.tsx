import { HabitCard } from "@/features/habits/habit-card"
import type { Habit } from "@/lib/types"

type HabitListProps = {
  habits: Habit[]
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
}

export function HabitList({ habits, onEdit, onDelete }: HabitListProps) {
  return (
    <ul className="space-y-3">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard habit={habit} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
