import { format } from "date-fns"
import { CheckCircle2, Circle } from "lucide-react"
import { BottomSheet } from "@/components/bottom-sheet"
import { Button } from "@/components/ui/button"
import type { Completion, Habit } from "@/lib/types"
import { parseDateKey } from "@/lib/utils/date"
import { getScheduledHabits, perDayCompletion } from "@/lib/utils/habits"

type DayDetailSheetProps = {
  date: string | null
  habits: Habit[]
  completions: Completion[]
  onClose: () => void
  onCloseAutoFocus?: (event: Event) => void
}

export function DayDetailSheet({
  date,
  habits,
  completions,
  onClose,
  onCloseAutoFocus,
}: DayDetailSheetProps) {
  const scheduled = date ? getScheduledHabits(habits, date) : []
  const completedIds = new Set(
    completions
      .filter((completion) => completion.date === date)
      .map((completion) => completion.habitId),
  )
  const done = scheduled.filter((habit) => completedIds.has(habit.id))
  const notDone = scheduled.filter((habit) => !completedIds.has(habit.id))
  const stats = date ? perDayCompletion(habits, completions, date) : null

  return (
    <BottomSheet
      open={date !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      onCloseAutoFocus={onCloseAutoFocus}
      title={date ? format(parseDateKey(date), "EEEE, d MMMM") : "Day details"}
      description={
        stats
          ? stats.scheduled === 0
            ? "No habits were scheduled on this day."
            : `${stats.completed} of ${stats.scheduled} habits completed (${stats.percent}%).`
          : undefined
      }
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      {scheduled.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No habits were scheduled on this day.
        </p>
      ) : (
        <div className="space-y-5">
          <section aria-labelledby="day-done-title">
            <h3
              id="day-done-title"
              className="font-heading text-sm font-semibold"
            >
              Done
            </h3>
            {done.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Nothing completed.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {done.map((habit) => (
                  <li key={habit.id} className="flex items-center gap-2">
                    <CheckCircle2
                      aria-hidden
                      className="size-4 shrink-0 text-success"
                    />
                    <span className="truncate text-sm" title={habit.name}>
                      {habit.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="day-not-done-title">
            <h3
              id="day-not-done-title"
              className="font-heading text-sm font-semibold"
            >
              Not done
            </h3>
            {notDone.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Everything completed.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {notDone.map((habit) => (
                  <li key={habit.id} className="flex items-center gap-2">
                    <Circle
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="truncate text-sm" title={habit.name}>
                      {habit.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </BottomSheet>
  )
}
