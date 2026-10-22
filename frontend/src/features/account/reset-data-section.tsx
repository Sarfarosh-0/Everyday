import { useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"

type ResetDataSectionProps = {
  resetting: boolean
  error: string | null
  onReset: () => Promise<void>
}

export function ResetDataSection({
  resetting,
  error,
  onReset,
}: ResetDataSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const resetButtonRef = useRef<HTMLButtonElement>(null)

  // Radix only restores focus to an AlertDialogTrigger; remember the opener.
  function restoreResetButton(event: Event) {
    event.preventDefault()
    resetButtonRef.current?.focus()
  }

  return (
    <section
      aria-labelledby="reset-data-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <h2
        id="reset-data-title"
        className="font-heading text-base font-semibold"
      >
        Your data
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Clear every habit and check-in on this device. Your profile and theme
        stay.
      </p>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        ref={resetButtonRef}
        type="button"
        variant="destructive"
        className="mt-4"
        disabled={resetting}
        aria-busy={resetting || undefined}
        onClick={() => setConfirmOpen(true)}
      >
        <RotateCcw aria-hidden />
        {resetting ? "Clearing…" : "Reset app data"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Reset your data?"
        description="This removes all habits and check-in history from this device. Your profile and theme stay. This cannot be undone."
        confirmLabel="Reset data"
        onConfirm={() => void onReset()}
        onCloseAutoFocus={restoreResetButton}
      />
    </section>
  )
}
