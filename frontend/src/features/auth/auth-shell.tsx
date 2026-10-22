import type { ReactNode } from "react"

type AuthShellProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <p className="font-heading text-2xl font-semibold text-primary">
            Everyday
          </p>
          <h1 className="font-heading text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          {children}
        </div>
        <p className="text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </main>
  )
}
