import { create } from "zustand"
import type { Completion } from "@/lib/types"
import { getServiceErrorMessage } from "@/lib/services/errors"
import {
  getCompletions,
  toggleCompletion as toggleCompletionService,
} from "@/lib/services/completions"

type CompletionsState = {
  completions: Completion[]
  loading: boolean
  error: string | null
  loadCompletions: () => Promise<void>
  toggleCompletion: (habitId: string, date: string) => Promise<boolean>
  clearError: () => void
  reset: () => void
}

export const useCompletionsStore = create<CompletionsState>((set, get) => ({
  completions: [],
  loading: false,
  error: null,

  loadCompletions: async () => {
    set({ loading: true, error: null })
    try {
      const completions = await getCompletions()
      set({ completions, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: getServiceErrorMessage(error, "Could not load your check-ins."),
      })
    }
  },

  toggleCompletion: async (habitId, date) => {
    const previous = get().completions
    const completed = previous.some(
      (completion) =>
        completion.habitId === habitId && completion.date === date,
    )
    const optimistic = completed
      ? previous.filter(
          (completion) =>
            !(completion.habitId === habitId && completion.date === date),
        )
      : [...previous, { habitId, date }]

    set({ completions: optimistic, error: null })

    try {
      const result = await toggleCompletionService(habitId, date)
      set({ completions: result.completions })
      return true
    } catch (error) {
      set({
        completions: previous,
        error: getServiceErrorMessage(error, "Could not save your check-in."),
      })
      return false
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({ completions: [], loading: false, error: null }),
}))
