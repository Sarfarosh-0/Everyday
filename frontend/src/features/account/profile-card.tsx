import type { User } from "@/lib/types"

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

type ProfileCardProps = {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section
      aria-labelledby="profile-title"
      className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5"
    >
      <span
        aria-hidden
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/5 font-heading text-xl font-semibold text-primary"
      >
        {initials(user.name)}
      </span>
      <div className="min-w-0 space-y-1">
        <h2
          id="profile-title"
          className="truncate font-heading text-xl font-semibold"
        >
          {user.name}
        </h2>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
      </div>
    </section>
  )
}
