export type Habit = {
  id: string
  name: string
  icon: string
  color: string
  weekdays: number[]
  createdAt: string
}

export type HabitInput = Pick<Habit, "name" | "icon" | "color" | "weekdays">

export type Completion = {
  habitId: string
  date: string
}

export type User = {
  id: string
  name: string
  email: string
}
