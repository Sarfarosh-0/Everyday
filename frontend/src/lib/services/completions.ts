import type { Completion } from "@/lib/types"
import { isDateKey } from "@/lib/utils/date"
import { requireSessionUserId } from "./auth"
import { ServiceError } from "./errors"
import {
  isRecord,
  readJson,
  simulateDelay,
  userCollectionKey,
  writeJson,
} from "./storage"

export type ToggleCompletionResult = {
  completed: boolean
  completions: Completion[]
}

export function isCompletionArray(value: unknown): value is Completion[] {
  return Array.isArray(value) && value.every(isCompletion)
}

function isCompletion(value: unknown): value is Completion {
  return (
    isRecord(value) &&
    typeof value.habitId === "string" &&
    value.habitId.length > 0 &&
    typeof value.date === "string" &&
    isDateKey(value.date)
  )
}

function readCompletions(userId: string): Completion[] {
  return (
    readJson(userCollectionKey(userId, "completions"), isCompletionArray) ?? []
  )
}

export async function getCompletions(): Promise<Completion[]> {
  await simulateDelay()

  const userId = requireSessionUserId()
  return readCompletions(userId)
}

export async function toggleCompletion(
  habitId: string,
  date: string,
): Promise<ToggleCompletionResult> {
  await simulateDelay()

  const userId = requireSessionUserId()

  if (!habitId) {
    throw new ServiceError("validation", "Choose a habit to check off.")
  }
  if (!isDateKey(date)) {
    throw new ServiceError("validation", "Choose a valid date.")
  }

  const completions = readCompletions(userId)
  const completed = completions.some(
    (completion) => completion.habitId === habitId && completion.date === date,
  )

  const next = completed
    ? completions.filter(
        (completion) =>
          !(completion.habitId === habitId && completion.date === date),
      )
    : [...completions, { habitId, date }]

  writeJson(userCollectionKey(userId, "completions"), next)

  return { completed: !completed, completions: next }
}
