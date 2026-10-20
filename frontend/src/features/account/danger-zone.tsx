import { useRef, useState } from "react"
import { Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"

type DangerZoneProps = {
  deleting: boolean
  error: string | null
  onDelete: () => Promise<void>
}

export function DangerZone({ deleting, error, onDelete }: DangerZoneProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  // Radix only restores focus to an AlertDialogTrigger; remember the opener.
  function restoreDeleteButton(event: Event) {
    event.preventDefault()
    deleteButtonRef.current?.focus()
  }

  return (
    <section
      aria-labelledby="danger-zone-title"
      className="rounded-xl border border-destructive/40 bg-destructive/5 p-5"
    >
      <h2
        id="danger-zone-title"
        className="font-heading text-base font-semibold text-destructive"
      >
        Danger zone
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Deleting your account removes your profile, habits, and all check-in
        history. This cannot be undone.
      </p>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        ref={deleteButtonRef}
        type="button"
        variant="destructive"
        className="mt-4"
        aria-busy={deleting || undefined}
        onClick={() => {
          if (!deleting) setConfirmOpen(true)
        }}
      >
        <Trash2 aria-hidden />
        {deleting ? "Deleting…" : "Delete account"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete your account?"
        description="This removes your profile, habits, and all check-ins. This cannot be undone."
        confirmLabel="Delete account"
        onConfirm={() => void onDelete()}
        onCloseAutoFocus={restoreDeleteButton}
      />
    </section>
  )
}
