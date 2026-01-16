"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TimeRange } from "@/components/common/Forms/Dashboard/timeRange"

const options: { label: string; value: TimeRange }[] = [
  { label: "Ultimos 7 dias", value: "7d" },
  { label: "Ultimos 30 dias", value: "30d" },
  { label: "Ultimos 3 meses", value: "3m" },
  { label: "Ultimos 12 meses", value: "12m" },
]

interface Props {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

export function TimeRangeSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-md border p-1 bg-muted">
      {options.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={value === opt.value ? "default" : "ghost"}
          onClick={() => onChange(opt.value)}
          className={cn(
            "text-xs h-8",
            value === opt.value && "shadow-sm"
          )}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
