import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"

type AuthFieldProps = ComponentProps<"input"> & {
  id: string
  label: string
  error?: string
}

export function AuthField({ id, label, error, ...props }: AuthFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
