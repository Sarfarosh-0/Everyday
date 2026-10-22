import { format } from "date-fns"
import { DEFAULT_USER_NAME } from "@/lib/services/auth"
import type { User } from "@/lib/types"

type GreetingHeaderProps = {
  user: User
}

function greetingFor(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

export function GreetingHeader({ user }: GreetingHeaderProps) {
  const today = new Date()
  const firstName = user.name.trim().split(/\s+/)[0]
  const greeting =
    firstName && firstName !== DEFAULT_USER_NAME
      ? `${greetingFor(today)}, ${firstName}`
      : greetingFor(today)

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, d MMMM")}
        </p>
      </div>
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary"
      >
        {initials(user.name)}
      </span>
    </header>
  )
}
