import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: string
  detail?: string
}

export function StatCard({ icon: Icon, label, value, detail }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon aria-hidden className="size-4" />
        {label}
      </dt>
      <dd className="mt-2">
        <span className="block font-heading text-3xl font-semibold tabular-nums">
          {value}
        </span>
        {detail ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            {detail}
          </span>
        ) : null}
      </dd>
    </div>
  )
}
