import { useEffect } from "react"
import { Outlet } from "react-router"
import { FullPageLoader } from "@/components/full-page-loader"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

/** Loads the local profile that stands in for sign-in while auth is hidden. */
export function AppBootstrap() {
  const user = useAuthStore((state) => state.user)
  const initialized = useAuthStore((state) => state.initialized)
  const error = useAuthStore((state) => state.error)
  const loadLocalUser = useAuthStore((state) => state.loadLocalUser)

  useEffect(() => {
    if (!initialized) void loadLocalUser()
  }, [initialized, loadLocalUser])

  if (!initialized) {
    return <FullPageLoader label="Loading your profile…" />
  }

  if (!user) {
    return (
      <div className="grid min-h-svh place-items-center px-4">
        <div className="max-w-sm text-center">
          <p role="alert" className="text-sm text-destructive">
            {error ?? "Could not load your profile."}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void loadLocalUser()}
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
