export type HabitColorOption = {
  value: string
  label: string
}

/** Palette values are mid-tone so one stored hex works in both themes. */
export const HABIT_COLORS: HabitColorOption[] = [
  { value: "#EA580C", label: "Orange" },
  { value: "#D97706", label: "Amber" },
  { value: "#DC2626", label: "Red" },
  { value: "#DB2777", label: "Pink" },
  { value: "#7C3AED", label: "Purple" },
  { value: "#2563EB", label: "Blue" },
  { value: "#0891B2", label: "Cyan" },
  { value: "#0D9488", label: "Teal" },
]

export const DEFAULT_HABIT_COLOR = HABIT_COLORS[0].value

export function getHabitColor(value: string): string {
  return (
    HABIT_COLORS.find((option) => option.value === value)?.value ??
    DEFAULT_HABIT_COLOR
  )
}

/** White or charcoal, whichever reads better on the given background. */
export function readableTextColor(background: string): string {
  const backgroundLuminance = relativeLuminance(background)
  const whiteContrast = contrastRatio(1, backgroundLuminance)
  const charcoalContrast = contrastRatio(
    relativeLuminance("#1C1B19"),
    backgroundLuminance,
  )

  return whiteContrast >= charcoalContrast ? "#FFFFFF" : "#1C1B19"
}

function relativeLuminance(hex: string): number {
  const value = hex.replace("#", "")
  if (!/^[0-9a-f]{6}$/i.test(value)) return 0

  const channels = [0, 2, 4].map((index) => {
    const channel = parseInt(value.slice(index, index + 2), 16) / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(first: number, second: number): number {
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}
