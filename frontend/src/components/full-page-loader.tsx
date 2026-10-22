type FullPageLoaderProps = {
  label?: string
}

export function FullPageLoader({
  label = "Loading Everyday…",
}: FullPageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-svh place-items-center px-4"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
