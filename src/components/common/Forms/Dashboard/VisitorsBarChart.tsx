import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TimeRangeSelector } from "@/components/common/Forms/Dashboard/TimeRangeSelector"
import { useTimeRangeFilter } from "@/components/common/Forms/Dashboard/useTimeRangeFilter"
import type { TimeRange } from "@/components/common/Forms/Dashboard/timeRange"
import { generateChartData } from "@/utils/generateChartData"
// Modificar la definición de la función:
export function VisitorsBarChart({ externalData }: { externalData?: any[] }) {
  const [range, setRange] = useState<TimeRange>("7d");

  // Si no hay datos externos, usamos los generados (opcional)
  const baseData = externalData && externalData.length > 0
    ? externalData
    : generateChartData(365);

  const filteredData = useTimeRangeFilter(baseData, range);

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Flujo de Ingresos</CardTitle>
          <CardDescription>Monto total vendido por día</CardDescription>
        </div>
        <TimeRangeSelector value={range} onChange={setRange} />
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            desktop: { label: "Ventas ($)", color: "hsl(var(--primary))" }
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
                new Date(value).toLocaleDateString("es-ES", { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
            />
            {/* 'desktop' ahora representa el monto de dinero vendido */}
            <Bar
              dataKey="desktop"
              name="Total Vendido"
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}