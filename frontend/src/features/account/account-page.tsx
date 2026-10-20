import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { DangerZone } from "@/features/account/danger-zone"
import { NameEditForm } from "@/features/account/name-edit-form"
import { ProfileCard } from "@/features/account/profile-card"
import { ThemeSelect } from "@/features/account/theme-select"
import { useAuthStore } from "@/store/auth-store"

type AccountAction = "name" | "logout" | "delete"

export function AccountPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const updateName = useAuthStore((state) => state.updateName)
  const logOut = useAuthStore((state) => state.logOut)
  const deleteAccount = useAuthStore((state) => state.deleteAccount)
  const accountError = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const [activeAction, setActiveAction] = useState<AccountAction | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError])

  async function saveName(name: string): Promise<boolean> {
    setActiveAction("name")
    clearError()

    const saved = await updateName(name)
    if (!saved) return false

    toast.success("Name updated.")
    setActiveAction(null)
    return true
  }

  async function handleLogOut() {
    setActiveAction("logout")
    setLoggingOut(true)
    clearError()

    const loggedOut = await logOut()
    if (loggedOut) {
      navigate("/login", { replace: true })
      return
    }

    setLoggingOut(false)
  }

  async function handleDeleteAccount() {
    setActiveAction("delete")
    setDeleting(true)
    clearError()

    const deleted = await deleteAccount()
    if (deleted) {
      navigate("/signup", { replace: true })
      return
    }

    setDeleting(false)
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

        <section
          aria-labelledby="session-title"
          className="rounded-xl border border-border/60 bg-card p-5"
        >
          <h2
            id="session-title"
            className="font-heading text-base font-semibold"
          >
            Session
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out on this device. Your habits and history stay saved.
          </p>

          {activeAction === "logout" && accountError ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {accountError}
            </p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={loggingOut}
            onClick={() => void handleLogOut()}
          >
            <LogOut aria-hidden />
            {loggingOut ? "Logging out…" : "Log out"}
          </Button>
        </section>

        <DangerZone
          deleting={deleting}
          error={activeAction === "delete" ? accountError : null}
          onDelete={handleDeleteAccount}
        />
      </div>
    </>
  )
}
