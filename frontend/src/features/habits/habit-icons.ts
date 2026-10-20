import {
  Activity,
  Bike,
  BicepsFlexed,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Medal,
  PersonStanding,
  Salad,
  Snowflake,
  Target,
  Timer,
  Trophy,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react"

export type HabitIconOption = {
  key: string
  label: string
  icon: LucideIcon
}

/** Preset fitness icon set; habits store the key, not the component. */
export const HABIT_ICONS: HabitIconOption[] = [
  { key: "dumbbell", label: "Dumbbell", icon: Dumbbell },
  { key: "footprints", label: "Footprints", icon: Footprints },
  { key: "activity", label: "Activity", icon: Activity },
  { key: "bike", label: "Bike", icon: Bike },
  { key: "heart-pulse", label: "Heart pulse", icon: HeartPulse },
  { key: "waves", label: "Swim", icon: Waves },
  { key: "person-standing", label: "Standing", icon: PersonStanding },
  { key: "timer", label: "Timer", icon: Timer },
  { key: "salad", label: "Salad", icon: Salad },
  { key: "droplets", label: "Water", icon: Droplets },
  { key: "wind", label: "Breathing", icon: Wind },
  { key: "snowflake", label: "Cold", icon: Snowflake },
  { key: "flame", label: "Stretch", icon: Flame },
  { key: "target", label: "Target", icon: Target },
  { key: "medal", label: "Medal", icon: Medal },
  { key: "trophy", label: "Trophy", icon: Trophy },
  { key: "biceps", label: "Strength", icon: BicepsFlexed },
]

export const DEFAULT_HABIT_ICON = HABIT_ICONS[0].key
