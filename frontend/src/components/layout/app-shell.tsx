import { Outlet } from "react-router"
import { BottomTabBar } from "@/components/layout/bottom-tab-bar"
import { Sidebar } from "@/components/layout/sidebar"

export function AppShell() {
  return (
    <div className="min-h-svh">
      <div className="mx-auto flex w-full max-w-6xl">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 md:px-8 md:py-10 md:pb-12">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomTabBar />
    </div>
  )
}
