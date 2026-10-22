import { Link } from "react-router"
import { AuthShell } from "@/features/auth/auth-shell"
import { LoginForm } from "@/features/auth/login-form"

export function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      description="Pick up your habits where you left off."
      footer={
        <span>
          New to Everyday?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </span>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
