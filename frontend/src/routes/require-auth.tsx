import { useEffect } from "react"
import { Navigate, Outlet } from "react-router"
import { FullPageLoader } from "@/components/full-page-loader"
import { useAuthStore } from "@/store/auth-store"

/** Sends signed-out users to Login and renders protected routes for signed-in users. */
export function RequireAuth() {
  const user = useAuthStore((state) => state.user)
  const initialized = useAuthStore((state) => state.initialized)
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser)

  useEffect(() => {
    if (!initialized) void loadCurrentUser()
  }, [initialized, loadCurrentUser])

  if (!initialized) return <FullPageLoader />

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
