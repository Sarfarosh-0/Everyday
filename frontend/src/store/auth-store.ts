import { create } from "zustand"
import type { User } from "@/lib/types"
import { getServiceErrorMessage } from "@/lib/services/errors"
import {
  deleteAccount as deleteAccountService,
  getCurrentUser,
  getLocalUser,
  logIn as logInService,
  logOut as logOutService,
  signUp as signUpService,
  updateName as updateNameService,
  type LogInInput,
  type SignUpInput,
} from "@/lib/services/auth"

type AuthState = {
  user: User | null
  loading: boolean
  /** True once the stored session has been checked at least once. */
  initialized: boolean
  error: string | null
  loadCurrentUser: () => Promise<void>
  loadLocalUser: () => Promise<void>
  signUp: (input: SignUpInput) => Promise<boolean>
  logIn: (input: LogInInput) => Promise<boolean>
  logOut: () => Promise<boolean>
  updateName: (name: string) => Promise<boolean>
  deleteAccount: () => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  loadCurrentUser: async () => {
    set({ loading: true, error: null })
    try {
      const user = await getCurrentUser()
      set({ user, loading: false, initialized: true })
    } catch (error) {
      set({
        loading: false,
        initialized: true,
        error: getServiceErrorMessage(error, "Could not load your account."),
      })
    }
  },

  loadLocalUser: async () => {
    set({ loading: true, error: null })
    try {
      const user = await getLocalUser()
      set({ user, loading: false, initialized: true })
    } catch (error) {
      set({
        loading: false,
        initialized: true,
        error: getServiceErrorMessage(error, "Could not load your profile."),
      })
    }
  },

  signUp: async (input) => {
    set({ error: null })
    try {
      const user = await signUpService(input)
      set({ user })
      return true
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not create your account."),
      })
      return false
    }
  },

  logIn: async (input) => {
    set({ error: null })
    try {
      const user = await logInService(input)
      set({ user })
      return true
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not sign you in."),
      })
      return false
    }
  },

  logOut: async () => {
    set({ error: null })
    try {
      await logOutService()
      set({ user: null })
      return true
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not sign you out."),
      })
      return false
    }
  },

  updateName: async (name) => {
    set({ error: null })
    try {
      const user = await updateNameService(name)
      set({ user })
      return true
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not update your name."),
      })
      return false
    }
  },

  deleteAccount: async () => {
    set({ error: null })
    try {
      await deleteAccountService()
      set({ user: null })
      return true
    } catch (error) {
      set({
        error: getServiceErrorMessage(error, "Could not delete your account."),
      })
      return false
    }
  },

  clearError: () => set({ error: null }),
}))
