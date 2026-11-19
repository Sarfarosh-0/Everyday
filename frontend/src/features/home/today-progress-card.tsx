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
      className="rounded-xl border border-border/60 bg-card p-4 md:p-5"
    >
      <div className="flex items-center gap-4">
        <ProgressRing
          value={percent / 100}
          label={`Today's progress: ${percent}%`}
          size={112}
          strokeWidth={12}
        >
          <span className="font-heading text-2xl font-semibold">{percent}%</span>
        </ProgressRing>
        <div className="min-w-0 space-y-1">
          <h2
            id="today-progress-title"
            className="font-heading text-base font-semibold"
          >
            Today's progress
          </h2>
          <p className="text-sm text-muted-foreground">
            {stats.completed} / {stats.scheduled} done
          </p>
        </div>
      </div>
    </section>
  )
}
