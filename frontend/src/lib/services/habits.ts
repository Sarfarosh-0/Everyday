import type { Habit, HabitInput } from "@/lib/types"
import { createHabitSchema } from "@/lib/schemas"
import { requireSessionUserId } from "./auth"
import { isCompletionArray } from "./completions"
import { ServiceError } from "./errors"
import {
  isRecord,
  readJson,
  simulateDelay,
  userCollectionKey,
  writeJson,
} from "./storage"

function isHabit(value: unknown): value is Habit {
  if (!isRecord(value)) return false

  const { id, name, icon, color, weekdays, createdAt } = value

  return (
    typeof id === "string" &&
    id.length > 0 &&
    typeof name === "string" &&
    typeof icon === "string" &&
    typeof color === "string" &&
    Array.isArray(weekdays) &&
    weekdays.length > 0 &&
    weekdays.every(
      (day) =>
        typeof day === "number" &&
        Number.isInteger(day) &&
        day >= 1 &&
        day <= 7,
    ) &&
    typeof createdAt === "string" &&
    !Number.isNaN(new Date(createdAt).getTime())
  )
}

function isHabitArray(value: unknown): value is Habit[] {
  return Array.isArray(value) && value.every(isHabit)
}

function readHabits(userId: string): Habit[] {
  return readJson(userCollectionKey(userId, "habits"), isHabitArray) ?? []
}

function writeHabits(userId: string, habits: Habit[]): void {
  writeJson(userCollectionKey(userId, "habits"), habits)
}

function parseInput(
  habits: Habit[],
  input: HabitInput,
  editingHabitId?: string,
): HabitInput {
  const result = createHabitSchema(habits, editingHabitId).safeParse(input)

  if (!result.success) {
    throw new ServiceError(
      "validation",
      result.error.issues[0]?.message ?? "Check your habit details.",
    )
  }

  return {
    ...result.data,
    weekdays: [...new Set(result.data.weekdays)].sort((a, b) => a - b),
  }
}

export async function getHabits(): Promise<Habit[]> {
  await simulateDelay()

  const userId = requireSessionUserId()
  return readHabits(userId)
}

export async function createHabit(input: HabitInput): Promise<Habit> {
  await simulateDelay()

  const userId = requireSessionUserId()
  const habits = readHabits(userId)
  const normalized = parseInput(habits, input)

  const habit: Habit = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: new Date().toISOString(),
  }

  writeHabits(userId, [...habits, habit])
  return habit
}

export async function updateHabit(
  id: string,
  input: HabitInput,
): Promise<Habit> {
  await simulateDelay()

  const userId = requireSessionUserId()
  const habits = readHabits(userId)
  const existing = habits.find((habit) => habit.id === id)

  if (!existing) {
    throw new ServiceError("not-found", "This habit no longer exists.")
  }

  const normalized = parseInput(habits, input, id)

  const updated: Habit = { ...existing, ...normalized }
  writeHabits(
    userId,
    habits.map((habit) => (habit.id === id ? updated : habit)),
  )

  return updated
}

export async function deleteHabit(id: string): Promise<void> {
  await simulateDelay()

  const userId = requireSessionUserId()
  const habits = readHabits(userId)

  if (!habits.some((habit) => habit.id === id)) {
    throw new ServiceError("not-found", "This habit no longer exists.")
  }

  const completions =
    readJson(userCollectionKey(userId, "completions"), isCompletionArray) ?? []

  writeHabits(
    userId,
    habits.filter((habit) => habit.id !== id),
  )
  writeJson(
    userCollectionKey(userId, "completions"),
    completions.filter((completion) => completion.habitId !== id),
  )
}
