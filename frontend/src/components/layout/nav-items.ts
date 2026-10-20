import {
  ChartColumn,
  House,
  ListChecks,
  UserRound,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: House },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/account", label: "Account", icon: UserRound },
]
