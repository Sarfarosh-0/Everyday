import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="space-y-3 text-center">
        <p className="font-heading text-5xl font-semibold text-primary">404</p>
        <h1 className="font-heading text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  )
}
