import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ColorPicker } from "@/features/habits/color-picker"
import { DEFAULT_HABIT_COLOR } from "@/features/habits/habit-colors"
import { DEFAULT_HABIT_ICON } from "@/features/habits/habit-icons"
import { IconPicker } from "@/features/habits/icon-picker"
import { WeekdayPicker } from "@/features/habits/weekday-picker"
import { EVERY_DAY } from "@/features/habits/weekdays"
import { createHabitSchema } from "@/lib/schemas"
import type { Habit } from "@/lib/types"
import { useHabitsStore } from "@/store/habits-store"

type HabitFormValues = z.input<ReturnType<typeof createHabitSchema>>

type HabitFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  habits: Habit[]
  habit: Habit | null
  onCloseAutoFocus?: (event: Event) => void
}

function defaultValues(habit: Habit | null): HabitFormValues {
  if (habit) {
    return {
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      weekdays: [...habit.weekdays],
    }
  }

  return {
    name: "",
    icon: DEFAULT_HABIT_ICON,
    color: DEFAULT_HABIT_COLOR,
    weekdays: [...EVERY_DAY],
  }
}

export function HabitForm({
  open,
  onOpenChange,
  habits,
  habit,
  onCloseAutoFocus,
}: HabitFormProps) {
  const createHabit = useHabitsStore((state) => state.createHabit)
  const updateHabit = useHabitsStore((state) => state.updateHabit)
  const serviceError = useHabitsStore((state) => state.error)
  const clearError = useHabitsStore((state) => state.clearError)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(createHabitSchema(habits, habit?.id)),
    defaultValues: defaultValues(habit),
  })

  const icon = useWatch({ control, name: "icon" })
  const color = useWatch({ control, name: "color" })
  const weekdays = useWatch({ control, name: "weekdays" })

  useEffect(() => {
    if (!open) return

    clearError()
    reset(defaultValues(habit))
  }, [open, habit, reset, clearError])

  async function onSubmit(values: HabitFormValues) {
    const saved = habit
      ? await updateHabit(habit.id, values)
      : await createHabit(values)

    if (!saved) return

    toast.success(habit ? "Habit updated." : "Habit created.")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="top-0 left-0 h-svh max-w-none translate-x-0 translate-y-0 gap-0 rounded-none p-0 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl"
      >
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="space-y-1 border-b px-4 py-4 sm:px-6">
            <DialogTitle className="text-lg">
              {habit ? "Edit habit" : "New habit"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Set the name, icon, color, and days for this habit.
            </DialogDescription>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="space-y-2">
              <label htmlFor="habit-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="habit-name"
                placeholder="Morning run"
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "habit-name-error" : undefined}
                {...register("name")}
              />
              {errors.name ? (
                <p
                  id="habit-name-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div aria-invalid={Boolean(errors.icon) || undefined}>
              <IconPicker
                value={icon}
                onChange={(value) =>
                  setValue("icon", value, { shouldValidate: true })
                }
                error={errors.icon?.message}
              />
            </div>

            <div aria-invalid={Boolean(errors.color) || undefined}>
              <ColorPicker
                value={color}
                onChange={(value) =>
                  setValue("color", value, { shouldValidate: true })
                }
                error={errors.color?.message}
              />
            </div>

            <div aria-invalid={Boolean(errors.weekdays) || undefined}>
              <WeekdayPicker
                value={weekdays}
                onChange={(value) =>
                  setValue("weekdays", value, { shouldValidate: true })
                }
                error={errors.weekdays?.message}
              />
            </div>

            {serviceError ? (
              <p role="alert" className="text-sm text-destructive">
                {serviceError}
              </p>
            ) : null}
          </div>

          <div className="flex gap-2 border-t bg-muted/50 px-4 py-4 sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving…"
                : habit
                  ? "Save changes"
                  : "Create habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
