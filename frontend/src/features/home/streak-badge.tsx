import { Flame } from "lucide-react"

type StreakBadgeProps = {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
      <Flame className="size-4" aria-hidden />
      {streak === 0
        ? "No streak yet"
        : `${streak} day${streak === 1 ? "" : "s"} streak`}
    </p>
  )
}
