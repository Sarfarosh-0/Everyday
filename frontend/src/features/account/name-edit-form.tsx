import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { accountNameSchema } from "@/lib/schemas"

type NameEditValues = z.input<typeof accountNameSchema>

type NameEditFormProps = {
  currentName: string
  error: string | null
  onSave: (name: string) => Promise<boolean>
}

export function NameEditForm({
  currentName,
  error,
  onSave,
}: NameEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameEditValues>({
    resolver: zodResolver(accountNameSchema),
    defaultValues: { name: currentName },
  })

  async function onSubmit(values: NameEditValues) {
    const saved = await onSave(values.name)
    if (saved) reset({ name: values.name.trim() })
  }

  return (
    <section
      aria-labelledby="name-edit-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <h2
        id="name-edit-title"
        className="font-heading text-base font-semibold"
      >
        Edit name
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This is the name shown on your dashboard.
      </p>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-3"
      >
        <div className="space-y-1">
          <label htmlFor="account-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="account-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "account-name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p
              id="account-name-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.name.message}
            </p>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save name"}
        </Button>
      </form>
    </section>
  )
}
