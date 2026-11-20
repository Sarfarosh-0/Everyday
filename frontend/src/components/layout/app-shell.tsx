import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router"
import { BottomTabBar } from "@/components/layout/bottom-tab-bar"
import { NAV_ITEMS } from "@/components/layout/nav-items"
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function AppShell() {
  const { pathname } = useLocation()
  const isFirstRoute = useRef(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    const section = NAV_ITEMS.find((item) => item.to === pathname)?.label
    document.title = section ? `${section} · Everyday` : "Everyday"

    // Announce the new page without stealing focus on the initial load.
    if (isFirstRoute.current) {
      isFirstRoute.current = false
      return
    }

    const heading = document.querySelector<HTMLElement>("main h1")
    heading?.setAttribute("tabindex", "-1")
    heading?.focus()
  }, [pathname])

  return (
    <div className="min-h-svh">
      <div className="mx-auto flex w-full max-w-6xl">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-3 px-4 md:px-8">
              <p className="font-heading text-lg font-semibold text-primary md:hidden">
                Everyday
              </p>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-28 md:px-8 md:py-10 md:pb-12">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomTabBar />
    </div>
  )
}
