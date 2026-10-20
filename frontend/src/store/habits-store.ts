import { create } from "zustand"
import type { Habit, HabitInput } from "@/lib/types"
import { getServiceErrorMessage } from "@/lib/services/errors"
import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from "@/lib/services/habits"

type HabitsState = {
  habits: Habit[]
  loading: boolean
  error: string | null
  loadHabits: () => Promise<void>
  createHabit: (input: HabitInput) => Promise<Habit | null>
  updateHabit: (id: string, input: HabitInput) => Promise<Habit | null>
  deleteHabit: (id: string) => Promise<boolean>
  clearError: () => void
  reset: () => void
}

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [],
  loading: false,
  error: null,

  loadHabits: async () => {
    set({ loading: true, error: null })
    try {
      const habits = await getHabits()
      set({ habits, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: getServiceErrorMessage(error, "Could not load your habits."),
      })
    }
  },

  createHabit: async (input) => {
    set({ error: null })
    try {
      const habit = await createHabit(input)
      set((state) => ({ habits: [...state.habits, habit] }))
      return habit
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not save your habit."),
      })
      return null
    }
  },

  updateHabit: async (id, input) => {
    set({ error: null })
    try {
      const updated = await updateHabit(id, input)
      set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === id ? updated : habit,
        ),
      }))
      return updated
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not update your habit."),
      })
      return null
    }
  },

  deleteHabit: async (id) => {
    set({ error: null })
    try {
      await deleteHabit(id)
      set((state) => ({
        habits: state.habits.filter((habit) => habit.id !== id),
      }))
      return true
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not delete your habit."),
      })
      return false
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({ habits: [], loading: false, error: null }),
}))
