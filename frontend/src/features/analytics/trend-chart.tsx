import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import type { AnalyticsRange } from "@/features/analytics/range-switcher"
import type { Completion, Habit } from "@/lib/types"
import { parseDateKey } from "@/lib/utils/date"
import { perDayCompletion } from "@/lib/utils/habits"

type TrendChartProps = {
  range: AnalyticsRange
  days: string[]
  habits: Habit[]
  completions: Completion[]
}

export function TrendChart({
  range,
  days,
  habits,
  completions,
}: TrendChartProps) {
  const data = days.map((date) => ({
    date,
    percent: perDayCompletion(habits, completions, date).percent,
  }))
  const scheduled = data.filter(
    (point): point is { date: string; percent: number } =>
      point.percent !== null,
  )

  return (
    <section
      aria-labelledby="trend-title"
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <h2 id="trend-title" className="font-heading text-base font-semibold">
        Completion trend
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Daily completion rate across the selected range.
      </p>

      <figure className="mt-4">
        {scheduled.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No habits were scheduled in this period.
          </p>
        ) : (
          <>
            <div aria-hidden="true" className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  accessibilityLayer={false}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: string) => formatTick(value, range)}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    interval={range === "week" ? 0 : "preserveStartEnd"}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    width={38}
                    tickFormatter={(value: number) => `${value}%`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percent"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={
                      range === "year"
                        ? false
                        : { r: 2, fill: "var(--chart-1)", strokeWidth: 0 }
                    }
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              {summarizeTrend(scheduled)}
            </figcaption>
          </>
        )}
      </figure>
    </section>
  )
}

function formatTick(value: string, range: AnalyticsRange): string {
  const date = parseDateKey(value)
  if (range === "week") return format(date, "EEE")
  if (range === "month") return format(date, "d MMM")
  return format(date, "MMM")
}

function summarizeTrend(points: { date: string; percent: number }[]): string {
  const first = points[0]
  const last = points[points.length - 1]
  const fullDays = points.filter((point) => point.percent === 100).length
  const lowest = Math.min(...points.map((point) => point.percent))
  const firstLabel = format(parseDateKey(first.date), "d MMM")
  const lastLabel = format(parseDateKey(last.date), "d MMM")
  const period =
    first.date === last.date ? firstLabel : `${firstLabel} to ${lastLabel}`

  return `${period}: ${points.length} ${points.length === 1 ? "day" : "days"} with habits scheduled, ${fullDays} at 100%, lowest ${lowest}%.`
}
