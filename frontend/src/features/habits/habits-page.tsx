import { ListChecks, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { HabitForm } from "@/features/habits/habit-form"
import { HabitList } from "@/features/habits/habit-list"
import type { Habit } from "@/lib/types"
import { useCompletionsStore } from "@/store/completions-store"
import { useHabitsStore } from "@/store/habits-store"

export function HabitsPage() {
  const habits = useHabitsStore((state) => state.habits)
  const loading = useHabitsStore((state) => state.loading)
  const error = useHabitsStore((state) => state.error)
  const loadHabits = useHabitsStore((state) => state.loadHabits)
  const deleteHabit = useHabitsStore((state) => state.deleteHabit)
  const clearError = useHabitsStore((state) => state.clearError)
  const removeCompletionsForHabit = useCompletionsStore(
    (state) => state.removeForHabit,
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
  const formTriggerRef = useRef<HTMLElement | null>(null)
  const deleteTriggerRef = useRef<HTMLElement | null>(null)
  const newHabitButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    void loadHabits()
  }, [loadHabits])

  // Radix only restores focus to a DialogTrigger; remember the opener ourselves.
  function rememberFormTrigger() {
    formTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
  }

  function restoreFormTrigger(event: Event) {
    event.preventDefault()
    if (formTriggerRef.current?.isConnected) formTriggerRef.current.focus()
  }

  function requestDelete(habit: Habit) {
    deleteTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setDeletingHabit(habit)
  }

  // The row is gone after a delete, so fall back to the "New habit" button.
  function restoreDeleteTrigger(event: Event) {
    event.preventDefault()
    if (deleteTriggerRef.current?.isConnected) deleteTriggerRef.current.focus()
  }

  function openCreateForm() {
    clearError()
    rememberFormTrigger()
    setEditingHabit(null)
    setFormOpen(true)
  }

  function openEditForm(habit: Habit) {
    clearError()
    rememberFormTrigger()
    setEditingHabit(habit)
    setFormOpen(true)
  }

  async function confirmDelete() {
    const habit = deletingHabit
    if (!habit) return

    setDeletingHabit(null)
    const deleted = await deleteHabit(habit.id)

    if (!deleted) return

    removeCompletionsForHabit(habit.id)
    toast.success(`Deleted "${habit.name}".`)
    // The trigger row is being removed; keep focus somewhere useful.
    newHabitButtonRef.current?.focus()
  }

  return (
    <>
      <PageHeader title="Habits" description="Create and manage your habits.">
        <Button ref={newHabitButtonRef} onClick={openCreateForm}>
          <Plus aria-hidden />
          New habit
        </Button>
      </PageHeader>

      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading habits">
          <Skeleton className="h-[70px] rounded-xl" />
          <Skeleton className="h-[70px] rounded-xl" />
          <Skeleton className="h-[70px] rounded-xl" />
        </div>
      ) : error && habits.length === 0 ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void loadHabits(true)}
          >
            Try again
          </Button>
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No habits yet"
          description="Create your first habit to start tracking your days."
          action={
            <Button onClick={openCreateForm}>
              <Plus aria-hidden />
              New habit
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => void loadHabits(true)}
              >
                Try again
              </Button>
            </div>
          ) : null}
          <HabitList
            habits={habits}
            onEdit={openEditForm}
            onDelete={requestDelete}
          />
        </div>
      )}

      <HabitForm
        open={formOpen}
        onOpenChange={setFormOpen}
        habits={habits}
        habit={editingHabit}
        onCloseAutoFocus={restoreFormTrigger}
      />

      <ConfirmDialog
        open={deletingHabit !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingHabit(null)
        }}
        title="Delete this habit?"
        description={
          deletingHabit
            ? `"${deletingHabit.name}" and all of its check-ins will be removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={() => void confirmDelete()}
        onCloseAutoFocus={restoreDeleteTrigger}
      />
    </>
  )
}
