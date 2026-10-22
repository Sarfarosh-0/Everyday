import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { NameEditForm } from "@/features/account/name-edit-form"
import { ProfileCard } from "@/features/account/profile-card"
import { ResetDataSection } from "@/features/account/reset-data-section"
import { ThemeSelect } from "@/features/account/theme-select"
import { useAuthStore } from "@/store/auth-store"
import { useCompletionsStore } from "@/store/completions-store"
import { useHabitsStore } from "@/store/habits-store"

type AccountAction = "name" | "reset"

export function AccountPage() {
  const user = useAuthStore((state) => state.user)
  const updateName = useAuthStore((state) => state.updateName)
  const resetData = useAuthStore((state) => state.resetData)
  const accountError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)
  const resetHabits = useHabitsStore((state) => state.reset)
  const resetCompletions = useCompletionsStore((state) => state.reset)

  const [activeAction, setActiveAction] = useState<AccountAction | null>(null)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError])

  async function saveName(name: string): Promise<boolean> {
    setActiveAction("name")
    clearError()

    const saved = await updateName(name)
    if (!saved) return false

    toast.success("Name updated.")
    return true
  }

  async function clearData() {
    setActiveAction("reset")
    setResetting(true)
    clearError()

    const cleared = await resetData()
    if (!cleared) {
      setResetting(false)
      return
    }

    resetHabits()
    resetCompletions()
    setResetting(false)
    toast.success("Your habits and history were cleared.")
  }

  if (!user) return null

  return (
    <>
      <PageHeader title="Account" description="Your profile and settings." />
      <div className="space-y-6">
        <ProfileCard user={user} />
        <NameEditForm
          currentName={user.name}
          error={activeAction === "name" ? accountError : null}
          onSave={saveName}
        />
        <ThemeSelect />
        <ResetDataSection
          resetting={resetting}
          error={activeAction === "reset" ? accountError : null}
          onReset={clearData}
        />
      </div>
    </>
  )
}
