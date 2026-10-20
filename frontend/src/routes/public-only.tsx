import { useEffect } from "react"
import { Navigate, Outlet } from "react-router"
import { FullPageLoader } from "@/components/full-page-loader"
import { useAuthStore } from "@/store/auth-store"

/** Keeps signed-in users off the Login and Sign up screens. */
export function PublicOnly() {
  const user = useAuthStore((state) => state.user)
  const initialized = useAuthStore((state) => state.initialized)
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser)

  useEffect(() => {
    if (!initialized) void loadCurrentUser()
  }, [initialized, loadCurrentUser])

  if (!initialized) return <FullPageLoader />

  if (user) return <Navigate to="/" replace />

  return <Outlet />
}
