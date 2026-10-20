import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import type { z } from "zod"
import { AuthField } from "@/features/auth/auth-field"
import { Button } from "@/components/ui/button"
import { signupSchema } from "@/lib/schemas"
import { useAuthStore } from "@/store/auth-store"

type SignupValues = z.input<typeof signupSchema>

export function SignupForm() {
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)
  const error = useAuthStore((state) => state.error)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function onSubmit(values: SignupValues) {
    const success = await signUp(values)
    if (!success) return

    toast.success("Account created.")
    navigate("/", { replace: true })
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AuthField
        id="name"
        label="Name"
        autoComplete="name"
        placeholder="Alex"
        error={errors.name?.message}
        {...register("name")}
      />
      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <AuthField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
