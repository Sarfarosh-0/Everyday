import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ProgressRingProps = {
  /** Fraction between 0 and 1. */
  value: number
  /** Accessible name; announced with the percentage. */
  label: string
  size?: number
  strokeWidth?: number
  className?: string
  children?: ReactNode
}

export function ProgressRing({
  value,
  label,
  size = 176,
  strokeWidth = 14,
  className,
  children,
}: ProgressRingProps) {
  const fraction = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
  const percent = Math.round(fraction * 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - fraction)

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
