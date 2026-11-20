import { cn } from "cn"
import { NavLink } from "react-router"
import { NAV_ITEMS } from "@/components/layout/nav-items"

export function Sidebar() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 hidden h-svh w-20 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-2 py-6 md:flex lg:w-60 lg:px-4"
    >
      <p className="hidden px-3 font-heading text-xl font-semibold text-primary lg:block">
        Everyday
      </p>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring lg:justify-start",
                  isActive
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )
              }
            >
              <item.icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
