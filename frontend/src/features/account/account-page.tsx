import { useEffect } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { NameEditForm } from "@/features/account/name-edit-form"
import { ProfileCard } from "@/features/account/profile-card"
import { ThemeSelect } from "@/features/account/theme-select"
import { useAuthStore } from "@/store/auth-store"

export function AccountPage() {
  const user = useAuthStore((state) => state.user)
  const updateName = useAuthStore((state) => state.updateName)
  const accountError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  useEffect(() => {
    clearError()
  }, [clearError])

  async function saveName(name: string): Promise<boolean> {
    clearError()

    const saved = await updateName(name)
    if (!saved) return false

    toast.success("Name updated.")
    return true
  }

  if (!user) return null

  return (
    <>
      <PageHeader title="Account" description="Your profile and settings." />
      <div className="space-y-6">
        <ProfileCard user={user} />
        <NameEditForm
          currentName={user.name}
          error={accountError}
          onSave={saveName}
        />
        <ThemeSelect />
      </div>
    </>
  )
}
