import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TimeRangeSelector } from "@/components/common/Forms/Dashboard/TimeRangeSelector"
import { useTimeRangeFilter } from "@/components/common/Forms/Dashboard/useTimeRangeFilter"
import type { TimeRange } from "@/components/common/Forms/Dashboard/timeRange"

type VisitorsBarChartProps = {
  externalData?: any[]
  title?: string
  description?: string
  tooltipLabel?: string
  barLabel?: string
}

export function VisitorsBarChart({
  externalData,
  title = "Flujo de Ingresos",
  description = "Monto total vendido por día",
  tooltipLabel = "Total",
  barLabel = "Monto"
}: VisitorsBarChartProps) {

  const [range, setRange] = useState<TimeRange>("7d")

  const baseData = externalData || []
  const filteredData = useTimeRangeFilter(baseData, range)

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <TimeRangeSelector value={range} onChange={setRange} />
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            desktop: {
              label: barLabel,
              color: "hsl(var(--primary))"
            }
          }}
          className="h-[250px] w-full"
        >
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric"
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={() => tooltipLabel}
                />
              }
            />
            <Bar
              dataKey="desktop"
              name={barLabel}
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}