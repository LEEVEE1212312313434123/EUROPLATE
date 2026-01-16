import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TimeRangeSelector } from "@/components/common/Forms/Dashboard/TimeRangeSelector"
import { useTimeRangeFilter } from "@/components/common/Forms/Dashboard/useTimeRangeFilter"
import type { TimeRange } from "@/components/common/Forms/Dashboard/timeRange"
import { generateChartData } from "@/utils/generateChartData"

export function VisitorsBarChart() {
  const [range, setRange] = useState<TimeRange>("7d")

  // Generamos datos para los últimos 12 meses (aprox 365 días)
  const chartData = generateChartData(365)

  const filteredData = useTimeRangeFilter(chartData, range)

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Visitors</CardTitle>
          <CardDescription>Traffic overview</CardDescription>
        </div>
        <TimeRangeSelector value={range} onChange={setRange} />
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={{}} className="h-[250px] w-full">
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
