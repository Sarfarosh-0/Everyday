import type { ComponentType, ReactNode } from "react"

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      {Icon ? (
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          <Icon className="size-6" />
        </span>
      ) : null}
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-balance text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
