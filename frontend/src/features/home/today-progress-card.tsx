import { ProgressRing } from "@/components/progress-ring"
import type { CompletionStats } from "@/lib/utils/habits"

type TodayProgressCardProps = {
  stats: CompletionStats
}

export function TodayProgressCard({ stats }: TodayProgressCardProps) {
  const percent = stats.percent ?? 0

  return (
    <section
      aria-labelledby="today-progress-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <h2
        id="today-progress-title"
        className="font-heading text-base font-semibold"
      >
        Today's progress
      </h2>
      <div className="mt-4 flex justify-center">
        <ProgressRing
          value={percent / 100}
          label={`Today's progress: ${percent}%`}
          size={168}
        >
          <span className="font-heading text-3xl font-semibold">{percent}%</span>
          <span className="text-sm text-muted-foreground">
            {stats.completed} / {stats.scheduled} done
          </span>
        </ProgressRing>
      </div>
    </section>
  )
}
